import { EntityName } from "src/common/enum/entity.enum";
import { UserEntity } from "src/modules/users/entities/user.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { PlaylistEntity } from "./playlist.entity";

@Entity(EntityName.PlaylistLike)
export class PlaylistLikeEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => PlaylistEntity, (playlist) => playlist.likes, { onDelete: "CASCADE" })
    playlist: PlaylistEntity;
    @Column()
    playlistId: number;

    @ManyToOne(() => UserEntity, (user) => user.playlist_likes, { onDelete: "CASCADE" })
    user: UserEntity;
    @Column()
    userId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
