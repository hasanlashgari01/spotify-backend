import { FollowEntity } from "src/modules/follow/entities/follow.entity";
import { LikeEntity } from "src/modules/like/entities/like.entity";
import { PlaylistLikeEntity } from "src/modules/playlist/entities/like.entity";
import { PlaylistEntity } from "src/modules/playlist/entities/playlist.entity";
import { SongEntity } from "src/modules/song/entities/song.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Gender, Role, Status } from "../enum/user.enum";

@Entity("users")
export class UserEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column()
    fullName: string;

    @Column({ type: "enum", enum: Role, default: Role.USER })
    role: Role;

    @Column({ default: false })
    isBan: boolean;

    @Column({ nullable: true, default: null })
    avatar: string;

    @Column({ nullable: true })
    bio: string;

    @Column({ type: "enum", enum: Gender, default: null })
    gender: Gender;

    @Column({ type: "enum", enum: Status, default: Status.PUBLIC })
    status: Status;

    @OneToMany(() => SongEntity, (song) => song.artist)
    songs: SongEntity[];

    @OneToMany(() => PlaylistEntity, (playlist) => playlist.owner)
    playlists: PlaylistEntity[];

    @OneToMany(() => PlaylistLikeEntity, (playlist) => playlist.user)
    playlist_likes: PlaylistLikeEntity[];

    @OneToMany(() => FollowEntity, (follow) => follow.follower)
    following: FollowEntity[];

    @OneToMany(() => FollowEntity, (follow) => follow.following)
    followers: FollowEntity[];

    @OneToMany(() => LikeEntity, (like) => like.user)
    song_likes: LikeEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
