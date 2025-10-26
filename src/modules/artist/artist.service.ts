import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {NotFoundMessage} from "src/common/enum/message.enum";
import {Role} from "src/modules/users/enum/user.enum";
import {Repository} from "typeorm";
import {UserEntity} from "../users/entities/user.entity";

@Injectable()
export class ArtistService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) {}

    async getProfile(username: string) {
        const artist = await this.userRepository.findOne({
            where: {username, role: Role.ARTIST},
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
}
