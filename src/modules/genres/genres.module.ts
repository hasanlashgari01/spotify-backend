import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from "../auth/auth.service";
import { S3Service } from "../s3/s3.service";
import { GenreEntity } from "./entities/genre.entity";
import { GenresController } from "./genres.controller";
import { GenresService } from "./genres.service";
import { UserEntity } from "../users/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [AuthModule, TypeOrmModule.forFeature([GenreEntity, UserEntity])],
    controllers: [GenresController],
    providers: [GenresService, AuthService, S3Service, JwtService],
})
export class GenresModule {}
