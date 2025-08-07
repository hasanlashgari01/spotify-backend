import { EntityName } from "src/common/enum/entity.enum";
import { UserEntity } from "src/modules/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity(EntityName.Follow)
export class FollowEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    followerId: number;
    @ManyToOne(() => UserEntity, (user) => user.following, { onDelete: "CASCADE" })
    follower: UserEntity; // کسی که داره دنبال می‌کنه

    @Column()
    followingId: number;
    @ManyToOne(() => UserEntity, (user) => user.followers, { onDelete: "CASCADE" })
    following: UserEntity; // کسی که داره دنبال می‌شه

    @CreateDateColumn()
    createdAt: Date;
}
