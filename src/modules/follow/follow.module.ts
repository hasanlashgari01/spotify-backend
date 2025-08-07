import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { UserEntity } from "../users/entities/user.entity";
import { FollowEntity } from "./entities/follow.entity";
import { FollowController } from "./follow.controller";
import { FollowService } from "./follow.service";

@Module({
    imports: [AuthModule, TypeOrmModule.forFeature([FollowEntity, UserEntity])],
    controllers: [FollowController],
    providers: [FollowService],
})
export class FollowModule {}
