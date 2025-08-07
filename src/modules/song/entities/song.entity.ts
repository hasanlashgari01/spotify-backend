import { EntityName } from "src/common/enum/entity.enum";
import { SongStatus } from "src/common/enum/song.enum";
import { LikeEntity } from "src/modules/like/entities/like.entity";
import { PlaylistSongEntity } from "src/modules/playlist/entities/playlist-song.entity";
import { UserEntity } from "src/modules/users/entities/user.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { SongGenreEntity } from "./song-genre.entity";

@Entity(EntityName.Song)
export class SongEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    audioUrl: string;

    @Column()
    cover: string;

    @Column("int")
    duration: number;

    @Column({ type: "enum", enum: SongStatus, default: SongStatus.DRAFT })
    status: SongStatus;

    @Column({ default: 0 })
    plays: number;

    @ManyToOne(() => UserEntity, (user) => user.songs, { onDelete: "CASCADE" })
    @JoinColumn({ name: "artistId" })
    artist: UserEntity;
    @Column()
    artistId: number;

    @OneToMany(() => SongGenreEntity, (genre) => genre.song)
    genres: SongGenreEntity[];

    @OneToMany(() => PlaylistSongEntity, (playlist) => playlist.song)
    playlists: PlaylistSongEntity[];

    @OneToMany(() => LikeEntity, (like) => like.song)
    likes: LikeEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
