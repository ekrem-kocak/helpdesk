import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { PrismaService } from '@helpdesk/api/data-access-db';
import { UsersService } from '@helpdesk/api/users';
import { Role } from '@helpdesk/shared/interfaces';
import { AuthMessages } from './constants/constants/auth.constants';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './types/jwt-payload.type';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async register(registerDto: RegisterDto, ua?: string, ip?: string) {
    const existingUser = await this.usersService.findOneByEmail(
      registerDto.email,
    );

    if (existingUser) throw new ConflictException(AuthMessages.EMAIL_EXISTS);

    const bcryptSaltRounds = this.configService.getOrThrow<number>(
      'security.bcryptSaltRounds',
    );
    const hashedPassword = await hash(registerDto.password, bcryptSaltRounds);

    const user = await this.usersService.create({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
    });

    // Generate tokens and return them
    const tokens = await this.generateTokens(
      user.id,
      user.email,
      user.role,
      ua,
      ip,
    );

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async login(loginDto: LoginDto, ua?: string, ip?: string) {
    const user = await this.usersService.findOneByEmail(loginDto.email);

    if (!user)
      throw new UnauthorizedException(AuthMessages.INVALID_CREDENTIALS);

    const isPasswordValid = await compare(loginDto.password, user.password);

    if (!isPasswordValid)
      throw new UnauthorizedException(AuthMessages.INVALID_CREDENTIALS);

    const tokens = await this.generateTokens(
      user.id,
      user.email,
      user.role,
      ua,
      ip,
    );

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async logout(jti: string): Promise<boolean> {
    try {
      await this.prisma.refreshToken.update({
        where: { id: jti },
        data: { isRevoked: true },
      });
      return true;
    } catch {
      // If the token is not found, return true silently
      return true;
    }
  }

  async refreshTokens(
    userId: string,
    rt: string,
    jti: string,
    ua?: string,
    ip?: string,
  ) {
    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { id: jti },
      include: {
        user: true,
      },
    });

    if (!tokenRecord) throw new ForbiddenException('Access Denied');

    if (tokenRecord.userId !== userId)
      throw new ForbiddenException('Access Denied');

    // 🚨 Reuse detection (Critical Security Check)
    if (tokenRecord.replacedByToken) {
      this.logger.warn(
        `Refresh token reuse detected - User: ${userId}. Revoking all sessions.`,
      );
      // A hacker is trying to use an old token! Revoke all sessions for the user.
      await this.prisma.refreshToken.updateMany({
        where: { userId },
        data: { isRevoked: true },
      });
      throw new ForbiddenException('Access Denied');
    }

    if (tokenRecord.isRevoked) throw new ForbiddenException('Access Denied');

    // Hash check (Token string has changed?)
    const isMatch = await compare(rt, tokenRecord.token);
    if (!isMatch) throw new ForbiddenException('Access Denied');

    // ✅ Token rotation (Revoke old token, return new tokens)
    const tokens = await this.generateTokens(
      userId,
      tokenRecord.user?.email,
      tokenRecord.user?.role,
      ua,
      ip,
    );

    // Update the old token: "You are now invalid, you are replaced by (newJti)"
    await this.prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: {
        isRevoked: true,
        replacedByToken: tokens.jti,
      },
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  private async generateTokens(
    userId: string,
    email: string,
    role: string,
    ua?: string,
    ip?: string,
  ) {
    const jti = crypto.randomUUID();

    const payload: JwtPayload = {
      sub: userId,
      email,
      role: role as Role,
      jti,
    };

    const jwtSecret = this.configService.getOrThrow<string>('jwt.secret');
    const jwtExpiresIn = this.configService.getOrThrow<string>('jwt.expiresIn');
    const jwtRefreshSecret =
      this.configService.getOrThrow<string>('jwt.refreshSecret');
    const jwtRefreshExpiresIn = this.configService.getOrThrow<string>(
      'jwt.refreshExpiresIn',
    );
    const bcryptSaltRounds = this.configService.getOrThrow<number>(
      'security.bcryptSaltRounds',
    );

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: jwtSecret,
        expiresIn: jwtExpiresIn as JwtSignOptions['expiresIn'],
      }),
      this.jwtService.signAsync(payload, {
        secret: jwtRefreshSecret,
        expiresIn: jwtRefreshExpiresIn as JwtSignOptions['expiresIn'],
      }),
    ]);

    // Save to database
    const hashRt = await hash(rt, bcryptSaltRounds);

    await this.prisma.refreshToken.create({
      data: {
        id: jti, // Primary Key = JTI
        userId,
        token: hashRt,
        expiresAt: new Date(
          Date.now() + this.parseExpiresInToMs(jwtRefreshExpiresIn),
        ),
        userAgent: ua,
        ipAddress: ip,
      },
    });

    // Return both tokens and JTI so the caller (refreshTokens) can chain the tokens.
    return {
      accessToken: at,
      refreshToken: rt,
      jti,
    };
  }

  private parseExpiresInToMs(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) return 7 * 24 * 60 * 60 * 1000; // fallback 7 days
    const value = parseInt(match[1], 10);
    const unit = match[2];
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };
    return value * (multipliers[unit] ?? 1000);
  }
}
