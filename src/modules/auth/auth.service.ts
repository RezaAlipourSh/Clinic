import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { Repository } from "typeorm";
import { UserOtpEntity } from "../user/entities/userotp.entity";
import { randomInt } from "crypto";
import { SendOtpDto } from "./dto/otp.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(UserOtpEntity)
    private userOtpRepo: Repository<UserOtpEntity>
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
}
