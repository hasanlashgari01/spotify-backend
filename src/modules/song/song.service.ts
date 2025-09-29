import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { parseBuffer } from "music-metadata";
import { NotFoundMessage } from "src/common/enum/message.enum";
import { SongStatus } from "src/common/enum/song.enum";
import { FindOptionsWhere, In, Repository } from "typeorm";
import { AuthJwtPayload } from "../auth/types/auth-payload";
import { GenresService } from "../genres/genres.service";
import { S3Service } from "../s3/s3.service";
import { CreateSongDto } from "./dto/create-song.dto";
import { UpdateSongDto } from "./dto/update-song.dto";
import { SongGenreEntity } from "./entities/song-genre.entity";
import { SongEntity } from "./entities/song.entity";
import { FollowEntity } from "../follow/entities/follow.entity";
import { Role } from "../users/enum/user.enum";
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.util";
import { PaginationDto } from "src/common/dto/pagination.dto";

@Injectable()
export class SongsService {
    constructor(
        @InjectRepository(SongEntity)
        private songRepository: Repository<SongEntity>,
        @InjectRepository(SongGenreEntity)
        private songGenreRepository: Repository<SongGenreEntity>,
        @InjectRepository(FollowEntity)
        private followRepository: Repository<FollowEntity>,
        private genreService: GenresService,
        private s3Service: S3Service,
        @Inject(REQUEST) private request: Request,
    ) {}

    async create(createSongDto: CreateSongDto, audio: Express.Multer.File) {
        const { sub } = this.request.user as AuthJwtPayload;
        const { title, genreId, status } = createSongDto;

        await this.genreService.findOneById(+genreId);
        const audioResult = await this.s3Service.uploadFile(audio, "audio");
        const { coverUrl, duration } = await this.getAudioCoverAndDuration(audio);

        const newSong = this.songRepository.create({
            title,
            artistId: sub,
            audioUrl: audioResult.Location,
            cover: coverUrl ? coverUrl : "",
            duration,
            status,
        });
        await this.songRepository.save(newSong);

        await this.songGenreRepository.insert({
            songId: newSong.id,
            genreId: +genreId,
        });

        return {
            message: "آهنگ جدید با موفقیت ساخته شد",
        };
    }

    async findAll(paginationDto: PaginationDto) {
        const { limit, page, skip } = paginationSolver(paginationDto);

        const [songs, count] = await this.songRepository.findAndCount({
            where: {
                status: SongStatus.PUBLISHED,
            },
            relations: ["artist"],
            select: {
                artist: {
                    id: true,
                    username: true,
                    fullName: true,
                    avatar: true,
                },
            },
            skip,
            take: limit,
            order: { createdAt: "DESC" },
        });

        return {
            songs,
            pagination: paginationGenerator(count, page, limit),
        };
    }

    async madeForYou() {
        const { sub } = this.request.user as AuthJwtPayload;

        const followings = await this.followRepository.find({
            where: {
                followerId: sub,
                following: {
                    role: Role.ARTIST,
                },
            },
            order: { createdAt: "DESC" },
        });
        const followingIdList = followings.map((following) => following.followingId);

        const songs = await this.songRepository.find({
            where: {
                artistId: In(followingIdList),
                status: SongStatus.PUBLISHED,
            },
            relations: ["artist"],
            select: {
                artist: {
                    id: true,
                    fullName: true,
                    username: true,
                },
            },
            take: 10,
            order: { createdAt: "DESC" },
        });

        return songs;
    }

    async newSongs() {
        const songs = await this.songRepository.find({
            where: {
                status: SongStatus.PUBLISHED,
            },
            relations: ["artist"],
            select: {
                artist: {
                    id: true,
                    fullName: true,
                    username: true,
                },
            },
            take: 10,
            order: { createdAt: "DESC" },
        });

        return songs;
    }

    async popularSongs() {
        const songs = await this.songRepository.find({
            where: { status: SongStatus.PUBLISHED },
            relations: ["artist"],
            select: {
                artist: {
                    id: true,
                    fullName: true,
                    username: true,
                },
            },
            take: 10,
            order: { plays: "DESC" },
        });

        return songs;
    }

    mySongs(status?: SongStatus) {
        const { sub } = this.request.user as AuthJwtPayload;
        const where: FindOptionsWhere<SongEntity> = {
            artistId: sub,
            status,
        };
        if (status) where.status = status;

        return this.songRepository.find({
            where,
            relations: ["artist", "genres"],
            select: {
                artist: {
                    username: true,
                    fullName: true,
                    avatar: true,
                },
            },
            order: { createdAt: "DESC" },
        });
    }

    async findOneById(id: number) {
        const song = await this.songRepository.findOne({
            where: { id },
            relations: ["artist", "genres"],
            select: {
                artist: {
                    username: true,
                    fullName: true,
                    avatar: true,
                },
            },
        });
        if (!song) throw new NotFoundException(NotFoundMessage.Song);

        return song;
    }

    async update(id: number, updateSongDto: UpdateSongDto, audio: Express.Multer.File) {
        const { sub } = this.request.user as AuthJwtPayload;
        const song = await this.findOneById(id);
        if (sub !== song.artistId) throw new BadRequestException(NotFoundMessage.Song);

        if (updateSongDto.title) song.title = updateSongDto.title;
        if (audio) {
            const audioResult = await this.s3Service.uploadFile(audio, "audio");
            song.audioUrl = audioResult.Location;

            const { coverUrl, duration } = await this.getAudioCoverAndDuration(audio);
            if (duration) song.duration = duration;
            if (coverUrl) song.cover = coverUrl;
        }

        if (updateSongDto.genreId) {
            await this.genreService.findOneById(+updateSongDto.genreId);
            await this.songGenreRepository.update(song.id, {
                genreId: +updateSongDto.genreId,
            });
        }

        return this.songRepository.save(song);
    }

    async remove(id: number) {
        const { sub } = this.request.user as AuthJwtPayload;
        const song = await this.findOneById(id);
        if (sub !== song.artistId) throw new BadRequestException(NotFoundMessage.Song);

        await this.songRepository.remove(song);

        return {
            message: "آهنگ مورد نظر حذف شد",
        };
    }

    async toggleStatus(id: number) {
        const { sub } = this.request.user as AuthJwtPayload;
        const song = await this.findOneById(id);
        if (sub !== song.artistId) throw new BadRequestException(NotFoundMessage.Song);

        await this.songRepository.update(id, {
            status: song.status === SongStatus.DRAFT ? SongStatus.PUBLISHED : SongStatus.PUBLISHED,
        });

        return {
            message: "آهنگ مورد نظر با موفقیت آپدیت شد",
        };
    }

    async incrementPlaySong(id: number) {
        const song = await this.songRepository.findOneBy({ id });
        if (song) {
            await this.songRepository.update(id, {
                plays: () => "plays + 1",
            });
        }
    }

    async getSongsByGenreSlug(
        id: number,
        paginationDto: PaginationDto,
        sortBy: "title" | "artist" | "createdAt" | "duration" = "createdAt",
        order: "ASC" | "DESC" = "DESC",
    ) {
        const { limit, page, skip } = paginationSolver(paginationDto);

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

        const qb = this.songGenreRepository
            .createQueryBuilder("sg")
            .innerJoinAndSelect("sg.song", "song")
            .innerJoin("song.artist", "artist")
            .addSelect(["artist.id", "artist.username", "artist.fullName"])
            .where("sg.genreId = :id", { id })
            .orderBy(orderField, order)
            .skip(skip)
            .take(limit);

        const [songs, count] = await qb.getManyAndCount();

        return {
            songs: songs.map((sg) => sg.song),
            pagination: paginationGenerator(count, page, limit),
        };
    }

    private async getAudioCoverAndDuration(audio: Express.Multer.File) {
        const metadata = await parseBuffer(audio.buffer, audio.mimetype);
        const duration = metadata.format.duration; // in seconds

        let coverUrl: string | null = null;
        if (metadata.common.picture && metadata.common.picture.length > 0) {
            const cover = metadata.common.picture[0];
            const coverBuffer = cover.data;
            const coverFile = {
                buffer: coverBuffer,
                originalname: `cover-${Date.now()}.jpg`, // یا .png
                mimetype: cover.format,
            } as Express.Multer.File;

            const coverResult = await this.s3Service.uploadFile(coverFile, "cover");
            coverUrl = coverResult.Location;
        }

        return {
            duration,
            coverUrl,
        };
    }
}
