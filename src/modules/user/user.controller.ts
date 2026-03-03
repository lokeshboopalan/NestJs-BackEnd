import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { User } from '../user/entities/user.entity'; // your User entity

// Extend Express Request to include user
interface AuthRequest extends Request {
  user: User; // type it as your User entity
}

@Controller('users')
export class UserController {
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: AuthRequest) { 
    console.log("kjdsnfssdshfbjhbf", req.user); // ✅ use extended type
    return req.user;
  }
}