import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../users/entities/user.entity";
import { SongEntity } from "../song/entities/song.entity";
import { PlaylistEntity } from "../playlist/entities/playlist.entity";
import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";
import { PlaylistSongEntity } from "../playlist/entities/playlist-song.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, SongEntity, PlaylistEntity, PlaylistSongEntity]),
    ],
    controllers: [SearchController],
    providers: [SearchService],
})
export class SearchModule {}
