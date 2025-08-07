import { EntityName } from "src/common/enum/entity.enum";
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { PlaylistEntity } from "./playlist.entity";
import { SongEntity } from "src/modules/song/entities/song.entity";

@Entity(EntityName.PlaylistSong)
export class PlaylistSongEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => PlaylistEntity, (playlist) => playlist.songs, { onDelete: "CASCADE" })
    playlist: PlaylistEntity;
    @Column()
    playlistId: number;

    @ManyToOne(() => SongEntity, (song) => song.playlists, { onDelete: "CASCADE" })
    song: SongEntity;
    @Column()
    songId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
