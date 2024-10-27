import { Module } from '@nestjs/common';
import { ClinicService } from './clinic.service';
import { ClinicController } from './clinic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicEntity } from './entities/clinic.entity';
import { ClinicOtpEntity } from './entities/clinicOtp.entity';
import { CategoryEntity } from '../category/entities/category.entity';
import { S3Service } from '../s3/s3.service';
import { JwtService } from '@nestjs/jwt';
import { CategoryService } from '../category/category.service';

@Module({
  imports:[TypeOrmModule.forFeature([ClinicEntity,ClinicOtpEntity,CategoryEntity])],
  controllers: [ClinicController],
  providers: [ClinicService,S3Service,JwtService,CategoryService],
  exports:[ClinicService,JwtService,S3Service,TypeOrmModule]
})
export class ClinicModule {}
