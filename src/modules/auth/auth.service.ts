import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async register(dto) {
    const existing = await this.userService.findByEmail(dto.email);

    if (existing) throw new BadRequestException('Email already exists');

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = await this.userService.create({
      email: dto.email,
      password: hashed,
    });

    return { message: 'User registered successfully', userId: user.id };
  }

  async login(dto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async forgotPassword(email: string) {
  const user = await this.userService.findByEmail(email);

  if (!user) {
    return { message: 'If email exists, OTP sent' };
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await this.userService.update(user.id, {
    resetOtp: otp,
    resetOtpExpiry: new Date(Date.now() + 10 * 60 * 1000),
  });

  await this.emailService.sendOtpEmail(user.email, otp);

  return { message: 'OTP sent to email' };
}

  async resetPassword(email: string,otp: string,newPassword: string) {
  const user = await this.userService.findByEmail(email);
  console.log(user,'userjlkfnkj')

  if (!user || !user.resetOtp || !user.resetOtpExpiry) {
    throw new BadRequestException('Invalid request');
  }

  if (user.resetOtp !== otp) {
    throw new BadRequestException('Invalid OTP');
  }

  if (user.resetOtpExpiry < new Date()) {
    throw new BadRequestException('OTP expired');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await this.userService.update(user.id, {
    password: hashedPassword,
    resetOtp: null,
    resetOtpExpiry: null,
  });

  return { message: 'Password reset successful' };
}
}