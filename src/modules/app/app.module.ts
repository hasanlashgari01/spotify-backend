import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfig } from "src/config/typeorm.config";
import { AdminModule } from "../admin/admin.module";
import { AuthModule } from "../auth/auth.module";
import { FollowModule } from "../follow/follow.module";
import { GenresModule } from "../genres/genres.module";
import { LikeModule } from "../like/like.module";
import { PlaylistsModule } from "../playlist/playlists.module";
import { SongsModule } from "../song/song.module";
import { UserEntity } from "../users/entities/user.entity";
import { UserModule } from "../users/user.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot(TypeOrmConfig()),
        AdminModule,
        AuthModule,
        FollowModule,
        GenresModule,
        PlaylistsModule,
        SongsModule,
        UserModule,
        UserEntity,
        LikeModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
