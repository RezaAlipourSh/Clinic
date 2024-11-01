import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { Repository } from "typeorm";
import { UserOtpEntity } from "../user/entities/userotp.entity";
import { randomInt } from "crypto";
import { checkOtpDto, SendOtpDto } from "./dto/otp.dto";
import { JwtService } from "@nestjs/jwt";
import { TokensPayload } from "./types/payload";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(UserOtpEntity)
    private userOtpRepo: Repository<UserOtpEntity>,
    private jwtService: JwtService
  ) {}

  async sendOtp(otpDto: SendOtpDto) {
    const { mobile } = otpDto;
    let user = await this.userRepo.findOneBy({ mobile });
    if (!user) {
      user = this.userRepo.create({ mobile });
      user = await this.userRepo.save(user);
    }
    await this.createOtp(user);
    return {
      message: "Otp Code Sent Successfully",
    };
  }

  async checkOtp(otpDto: checkOtpDto) {
    const { code, mobile } = otpDto;
    const now = new Date();
    const user = await this.userRepo.findOne({
      where: { mobile },
      relations: {
        otp: true,
      },
    });
    if (!user || !user?.otp)
      throw new UnauthorizedException("not found Account");
    const otp = user?.otp;
    if (otp?.code !== code)
      throw new UnauthorizedException("code is Incorrect");
    if (otp.expires_in < now)
      throw new UnauthorizedException("code is Expired");
    if (!user.mobile_verify) {
      await this.userRepo.update(
        { id: user.id },
        {
          mobile_verify: true,
        }
      );
    }
    const { accessToken, refreshToken } = this.makeTokens({ id: user.id });
    return {
      accessToken,
      refreshToken,
      message: "Login Successfully",
    };
  }

  async createOtp(user: UserEntity) {
    const expiresIn = new Date(new Date().getTime() + 1000 * 60 * 2);
    const code = randomInt(10000, 99999).toString();
    let otp = await this.userOtpRepo.findOneBy({ userId: user.id });
    if (otp) {
      if (otp.expires_in > new Date()) {
        throw new BadRequestException("otp code Expired");
      }
      otp.code = code;
      otp.expires_in = expiresIn;
    } else {
      otp = this.userOtpRepo.create({
        code,
        expires_in: expiresIn,
        userId: user.id,
      });
    }

    otp = await this.userOtpRepo.save(otp);
    user.otpId = otp.id;
    await this.userRepo.save(user);
  }

  makeTokens(payload: TokensPayload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: "30d",
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: "1y",
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateAccessToken(token: string) {
    try {
      const payload = this.jwtService.verify<TokensPayload>(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
      if (typeof payload === "object" && payload?.id) {
        const user = await this.userRepo.findOneBy({ id: payload.id });
        if (!user) {
          throw new UnauthorizedException("Login On Your Acoount");
        }
        return user;
      }
      throw new UnauthorizedException("Login on your account");
    } catch (error) {
      throw new UnauthorizedException("Login on your account");
    }
  }
}
