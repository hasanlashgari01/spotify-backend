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
import { FollowingRaw } from "./types/raw.type";

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
                    username: true,
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
        const { sub } = this.request.user as AuthJwtPayload;
        const { limit, page, skip } = paginationSolver(paginationDto);

        const count = await this.followRepository.count({
            where: { followerId: userId },
        });

        const followings: FollowingRaw[] = await this.followRepository
            .createQueryBuilder("follow")
            .leftJoin("follow.following", "following")
            .leftJoin(
                "follow",
                "currentUserFollow",
                "currentUserFollow.followingId = follow.followingId AND currentUserFollow.followerId = :currentUserId",
                { currentUserId: sub },
            )
            .where("follow.followerId = :userId", { userId })
            .select([
                "following.id",
                "following.fullName",
                "following.username",
                "following.avatar",
                "following.role",
                "MAX(CASE WHEN currentUserFollow.id IS NOT NULL THEN 1 ELSE 0 END) as isFollowed",
            ])
            .groupBy("following.id")
            .addGroupBy("following.fullName")
            .addGroupBy("following.username")
            .addGroupBy("following.avatar")
            .addGroupBy("following.role")
            .skip(skip)
            .take(limit)
            .orderBy("follow.createdAt", "DESC")
            .getRawMany();

        const result = followings.map((f) => ({
            id: Number(f.following_id),
            fullName: f.following_fullName,
            username: f.following_username,
            avatar: f.following_avatar,
            role: f.following_role,
            isFollowed: Number(f.isFollowed) === 1,
        }));

        return {
            pagination: paginationGenerator(count, page, limit),
            followings: result,
        };
    }
}
