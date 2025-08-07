import { EntityName } from "src/common/enum/entity.enum";
import { GenreEntity } from "src/modules/genres/entities/genre.entity";
import { SongEntity } from "src/modules/song/entities/song.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity(EntityName.SongGenre)
export class SongGenreEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => GenreEntity, (genre) => genre.songs, { onDelete: "CASCADE" })
    genre: GenreEntity;
    @Column()
    genreId: number;

    @ManyToOne(() => SongEntity, (song) => song.genres, { onDelete: "CASCADE" })
    song: SongEntity;
    @Column()
    songId: number;
}
