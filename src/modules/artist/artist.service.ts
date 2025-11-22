import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NotFoundMessage } from "src/common/enum/message.enum";
import { SongEntity } from "src/modules/song/entities/song.entity";
import { Role } from "src/modules/users/enum/user.enum";
import { Repository } from "typeorm";
import { UserEntity } from "../users/entities/user.entity";

@Injectable()
export class ArtistService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(SongEntity)
        private songRepository: Repository<SongEntity>,
    ) {}

    async getProfile(username: string) {
        const artist = await this.userRepository.findOne({
            where: { username, role: Role.ARTIST },
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
        if (!artist) throw new NotFoundException(NotFoundMessage.Artist);

        return artist;
    }

    async myPopularSongs(id: number) {
        const isArtist = await this.userRepository.findOneBy({ id, role: Role.ARTIST });
        if (!isArtist) throw new NotFoundException(NotFoundMessage.Artist);

        return this.songRepository.find({
            where: { artistId: id },
            relations: ["artist"],
            select: {
                artist: {
                    id: true,
                    username: true,
                    fullName: true,
                    avatar: true,
                },
            },
            order: { plays: "DESC" },
            take: 10,
        });
    }
}
