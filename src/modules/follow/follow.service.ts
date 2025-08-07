import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { AuthMessage, PublicMessage } from "src/common/enum/message.enum";
import { Repository } from "typeorm";
import { AuthJwtPayload } from "../auth/types/auth-payload";
import { UserEntity } from "../users/entities/user.entity";
import { FollowEntity } from "./entities/follow.entity";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.util";

@Injectable()
export class FollowService {
    constructor(
        @InjectRepository(FollowEntity)
        private followRepository: Repository<FollowEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @Inject(REQUEST) private request: Request,
    ) {}

    async toggleFollow(followingId: number) {
        const { sub } = this.request.user as AuthJwtPayload;
        if (sub === followingId) throw new BadRequestException(PublicMessage.CantFollow);
        const following = await this.userRepository.findOneBy({ id: followingId });
        if (!following) throw new NotFoundException(AuthMessage.NotFoundAccount);
        const isFollowing = await this.followRepository.findOneBy({ followingId, followerId: sub });

        let message: string = PublicMessage.Followed;
        if (isFollowing) {
            message = PublicMessage.UnFollow;
            await this.followRepository.remove(isFollowing);
        } else {
            await this.followRepository.insert({ followingId, followerId: sub });
        }

        return {
            message,
        };
    }

    async getFollowersCount(userId: number) {
        const result = await this.followRepository.count({
            where: { followingId: userId },
        });

        return result;
    }

    async getFollowingsCount(userId: number) {
        const result = await this.followRepository.count({
            where: { followerId: userId },
        });

        return result;
    }

    async getFollowers(userId: number, paginationDto: PaginationDto) {
        const { limit, page, skip } = paginationSolver(paginationDto);

        const [followers, count] = await this.followRepository.findAndCount({
            where: { followingId: userId },
            relations: {
                follower: true,
            },
            select: {
                follower: {
                    id: true,
                    fullName: true,
                    avatar: true,
                    role: true,
                },
            },
            skip,
            take: limit,
            order: { createdAt: "DESC" },
        });

        return {
            pagination: paginationGenerator(count, page, limit),
            followers,
        };
    }

    async getFollowings(userId: number, paginationDto: PaginationDto) {
        const { limit, page, skip } = paginationSolver(paginationDto);

        const [followings, count] = await this.followRepository.findAndCount({
            where: { followerId: userId },
            relations: {
                following: true,
            },
            select: {
                following: {
                    id: true,
                    fullName: true,
                    avatar: true,
                    role: true,
                },
            },
            skip,
            take: limit,
            order: { createdAt: "DESC" },
        });

        return {
            pagination: paginationGenerator(count, page, limit),
            followings,
        };
    }
}
