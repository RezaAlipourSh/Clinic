import { Module } from '@nestjs/common';
import { PlanerService } from './planer.service';
import { PlanerController } from './planer.controller';

@Module({
  controllers: [PlanerController],
  providers: [PlanerService],
})
export class PlanerModule {}
