import { Injectable } from '@nestjs/common';
import { CreatePlanerDto } from './dto/create-planer.dto';
import { UpdatePlanerDto } from './dto/update-planer.dto';

@Injectable()
export class PlanerService {
  create(createPlanerDto: CreatePlanerDto) {
    return 'This action adds a new planer';
  }

  findAll() {
    return `This action returns all planer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} planer`;
  }

  update(id: number, updatePlanerDto: UpdatePlanerDto) {
    return `This action updates a #${id} planer`;
  }

  remove(id: number) {
    return `This action removes a #${id} planer`;
  }
}
