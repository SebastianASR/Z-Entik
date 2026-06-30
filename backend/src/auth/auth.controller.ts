import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import type { AuthUser } from './auth-user.type';
import { AuthService } from './auth.service';
import { BlockDemoUsers } from './decorators/block-demo-users.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { Roles } from './decorators/roles.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { DemoUserGuard } from './guards/demo-user.guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: AuthUser) {
    return user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin-check')
  getAdminCheck(@CurrentUser() user: AuthUser) {
    return {
      status: 'ok',
      message: 'Admin access granted',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isDemo: user.isDemo,
      },
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN)
  @Get('staff-check')
  getStaffCheck(@CurrentUser() user: AuthUser) {
    return {
      status: 'ok',
      message: 'Staff access granted',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isDemo: user.isDemo,
      },
    };
  }

  @UseGuards(JwtAuthGuard, DemoUserGuard)
  @BlockDemoUsers()
  @Get('demo-protected-check')
  getDemoProtectedCheck(@CurrentUser() user: AuthUser) {
    return {
      status: 'ok',
      message: 'Non-demo access granted',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isDemo: user.isDemo,
      },
    };
  }
}
