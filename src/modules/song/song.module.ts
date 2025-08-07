import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GenresService } from "../genres/genres.service";
import { S3Service } from "../s3/s3.service";
import { SongGenreEntity } from "./entities/song-genre.entity";
import { SongEntity } from "./entities/song.entity";
import { SongsController } from "./song.controller";
import { SongsService } from "./song.service";
import { GenreEntity } from "../genres/entities/genre.entity";
import { AuthService } from "../auth/auth.service";
import { UserEntity } from "../users/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { FollowEntity } from "../follow/entities/follow.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SongEntity,
            UserEntity,
            GenreEntity,
            SongGenreEntity,
            FollowEntity,
        ]),
    ],
    controllers: [SongsController],
    providers: [SongsService, AuthService, S3Service, GenresService, JwtService],
})
export class SongsModule {}
