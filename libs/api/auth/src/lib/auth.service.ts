import { UsersService } from '@helpdesk/api/users';
import { AuthResponse, User } from '@helpdesk/shared/interfaces';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { AuthMessages } from './constants/constants/auth.constants';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
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

    const accessToken = await this.generateAccessToken(user);

    return {
      accessToken,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findOneByEmail(loginDto.email);

    if (!user)
      throw new UnauthorizedException(AuthMessages.INVALID_CREDENTIALS);

    const isPasswordValid = await compare(loginDto.password, user.password);

    if (!isPasswordValid)
      throw new UnauthorizedException(AuthMessages.INVALID_CREDENTIALS);

    const accessToken = await this.generateAccessToken(user);

    return {
      accessToken,
    };
  }

  private generateAccessToken(
    user: Pick<User, 'id' | 'email' | 'name'>,
  ): Promise<string> {
    return this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      name: user.name,
    });
  }
}
