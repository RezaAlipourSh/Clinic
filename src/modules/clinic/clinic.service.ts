import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClinicEntity } from "./entities/clinic.entity";
import { Repository } from "typeorm";
import { ClinicOtpEntity } from "./entities/clinicOtp.entity";
import { CategoryService } from "../category/category.service";
import { JwtService } from "@nestjs/jwt";
import { S3Service } from "../s3/s3.service";
import { REQUEST } from "@nestjs/core";
import { ClinicSignupDto } from "./dto/clinic.dto";
import { randomInt } from "crypto";
import { TokensPayload } from "../auth/types/payload";
import { checkOtpDto } from "../auth/dto/otp.dto";

@Injectable({ scope: Scope.REQUEST })
export class ClinicService {
  constructor(
    @InjectRepository(ClinicEntity)
    private clinicRepo: Repository<ClinicEntity>,
    @InjectRepository(ClinicOtpEntity)
    private clinicOtpRepo: Repository<ClinicOtpEntity>,
    private categoryService: CategoryService,
    private jwtService: JwtService,
    private s3Service: S3Service,
    @Inject(REQUEST) private req: Request
  ) {}

  async create(clinicDto: ClinicSignupDto) {
    const { address, categoryId, cost, first_name, last_name, mobile } =
      clinicDto;

    const clinic = await this.clinicRepo.findOneBy({ mobile });
    if (clinic) throw new ConflictException("clinic Account Already Exist");
    const category = await this.categoryService.findOneById(categoryId);

    const account = this.clinicRepo.create({
      categoryId: category.id,
      mobile,
      address,
      cost,
      first_name,
      last_name,
    });
    await this.clinicRepo.save(account);
    await this.createOtpClinic(account);

    return {
      message: "otp Code Sent",
    };
  }
  async checkOtp(otpDto: checkOtpDto) {
    const { code, mobile } = otpDto;
    const now = new Date();
    const clinic = await this.clinicRepo.findOne({
      where: { mobile },
      relations: {
        otp: true,
      },
    });

    if (!clinic || !clinic?.otp) {
      throw new UnauthorizedException("Not found Account");
    }
    const otp = clinic?.otp;
    if (otp?.code !== code) {
      throw new UnauthorizedException("incorrect Otp Code");
    }
    if (otp?.expires_in < now)
      throw new UnauthorizedException("Otp Code Expired");
    if (!clinic.mobile_verify) {
      await this.clinicRepo.update(
        { id: clinic.id },
        {
          mobile_verify: true,
        }
      );
    }
    const { accessToken, refreshToken } = this.makeToken({ id: clinic.id });
    return {
      accessToken,
      refreshToken,
      message: "Logged In",
    };
  }

  async createOtpClinic(clinic: ClinicEntity) {
    const expiresIn = new Date(new Date().getTime() + 1000 * 60 * 2);
    const code = randomInt(10000, 99999).toString();
    let otp = await this.clinicOtpRepo.findOneBy({ clinicId: clinic.id });
    if (otp) {
      if (otp.expires_in > new Date()) {
        throw new BadRequestException("otp code not Expired");
      }
      otp.code = code;
      otp.expires_in = expiresIn;
    } else {
      otp = this.clinicOtpRepo.create({
        code,
        expires_in: expiresIn,
        clinicId: clinic.id,
      });
    }
    otp = await this.clinicOtpRepo.save(otp);
    clinic.otpId = otp.id;
    await this.clinicRepo.save(clinic);
  }

  makeToken(payload: TokensPayload) {
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

  async findOneById(id: number) {
    const clinic = await this.clinicRepo.findOneBy({ id });
    if (!clinic) throw new NotFoundException("Clinic Not Found with this Id");
    return clinic;
  }

  async validateAccessToken(token: string) {
    try {
      const payload = this.jwtService.verify<TokensPayload>(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
      if (typeof payload === "object" && payload?.id) {
        const clinic = await this.clinicRepo.findOneBy({ id: payload.id });
        if (!clinic) {
          throw new UnauthorizedException("Login on your Account");
        }
        return {
          id: clinic.id,
          first_name: clinic.first_name,
          last_name: clinic.last_name,
          mobile: clinic.mobile,
        };
      }
      throw new UnauthorizedException("Login on your account");
    } catch (error) {
      throw new UnauthorizedException("Login on your account");
    }
  }
}
