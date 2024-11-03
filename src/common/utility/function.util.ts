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

// export function getminutes(start: string, finish: string) {
//   const [hours1, min1, seconds1] = start.split(":").map(Number);
//   const [hours2, min2, seconds2] = finish.split(":").map(Number);

//   const date1 = new Date().setHours(hours1, min1, seconds1, 0);
//   const date2 = new Date().setHours(hours2, min2, seconds2, 0);

//   const diffrenceinmili = Math.floor(date2 - date1 / (1000 * 60));
//   const interval = [];
//   // for (let i = 0; i <= diffrenceinmili; i += 15) {
//   //   interval.push(i);
//   // }

//   // new Date().
//   return {
//     date1,
//     date2,
//     diffrenceinmili,
//     interval,
//   };
// }

export function convertTimeStringtoDate(time: string): Date {
  const [hours, min, seconds] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, min, seconds, 0);
  console.log({
    convertTimeStringtoDate: date,
  });
  return date;
}
export function getTimeDiffrenceInMinutes(
  start_time: string,
  finish_time: string
): number {
  const start = convertTimeStringtoDate(start_time);
  const finish = convertTimeStringtoDate(finish_time);
  const diffrenceinmili = finish.getTime() - start.getTime();
  console.log({
    getTimeDiffrenceInMinutes: Math.floor(diffrenceinmili / (1000 * 60)),
  });
  return Math.floor(diffrenceinmili / (1000 * 60));
}

export function formatTime(date: Date): string {
  const newHour = date.getHours().toString().padStart(2, "0");
  const newMin = date.getMinutes().toString().padStart(2, "0");
  const newSecond = date.getSeconds().toString().padStart(2, "0");
  // console.log({
  //   formatTime: `${newHour}:${newMin}:${newSecond}`,
  // });
  return `${newHour}:${newMin}:${newSecond}`;
}

export function divideTimeDifference(
  start: string,
  end: string,
  intervalMin: number
): string[] {
  const startDate = convertTimeStringtoDate(start);
  const totalmin = getTimeDiffrenceInMinutes(start, end);
  const interval: string[] = [];

  for (let i = 0; i <= totalmin; i += intervalMin) {
    const intervalDate = new Date(startDate);
    intervalDate.setMinutes(startDate.getMinutes() + i);
    interval.push(formatTime(intervalDate));
  }
  // console.log({ divide: interval });
  return interval;
}
