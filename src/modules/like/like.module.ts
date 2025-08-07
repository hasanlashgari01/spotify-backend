import { Module } from "@nestjs/common";
import { LikeService } from "./like.service";
import { LikeController } from "./like.controller";
import { AuthModule } from "../auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SongEntity } from "../song/entities/song.entity";
import { LikeEntity } from "./entities/like.entity";

@Module({
    imports: [AuthModule, TypeOrmModule.forFeature([SongEntity, LikeEntity])],
    controllers: [LikeController],
    providers: [LikeService],
})
export class LikeModule {}
