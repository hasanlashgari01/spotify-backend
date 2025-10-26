import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NotFoundMessage } from "src/common/enum/message.enum";
import { GenreStats } from "src/common/types/stats.interface";
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
        const result = await this.genreRepository
            .createQueryBuilder("genre")
            .leftJoin("genre.songs", "songGenre")
            .leftJoin("songGenre.song", "song")
            .where("genre.slug = :slug", { slug })
            .select([
                "genre.id AS id",
                "genre.title AS title",
                "genre.slug AS slug",
                "genre.cover AS cover",
                "COUNT(song.id) AS songCount",
                "SUM(song.duration) AS totalDuration",
            ])
            .groupBy("genre.id")
            .addGroupBy("genre.title")
            .addGroupBy("genre.slug")
            .addGroupBy("genre.cover")
            .getRawOne<GenreStats>();

        if (!result) throw new NotFoundException(NotFoundMessage.Genre);

        return {
            id: result?.id,
            title: result?.title,
            slug: result?.slug,
            cover: result?.cover,
            songCount: Number(result?.songCount ?? 0),
            totalDuration: Number(result?.totalDuration ?? 0),
        };
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
