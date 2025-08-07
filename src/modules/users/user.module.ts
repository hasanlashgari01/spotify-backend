import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { UserEntity } from "./entities/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { S3Service } from "../s3/s3.service";
import { FollowEntity } from "../follow/entities/follow.entity";

@Module({
    imports: [AuthModule, TypeOrmModule.forFeature([UserEntity, FollowEntity])],
    controllers: [UserController],
    providers: [UserService, S3Service],
})
export class UserModule {}
