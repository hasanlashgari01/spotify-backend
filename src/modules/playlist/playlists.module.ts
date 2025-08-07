import { Module } from "@nestjs/common";
import { PlaylistsService } from "./playlists.service";
import { PlaylistsController } from "./playlists.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlaylistEntity } from "./entities/playlist.entity";
import { SongEntity } from "../song/entities/song.entity";
import { PlaylistSongEntity } from "./entities/playlist-song.entity";
import { AuthService } from "../auth/auth.service";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "../users/entities/user.entity";
import { S3Service } from "../s3/s3.service";
import { PlaylistLikeEntity } from "./entities/like.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PlaylistEntity,
            PlaylistSongEntity,
            PlaylistLikeEntity,
            SongEntity,
            UserEntity,
        ]),
    ],
    controllers: [PlaylistsController],
    providers: [AuthService, PlaylistsService, JwtService, S3Service],
})
export class PlaylistsModule {}
