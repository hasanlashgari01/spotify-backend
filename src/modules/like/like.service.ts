import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { NotFoundMessage, PublicMessage } from "src/common/enum/message.enum";
import { Repository } from "typeorm";
import { AuthJwtPayload } from "../auth/types/auth-payload";
import { SongEntity } from "../song/entities/song.entity";
import { LikeEntity } from "./entities/like.entity";
import { SongStatus } from "src/common/enum/song.enum";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.util";

@Injectable()
export class LikeService {
    constructor(
        @InjectRepository(SongEntity)
        private songRepository: Repository<SongEntity>,
        @InjectRepository(LikeEntity)
        private likeRepository: Repository<LikeEntity>,
        @Inject(REQUEST) private request: Request,
    ) {}

    async likeToggle(songId: number) {
        const { sub: userId } = this.request.user as AuthJwtPayload;
        const song = await this.checkExistSongById(songId);
        if (song.status === SongStatus.DRAFT) throw new NotFoundException(NotFoundMessage.Song);
        const isLiked = await this.likeRepository.findOneBy({
            userId,
            songId,
        });

        let message = PublicMessage.Liked;
        if (isLiked) {
            await this.likeRepository.delete({ id: isLiked.id });
            message = PublicMessage.DisLike;
        } else {
            await this.likeRepository.insert({
                songId,
                userId,
            });
        }
        return {
            message,
        };
    }

    async myLikes(paginationDto: PaginationDto) {
        const { sub: userId } = this.request.user as AuthJwtPayload;
        const { limit, page, skip } = paginationSolver(paginationDto);

        const [likes, count] = await this.likeRepository.findAndCount({
            where: {
                userId,
                song: {
                    status: SongStatus.PUBLISHED,
                },
            },
            relations: ["song"],
            skip,
            take: limit,
            order: { createdAt: "DESC" },
        });

        return {
            pagination: paginationGenerator(count, page, limit),
            likes,
        };
    }

    async checkExistSongById(id: number) {
        const song = await this.songRepository.findOneBy({ id });
        if (!song) throw new NotFoundException(NotFoundMessage.Song);

        return song;
    }
}
