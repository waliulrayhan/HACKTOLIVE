import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Patch,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto, UpdateSocialLinksDto, ChangePasswordDto } from './dto/update-profile.dto';
import { VerifyOtpDto, SendPasswordResetOtpDto, ResetPasswordDto, VerifyPasswordResetOtpDto, ResendOtpDto } from './dto/otp.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GoogleAuthGuard } from './google-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user - sends OTP for verification' })
  @ApiResponse({ status: 201, description: 'OTP sent to email for verification' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('verify-registration')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP after registration' })
  @ApiResponse({ status: 200, description: 'Email verified, user registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  async verifyRegistration(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyRegistrationOtp(
      verifyOtpDto.userId,
      verifyOtpDto.code,
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password - sends OTP for verification' })
  @ApiResponse({ status: 200, description: 'OTP sent to email' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('verify-login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP to complete login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  async verifyLogin(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyLoginOtp(
      verifyOtpDto.userId,
      verifyOtpDto.code,
    );
  }

  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend OTP for verification' })
  @ApiResponse({ status: 200, description: 'OTP resent successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    return this.authService.resendOtp(
      resendOtpDto.userId,
      resendOtpDto.type,
    );
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset OTP' })
  @ApiResponse({ status: 200, description: 'Password reset OTP sent to email' })
  async forgotPassword(@Body() sendOtpDto: SendPasswordResetOtpDto) {
    return this.authService.sendPasswordResetOtp(sendOtpDto.email);
  }

  @Post('verify-password-reset-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify password reset OTP before resetting password' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  async verifyPasswordResetOtp(@Body() verifyOtpDto: VerifyPasswordResetOtpDto) {
    return this.authService.verifyPasswordResetOtp(
      verifyOtpDto.email,
      verifyOtpDto.code,
    );
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using OTP' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPasswordWithOtp(
      resetPasswordDto.email,
      resetPasswordDto.code,
      resetPasswordDto.newPassword,
    );
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.id);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(
    @Request() req: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(req.user.id, updateProfileDto);
  }

  @Patch('profile/social-links')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user social media links' })
  @ApiResponse({ status: 200, description: 'Social links updated successfully' })
  async updateSocialLinks(
    @Request() req: any,
    @Body() updateSocialLinksDto: UpdateSocialLinksDto,
  ) {
    return this.authService.updateSocialLinks(req.user.id, updateSocialLinksDto);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid old password' })
  async changePassword(
    @Request() req: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(
      req.user.id,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
  }

  @Get('verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify JWT token' })
  @ApiResponse({ status: 200, description: 'Token is valid' })
  async verify(@Request() req: any) {
    return {
      valid: true,
      user: req.user,
    };
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  async googleAuth() {
    // Guard redirects to Google
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleAuthCallback(@Request() req: any, @Res() res: Response) {
    const result = await this.authService.googleLogin(req.user);
    
    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}/auth/google/callback?token=${result.token}&user=${encodeURIComponent(JSON.stringify(result.user))}`;
    
    return res.redirect(redirectUrl);
  }
}
