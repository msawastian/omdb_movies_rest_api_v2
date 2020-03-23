import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { ConfigService } from "~config/config.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: (req, rawJwtToken, done) => {
        return done(null, this.configService.getConfig('JWT_SECRET'))
      }
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, username: payload.username, email: payload.email };
  }
}