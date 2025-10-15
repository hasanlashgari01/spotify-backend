import {
    BadRequestException,
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { BadRequestMessage, NotFoundMessage, PublicMessage } from "src/common/enum/message.enum";
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.util";
import { generateRandomSlug } from "src/common/utils/random.utils";
import { FindOptionsWhere, Repository } from "typeorm";
import { AuthJwtPayload } from "../auth/types/auth-payload";
import { S3Service } from "../s3/s3.service";
import { SongEntity } from "../song/entities/song.entity";
import { CreatePlaylistDto } from "./dto/create-playlist.dto";
import { UpdatePlaylistDto } from "./dto/update-playlist.dto";
import { PlaylistLikeEntity } from "./entities/like.entity";
import { PlaylistSongEntity } from "./entities/playlist-song.entity";
import { PlaylistEntity } from "./entities/playlist.entity";
import { Status } from "./enum/status.enum";

@Injectable()
export class PlaylistsService {
    constructor(
        @InjectRepository(PlaylistEntity)
        private playlistRepository: Repository<PlaylistEntity>,
        @InjectRepository(PlaylistSongEntity)
        private playlistSongRepository: Repository<PlaylistSongEntity>,
        @InjectRepository(SongEntity)
        private songRepository: Repository<SongEntity>,
        @InjectRepository(PlaylistLikeEntity)
        private playlistLikeRepository: Repository<PlaylistLikeEntity>,
        private s3Service: S3Service,
        @Inject(REQUEST) private request: Request,
    ) {}

    async create(createPlaylistDto: CreatePlaylistDto, cover?: Express.Multer.File) {
        const { sub } = this.request.user as AuthJwtPayload;
        const { title, description } = createPlaylistDto;

        const slug = await this.generateUniqueSlug();
        let image: string = "";
        if (cover) {
            const { Location } = await this.s3Service.uploadFile(cover, "playlist");
            image = Location;
        }

        await this.playlistRepository.insert({
            title,
            description,
            slug,
            ownerId: sub,
            cover: image,
        });

        return {
            message: "پلی لیست ساخته شد",
        };
    }

    async findAllPublic(paginationDto: PaginationDto) {
        const user = this.request?.user as AuthJwtPayload;
        const { limit, page, skip } = paginationSolver(paginationDto);
        const where: FindOptionsWhere<PlaylistEntity> = {};

        if (!user?.sub) where.status = Status.PUBLIC;

        const [playlists, count] = await this.playlistRepository.findAndCount({
            where,
            skip,
            take: limit,
            order: { createdAt: "DESC" },
        });

        return {
            playlists,
            pagination: paginationGenerator(count, page, limit),
        };
    }

    async findOne(
        slug: string,
        paginationDto: PaginationDto,
        sortBy: "title" | "artist" | "createdAt" | "duration" = "createdAt",
        order: "ASC" | "DESC" = "DESC",
    ) {
        const { limit, page, skip } = paginationSolver(paginationDto);
        const user = this.request?.user as AuthJwtPayload;
        const where: FindOptionsWhere<PlaylistEntity> = {
            slug,
        };

        if (user?.sub) {
            const existPlaylist = await this.playlistRepository.findOne({ where: { slug } });
            if (existPlaylist?.ownerId != user.sub) where.status = Status.PUBLIC;
        } else {
            where.status = Status.PUBLIC;
        }

        const playlist = await this.playlistRepository.findOne({
            where,
            relations: ["owner"],
            select: {
                owner: {
                    id: true,
                    username: true,
                    fullName: true,
                    avatar: true,
                },
            },
        });

        if (!playlist) throw new NotFoundException(NotFoundMessage.Playlist);

        let orderField: string;
        switch (sortBy) {
            case "title":
                orderField = "song.title";
                break;
            case "artist":
                orderField = "artist.fullName";
                break;
            case "duration":
                orderField = "song.duration";
                break;
            default:
                orderField = "song.createdAt";
        }

        const query = this.playlistSongRepository
            .createQueryBuilder("playlistSong")
            .innerJoinAndSelect("playlistSong.song", "song")
            .innerJoin("song.artist", "artist")
            .addSelect(["artist.id", "artist.username", "artist.fullName"])
            .where("playlistSong.playlistId = :playlistId", { playlistId: playlist.id })
            .orderBy(orderField, order)
            .skip(skip)
            .take(limit);

        const [songsOfPlaylist, count] = await query.getManyAndCount();

        let isLiked = null;
        if (user) {
            isLiked = await this.playlistLikeRepository.findOneBy({
                playlistId: playlist.id,
                userId: user.sub,
            });
        }

        return {
            ...playlist,
            isLiked: isLiked ? true : false,
            songs: songsOfPlaylist,
            count,
            pagination: paginationGenerator(count, page, limit),
        };
    }

    async myPlaylist(paginationDto: PaginationDto) {
        const { limit, page, skip } = paginationSolver(paginationDto);
        const { sub: userId } = this.request.user as AuthJwtPayload;

        const [playlists, count] = await this.playlistRepository.findAndCount({
            where: { ownerId: userId },
            skip,
            take: limit,
            order: { createdAt: "DESC" },
        });

        return {
            playlists,
            pagination: paginationGenerator(count, page, limit),
        };
    }

    async update(id: number, updatePlaylistDto: UpdatePlaylistDto, cover?: Express.Multer.File) {
        const { sub } = this.request.user as AuthJwtPayload;
        const { title, description } = updatePlaylistDto;

        const playlist = await this.findOneById(id);
        if (playlist.ownerId != sub) throw new NotFoundException(NotFoundMessage.Playlist);

        if (title) playlist.title = title;
        if (description) playlist.description = description;
        if (cover) {
            const { Location } = await this.s3Service.uploadFile(cover, "playlist");
            playlist.cover = Location;
        }

        await this.playlistRepository.update(id, playlist);

        return {
            message: "پلی لیست آپدیت شد",
        };
    }

    async remove(id: number) {
        await this.findOneById(id);

        const result = await this.playlistRepository.delete(id);
        if (result.affected) await this.playlistSongRepository.delete({ playlistId: id });

        return {
            message: "ژانر با موفقیت حذف شد",
        };
    }

    async toggleStatus(id: number) {
        const user = this.request?.user as AuthJwtPayload;
        const playlist = await this.findOneById(id);

        if (playlist.ownerId != user.sub) {
            throw new ForbiddenException("شما اجازه ویرایش این پلی‌لیست را ندارید");
        }

        const status = playlist.status === Status.PUBLIC ? Status.PRIVATE : Status.PUBLIC;

        await this.playlistRepository.update(id, {
            status,
        });

        return {
            message: "پلی لیست ویرایش شد",
        };
    }

    async addSongToPlaylist(playlistId: number, songId: number) {
        const { sub } = this.request.user as AuthJwtPayload;

        const playlist = await this.playlistRepository.findOneBy({ id: playlistId, ownerId: sub });
        if (!playlist) throw new NotFoundException(NotFoundMessage.Playlist);
        const song = await this.songRepository.findOneBy({ id: songId });
        if (!song) throw new NotFoundException(NotFoundMessage.Song);

        await this.playlistSongRepository.insert({
            songId,
            playlistId,
        });

        return {
            message: "آهنگ به پلی لیست اضافه شد",
        };
    }

    async removeSongFromPlaylist(playlistId: number, songId: number) {
        const { sub } = this.request.user as AuthJwtPayload;

        const playlist = await this.playlistRepository.findOneBy({
            id: playlistId,
            ownerId: sub,
        });
        if (!playlist) throw new NotFoundException(NotFoundMessage.Playlist);
        const song = await this.playlistSongRepository.findOneBy({
            songId,
            playlistId,
        });
        if (!song) throw new NotFoundException(NotFoundMessage.SongPlaylist);

        await this.playlistSongRepository.delete({
            songId,
            playlistId,
        });

        return {
            message: "آهنگ از پلی لیست حذف شد",
        };
    }

    async toggleLike(playlistId: number) {
        const { sub: userId } = this.request.user as AuthJwtPayload;

        await this.findOneById(playlistId);
        const isLiked = await this.playlistLikeRepository.findOneBy({
            playlistId,
            userId,
        });

        let message = PublicMessage.PlaylistLiked;

        if (isLiked) {
            await this.playlistLikeRepository.delete({
                playlistId,
                userId,
            });

            message = PublicMessage.PlaylistDisLike;
        } else {
            await this.playlistLikeRepository.insert({
                playlistId,
                userId,
            });
        }

        return {
            message,
        };
    }

    async myPlaylistLiked() {
        const { sub: userId } = this.request.user as AuthJwtPayload;

        const result = await this.playlistLikeRepository.find({
            where: {
                userId,
            },
            relations: ["playlist"],
            order: { updatedAt: "DESC" },
        });

        return result;
    }

    async generateUniqueSlug(): Promise<string> {
        let slug: string;
        let exists = true;

        do {
            slug = generateRandomSlug();
            const existing = await this.playlistRepository.findOne({ where: { slug } });
            exists = !!existing;
        } while (exists);

        return slug;
    }

    async findOneById(id: number) {
        if (isNaN(id)) throw new BadRequestException(BadRequestMessage.Id);
        const playlist = await this.playlistRepository.findOneBy({ id });
        if (!playlist) throw new NotFoundException(NotFoundMessage.Playlist);

        return playlist;
    }

    async search(playlistId: number, q: string) {
        return await this.playlistSongRepository
            .createQueryBuilder("playlistSong")
            .innerJoinAndSelect("playlistSong.song", "song")
            .innerJoin("song.artist", "artist")
            .addSelect(["artist.id", "artist.fullName", "artist.avatar"])
            .where("playlistSong.playlistId = :playlistId", { playlistId })
            .andWhere("(song.title LIKE :q OR artist.fullName LIKE :q)", { q: `%${q}%` })
            .addSelect(
                `
                    CASE
                        WHEN song.title LIKE :qExact THEN 2
                        WHEN artist.fullName LIKE :qExact THEN 1
                        ELSE 0
                    END
                `,
                "relevance",
            )
            .orderBy("relevance", "DESC")
            .addOrderBy("song.title", "ASC")
            .setParameters({ q: `%${q}%`, qExact: `%${q}%` })
            .getMany();
    }
}
