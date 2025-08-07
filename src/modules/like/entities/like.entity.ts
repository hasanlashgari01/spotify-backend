import { EntityName } from "src/common/enum/entity.enum";
import { SongEntity } from "src/modules/song/entities/song.entity";
import { UserEntity } from "src/modules/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity(EntityName.LikesSong)
export class LikeEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;
    @ManyToOne(() => UserEntity, (user) => user.song_likes, { onDelete: "CASCADE" })
    user: UserEntity;

    @Column()
    songId: number;
    @ManyToOne(() => SongEntity, (song) => song.likes, { onDelete: "CASCADE" })
    song: SongEntity;

    @CreateDateColumn()
    createdAt: Date;
}
