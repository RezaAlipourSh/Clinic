import { BadRequestException } from "@nestjs/common";

export function convertToTimeFormat(string: string) {
  if (string.length !== 6)
    throw new BadRequestException("time must be 6 digit");

  const [hours, min, sec] = string.match(/.{1,2}/g); //split by two with regex

  return `${hours}:${min}:${sec}`;
}
