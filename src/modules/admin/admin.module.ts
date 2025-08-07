import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { AuthService } from "../auth/auth.service";
import { GenresService } from "../genres/genres.service";
import { S3Service } from "../s3/s3.service";
import { UserEntity } from "../users/entities/user.entity";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { GenreEntity } from "../genres/entities/genre.entity";
import { PlaylistEntity } from "../playlist/entities/playlist.entity";
import { SongEntity } from "../song/entities/song.entity";

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([UserEntity, GenreEntity, PlaylistEntity, SongEntity]),
    ],
    controllers: [AdminController],
    providers: [AdminService, AuthService, S3Service, JwtService, GenresService],
})
export class AdminModule {}
