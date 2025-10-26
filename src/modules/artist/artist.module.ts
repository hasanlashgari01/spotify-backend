import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { UserEntity } from "../users/entities/user.entity";
import { ArtistController } from "./artist.controller";
import { ArtistService } from "./artist.service";
import { SongEntity } from "../song/entities/song.entity";

@Module({
    imports: [AuthModule, TypeOrmModule.forFeature([UserEntity, SongEntity])],
    controllers: [ArtistController],
    providers: [ArtistService],
})
export class ArtistModule {}
