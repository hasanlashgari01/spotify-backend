import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityName } from "src/common/enum/entity.enum";
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.util";
import { Repository } from "typeorm";
import { PlaylistEntity } from "../playlist/entities/playlist.entity";
import { Status } from "../playlist/enum/status.enum";
import { SongEntity } from "../song/entities/song.entity";
import { UserEntity } from "../users/entities/user.entity";
import { SearchDto } from "./dto/search.dto";
import { SongStatus } from "src/common/enum/song.enum";
import { Role } from "../users/enum/user.enum";

@Injectable()
export class SearchService {
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(SongEntity) private songRepository: Repository<SongEntity>,
        @InjectRepository(PlaylistEntity) private playlistRepository: Repository<PlaylistEntity>,
    ) {}

    async search(searchDto: SearchDto) {
        const { q, filter } = searchDto;
        const { page, limit, skip } = paginationSolver({
            page: +searchDto.page,
            limit: filter && ["artist", "song", "playlist", "user"]?.includes(filter) ? 30 : 10,
        });

        if (filter === "playlist") {
            return await this.searchPlaylist(page, limit, skip, q);
        } else if (filter === "song") {
            return await this.searchSong(page, limit, skip, q);
        } else if (filter === "artist") {
            return await this.searchArtist(page, limit, skip, q);
        } else if (filter === "user") {
            return await this.searchUser(page, limit, skip, q);
        }

        const [artistsResult, songsResult, playlistsResult, usersResult] = await Promise.all([
            this.searchArtist(page, limit, skip, q),
            this.searchSong(page, limit, skip, q),
            this.searchPlaylist(page, limit, skip, q),
            this.searchUser(page, limit, skip, q),
        ]);

        return {
            songs: songsResult.songs,
            playlists: playlistsResult.playlists,
            users: usersResult.users,
            artists: artistsResult.artists,
        };
    }

    private async searchPlaylist(page: number, limit: number, skip: number, q: string) {
        const [playlists, count] = await this.playlistRepository
            .createQueryBuilder(EntityName.Playlist)
            .leftJoinAndSelect("playlist.owner", "owner")
            .select([
                "playlist.id",
                "playlist.title",
                "playlist.slug",
                "playlist.cover",
                "playlist.status",
                "owner.fullName",
            ])
            .where("playlist.status = :status", { status: Status.PUBLIC })
            .andWhere("(playlist.title LIKE :q)", { q: `%${q}%` })
            .skip(skip)
            .take(limit)
            .getManyAndCount();

        return {
            playlists,
            pagination: paginationGenerator(count, page, limit),
        };
    }

    private async searchSong(page: number, limit: number, skip: number, q: string) {
        const [songs, count] = await this.songRepository
            .createQueryBuilder(EntityName.Song)
            .leftJoinAndSelect("song.artist", "artist")
            .select([
                "song.id",
                "song.title",
                "song.audioUrl",
                "song.cover",
                "song.duration",
                "song.status",
                "artist.username",
                "artist.fullName",
            ])
            .where("song.status = :status", { status: SongStatus.PUBLISHED })
            .andWhere("(song.title LIKE :q OR artist.fullName LIKE :q)", { q: `%${q}%` })
            .skip(skip)
            .take(limit)
            .getManyAndCount();

        return {
            songs,
            pagination: paginationGenerator(count, page, limit),
        };
    }

    private async searchArtist(page: number, limit: number, skip: number, q: string) {
        const [artists, count] = await this.userRepository
            .createQueryBuilder(EntityName.User)
            .select(["user.username", "user.fullName", "user.avatar"])
            .where("user.role = :role", { role: Role.ARTIST })
            .andWhere("(user.username LIKE :q OR user.fullName LIKE :q)", { q: `%${q}%` })
            .skip(skip)
            .take(limit)
            .getManyAndCount();

        return {
            artists,
            pagination: paginationGenerator(count, page, limit),
        };
    }

    private async searchUser(page: number, limit: number, skip: number, q: string) {
        const [users, count] = await this.userRepository
            .createQueryBuilder(EntityName.User)
            .select(["user.username", "user.fullName", "user.avatar"])
            .where("user.role IN (:...roles)", { roles: [Role.USER, Role.ADMIN] })
            .andWhere("(user.username LIKE :q OR user.fullName LIKE :q)", { q: `%${q}%` })
            .skip(skip)
            .take(limit)
            .getManyAndCount();

        return {
            users,
            pagination: paginationGenerator(count, page, limit),
        };
    }
}
