import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { AuthMessage, NotFoundMessage, SuccessMessage } from "src/common/enum/message.enum";
import { Role, Status } from "src/modules/users/enum/user.enum";
import { DeepPartial, FindOptionsWhere, Repository } from "typeorm";
import { AuthJwtPayload } from "../auth/types/auth-payload";
import { S3Service } from "../s3/s3.service";
import { UpdateProfileDto } from "./dto/profile.dto";
import { UserEntity } from "./entities/user.entity";
import { FollowEntity } from "../follow/entities/follow.entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(FollowEntity)
        private followRepository: Repository<FollowEntity>,
        private s3Service: S3Service,
        @Inject(REQUEST) private request: Request,
    ) {}

    async getProfile(username: string) {
        const payload = this.request.user as AuthJwtPayload;
        const user = await this.userRepository.findOne({
            where: { username, role: Role.USER },
            select: {
                id: true,
                username: true,
                avatar: true,
                fullName: true,
                bio: true,
                status: true,
                createdAt: true,
            },
        });
        if (!user) throw new BadRequestException(AuthMessage.NotFoundAccount);
        if (user?.status === Status.PRIVATE) {
            if (payload && payload.sub) {
                const isFollowing = await this.followRepository.findOneBy({
                    followerId: payload.sub,
                    followingId: user.id,
                });
                if (!isFollowing) throw new BadRequestException("این حساب کاربری خصوصی است");

                return user;
            } else {
                throw new BadRequestException("این حساب کاربری خصوصی است");
            }
        } else {
            return user;
        }
    }

    async updateProfile(updateProfileDto: UpdateProfileDto, avatar: Express.Multer.File) {
        const { sub } = this.request.user as AuthJwtPayload;

        const { fullName, bio, gender } = updateProfileDto;
        await this.findOneById(sub);
        const updateObject: DeepPartial<UserEntity> = {};

        if (fullName) updateObject["fullName"] = fullName;
        if (avatar) {
            const { Location } = await this.s3Service.uploadFile(avatar, "avatar");
            if (Location) updateObject["avatar"] = Location;
        }
        if (bio) updateObject["bio"] = bio;
        if (gender) updateObject["gender"] = gender;

        await this.userRepository.update({ id: sub }, updateObject);

        return {
            message: SuccessMessage.UpdateProfile,
        };
    }

    async promoteToArtist() {
        const { sub } = this.request.user as AuthJwtPayload;

        await this.findOneById(sub, Role.USER);

        await this.userRepository.update(sub, { role: Role.ARTIST });

        return {
            message: "شما به خواننده تبدیل شدید",
        };
    }

    async myProfile() {
        const { sub } = this.request.user as AuthJwtPayload;

        if (sub) return await this.findOneById(sub);
    }

    async toggleStatus() {
        const { sub } = this.request.user as AuthJwtPayload;

        const user = await this.findOneById(sub);
        const status = user.status === Status.PUBLIC ? Status.PRIVATE : Status.PUBLIC;

        await this.userRepository.update({ id: sub }, { status });

        return {
            message: `پروفایل شما با موفقیت به ${status} تبدیل شد`,
        };
    }

    async findOneById(id: number, role?: Role) {
        const where: FindOptionsWhere<UserEntity> = { id };
        if (role) where.role = role;

        const user = await this.userRepository.findOne({
            where,
            select: {
                id: true,
                email: true,
                username: true,
                fullName: true,
                avatar: true,
                bio: true,
                gender: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) throw new NotFoundException(NotFoundMessage.User);

        return user;
    }
}
