import { Injectable } from '@nestjs/common';

@Injectable()
export class PlanerService {
  create(createPlanerDto) {
    return 'This action adds a new planer';
  }

  findAll() {
    return `This action returns all planer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} planer`;
  }

  update(id: number, updatePlanerDto) {
    return `This action updates a #${id} planer`;
  }

  remove(id: number) {
    return `This action removes a #${id} planer`;
  }
}
