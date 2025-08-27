import { NestFactory } from "@nestjs/core";
import { SwaggerConfigInit } from "./config/swagger.config";
import { AppModule } from "./modules/app/app.module";
import { ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    const PORT = process.env.PORT || 3000;

    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    SwaggerConfigInit(app);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );
    await app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`);
        console.log(`http://localhost:${PORT}/swagger`);
    });
}

bootstrap();
