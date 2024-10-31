import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app/app.module";
import { SwaggerConfigInit } from "./config/swagger.config";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerConfigInit(app);
  app.useGlobalPipes(new ValidationPipe()); //validating dtos in forms

  const { PORT, APP_URL } = process.env;
  await app.listen(PORT, () => {
    console.log(`${APP_URL}${PORT}`);
    console.log(`${APP_URL}${PORT}/swagger`);
  });
}
bootstrap();
