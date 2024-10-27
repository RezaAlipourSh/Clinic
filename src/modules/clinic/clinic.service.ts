import { Injectable } from '@nestjs/common';


@Injectable()
export class ClinicService {
  create(createClinicDto) {
    return 'This action adds a new clinic';
  }

  findAll() {
    return `This action returns all clinic`;
  }

  findOne(id: number) {
    return `This action returns a #${id} clinic`;
  }

  update(id: number, updateClinicDto) {
    return `This action updates a #${id} clinic`;
  }

  remove(id: number) {
    return `This action removes a #${id} clinic`;
  }
}
