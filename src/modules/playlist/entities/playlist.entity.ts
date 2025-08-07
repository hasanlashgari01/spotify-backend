import { EntityName } from "src/common/enum/entity.enum";
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
import { PlaylistSongEntity } from "./playlist-song.entity";
import { Status } from "../enum/status.enum";
import { PlaylistLikeEntity } from "./like.entity";

@Entity(EntityName.Playlist)
export class PlaylistEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ unique: true })
    slug: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    cover: string;

    @Column({ type: "enum", enum: Status, default: Status.PUBLIC })
    status: Status;

    @ManyToOne(() => UserEntity, (user) => user.playlists, { onDelete: "CASCADE" })
    owner: UserEntity;
    @JoinColumn({ name: "ownerId" })
    @Column()
    ownerId: number;

    @OneToMany(() => PlaylistSongEntity, (song) => song.playlist)
    songs: PlaylistSongEntity[];

    @OneToMany(() => PlaylistLikeEntity, (like) => like.playlist)
    likes: PlaylistLikeEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
