import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "../auth/auth.module";
import {UserEntity} from "../users/entities/user.entity";
import {ArtistController} from "./artist.controller";
import {ArtistService} from "./artist.service";

@Module({
    imports: [AuthModule, TypeOrmModule.forFeature([UserEntity])],
    controllers: [ArtistController],
    providers: [ArtistService],
})
export class ArtistModule {
}
