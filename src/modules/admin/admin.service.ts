import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AdminMessage } from "src/common/enum/message.enum";
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.util";
import { DeepPartial, FindOptionsWhere, Repository } from "typeorm";
import { GenreEntity } from "../genres/entities/genre.entity";
import { UserEntity } from "../users/entities/user.entity";
import { FindAllUsersDto } from "./dto/user.dto";
import { PlaylistEntity } from "../playlist/entities/playlist.entity";
import { FindAllPlaylistDto } from "./dto/playlist.dto";
import { GenresService } from "../genres/genres.service";
import { UpdateGenreDto } from "../genres/dto/update-genre.dto";
import { S3Service } from "../s3/s3.service";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { CreateGenreDto } from "../genres/dto/create-genre.dto";
import { SongStatus } from "src/common/enum/song.enum";
import { SongEntity } from "../song/entities/song.entity";

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(GenreEntity)
        private genreRepository: Repository<GenreEntity>,
        @InjectRepository(PlaylistEntity)
        private playlistRepository: Repository<PlaylistEntity>,
        @InjectRepository(SongEntity)
        private songRepository: Repository<SongEntity>,
        private genreService: GenresService,
        private s3Service: S3Service,
    ) {}

    async findAllUsers(queryDto: FindAllUsersDto) {
        const { page, limit, role, status, gender } = queryDto;
        const { limit: take, page: paginationPage, skip } = paginationSolver({ page, limit });

        const where: FindOptionsWhere<UserEntity> = {};
        if (role) where.role = role;
        if (status) where.status = status;
        if (gender) where.gender = gender;

        const [users, count] = await this.userRepository.findAndCount({
            where,
            select: {
                id: true,
                avatar: true,
                fullName: true,
                username: true,
                status: true,
            },
            skip,
            take,
            order: { createdAt: "DESC" },
        });

        return {
            pagination: paginationGenerator(count, paginationPage, take),
            users,
        };
    }

    async toggleBanUser(id: number) {
        const user = await this.userRepository.findOneBy({ id });

        let message = AdminMessage.Ban;
        if (user?.isBan == false) {
            await this.userRepository.update(id, { isBan: true });
        } else {
            await this.userRepository.update(id, { isBan: false });
            message = AdminMessage.Unban;
        }

        return {
            message,
        };
    }

    async findAllGenres(paginationDto: PaginationDto) {
        const { limit, page, skip } = paginationSolver(paginationDto);

        const [genres, count] = await this.genreRepository.findAndCount({
            skip,
            take: limit,
        });

        return {
            pagination: paginationGenerator(count, page, limit),
            genres,
        };
    }

    async createGenre(createGenreDto: CreateGenreDto, cover?: Express.Multer.File) {
        const { title } = createGenreDto;

        const slug = await this.genreService.generateUniqueSlug();
        if (cover) {
            const { Location } = await this.s3Service.uploadFile(cover, "genre");

            await this.genreRepository.insert({
                title,
                slug,
                cover: Location,
            });
        } else {
            await this.genreRepository.insert({
                title,
                slug,
            });
        }

        return {
            message: "ژانر ایجاد شد",
        };
    }

    async updateGenre(id: number, updateGenreDto: UpdateGenreDto, cover: Express.Multer.File) {
        const { title } = updateGenreDto;
        await this.genreService.findOneById(id);
        const updateObject: DeepPartial<GenreEntity> = {};

        if (cover) {
            const { Location } = await this.s3Service.uploadFile(cover, "genre");
            if (Location) updateObject["cover"] = Location;
        }
        if (title) updateObject["title"] = title;

        await this.genreRepository.update({ id }, updateObject);

        return {
            message: "ژانر با موفقیت به روز رسانی شد",
        };
    }

    async removeGenre(id: number) {
        await this.genreService.findOneById(id);
        await this.genreRepository.delete(id);

        return {
            message: "ژانر با موفقیت حذف شد",
        };
    }

    async findAllPlaylists(queryDto: FindAllPlaylistDto) {
        const { limit, page, skip } = paginationSolver({
            page: queryDto.page,
            limit: queryDto.limit,
        });
        const where: FindOptionsWhere<PlaylistEntity> = { status: queryDto.status };

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

    findAllSongs(status?: SongStatus) {
        const where: FindOptionsWhere<SongEntity> = { status };
        if (status) where.status = status;

        return this.songRepository.find({
            where,
            relations: ["album", "artist", "genres"],
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
}
