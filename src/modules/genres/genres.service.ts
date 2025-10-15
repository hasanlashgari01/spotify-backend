import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NotFoundMessage } from "src/common/enum/message.enum";
import { generateRandomSlug } from "src/common/utils/random.utils";
import { Repository } from "typeorm";
import { GenreEntity } from "./entities/genre.entity";

@Injectable()
export class GenresService {
    constructor(@InjectRepository(GenreEntity) private genreRepository: Repository<GenreEntity>) {}

    findAll() {
        return this.genreRepository.find();
    }

    async findOneBySlug(slug: string) {
        const result = await this.genreRepository.findOne({
            where: { slug },
        });

        if (!result) throw new NotFoundException(NotFoundMessage.Genre);

        return result;
    }

    async findOneById(id: number) {
        const genre = await this.genreRepository.findOneBy({ id });
        if (!genre) throw new NotFoundException(NotFoundMessage.Genre);

        return genre;
    }

    async generateUniqueSlug(): Promise<string> {
        let slug: string;
        let exists = true;

        do {
            slug = generateRandomSlug();
            const existing = await this.genreRepository.findOne({ where: { slug } });
            exists = !!existing;
        } while (exists);

        return slug;
    }
}
