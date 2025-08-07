import { EntityName } from "src/common/enum/entity.enum";
import { SongGenreEntity } from "src/modules/song/entities/song-genre.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity(EntityName.Genre)
export class GenreEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    slug: string;

    @Column()
    title: string;

    @Column()
    cover: string;

    @OneToMany(() => SongGenreEntity, (song) => song.genre)
    songs: SongGenreEntity[];
}
