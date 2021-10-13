import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcryptjs';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from './repositories/users.repository';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { SignInResponse } from './interfaces/signInResponse.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    readonly usersRepository: UsersRepository,
    readonly jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { password, username } = authCredentialsDto;

    const hashedPassword = await hash(password, 10);

    return await this.usersRepository.createUser({
      username,
      password: hashedPassword,
    });
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<SignInResponse> {
    const { username, password } = authCredentialsDto;

    const user = await this.usersRepository.findOne({ username });

    if (!user) {
      throw new UnauthorizedException('please check your login credentials');
    }

    const passwordMatches = await compare(password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('please check your login credentials');
    }

    const payload: JwtPayload = { username };

    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
