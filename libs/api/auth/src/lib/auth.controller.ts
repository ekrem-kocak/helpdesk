import { UserEntity } from '@helpdesk/api/users';
import { AuthResponse, User } from '@helpdesk/shared/interfaces';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RtGuard } from './guards/rt.guard';
import {
  clearRefreshTokenCookie,
  setRefreshTokenCookie,
} from '@helpdesk/api/shared';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  private refreshTokenExpiresIn = this.configService.getOrThrow<string>(
    'jwt.refreshExpiresIn',
  );

  @Throttle({ default: { limit: 3, ttl: 1000 } }) // 3 requests per 1 second
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  async login(
    @Body() loginDto: LoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    const userAgent = request.get('user-agent');
    const ip = request.ip;

    const token = await this.authService.login(loginDto, userAgent, ip);
    setRefreshTokenCookie(response, token.refreshToken, {
      refreshExpiresIn: this.refreshTokenExpiresIn,
    });

    return {
      accessToken: token.accessToken,
    };
  }

  @Post('register')
  @ApiOperation({ summary: 'User register' })
  async register(
    @Body() registerDto: RegisterDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    const userAgent = request.get('user-agent');
    const ip = request.ip;

    const token = await this.authService.register(registerDto, userAgent, ip);
    setRefreshTokenCookie(response, token.refreshToken, {
      refreshExpiresIn: this.refreshTokenExpiresIn,
    });

    return {
      accessToken: token.accessToken,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout current session' })
  async logout(
    @CurrentUser('jti') jti: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<boolean> {
    clearRefreshTokenCookie(response);
    return await this.authService.logout(jti);
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Tokens refreshed successfully' })
  async refreshTokens(
    @CurrentUser('sub') userId: string,
    @CurrentUser('refreshToken') refreshToken: string,
    @CurrentUser('jti') jti: string,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponse> {
    const userAgent = request.get('user-agent');
    const ip = request.ip;

    const tokens = await this.authService.refreshTokens(
      userId,
      refreshToken,
      jti,
      userAgent,
      ip,
    );
    setRefreshTokenCookie(response, tokens.refreshToken, {
      refreshExpiresIn: this.refreshTokenExpiresIn,
    });
    return {
      accessToken: tokens.accessToken,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  getProfile(@CurrentUser() user: User): UserEntity {
    return new UserEntity(user);
  }
}
