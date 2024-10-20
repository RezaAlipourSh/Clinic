import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app/app.module";
import { SwaggerConfigInit } from "./config/swagger.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerConfigInit(app);

  const { PORT, APP_URL } = process.env;
  await app.listen(PORT, () => {
    console.log(`${APP_URL}${PORT}`);
    console.log(`${APP_URL}${PORT}/swagger`);
  });
}
bootstrap();
