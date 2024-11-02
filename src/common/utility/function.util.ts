import { BadRequestException } from "@nestjs/common";

export function convertToTimeFormat(string: string) {
  if (string.length !== 6)
    throw new BadRequestException("time must be 6 digit");

  const [hours, min, sec] = string.match(/.{1,2}/g); //split by two with regex

  return `${hours}:${min}:${sec}`;
}

export function addMinutesToTime(timeString: string, minutes: number) {
  //split  the time string
  const [hours, min, seconds] = timeString.split(":").map(Number);
  //create new date object with currenttime
  const date = new Date();
  date.setHours(hours, min, seconds);
  //add Minutes
  date.setMinutes(date.getMinutes() + minutes);
  //format the new time to 'hh:mm:ss' format
  const newHour = date.getHours().toString().padStart(2, "0");
  const newMin = date.getMinutes().toString().padStart(2, "0");
  const newSecond = date.getSeconds().toString().padStart(2, "0");

  return `${newHour}:${newMin}:${newSecond}`;
}
