import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy as StrategyPassportJwt, ExtractJwt } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(StrategyPassportJwt) {
  constructor(
    @InjectRepository(UsersRepository)
    readonly usersRepository: UsersRepository,
  ) {
    super({
      secretOrKey: 'secretIsMuchSecret',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(jwtPayload: JwtPayload): Promise<User> {
    const { username } = jwtPayload;

    const user = await this.usersRepository.findOne({ username });

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
