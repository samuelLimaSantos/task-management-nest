import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { SignInResponse } from './interfaces/signInResponse.interface';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    await this.authService.signUp(authCredentialsDto);
  }

  @Post('signin')
  @HttpCode(200)
  async signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<SignInResponse> {
    return await this.authService.signIn(authCredentialsDto);
  }
}
