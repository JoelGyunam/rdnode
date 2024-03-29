import { BaseEntity, Column, Entity, Index, ManyToOne, OneToMany, JoinColumn} from "typeorm";
import User from "./User";
import Post from "./Post";
import { Expose } from "class-transformer";

@Entity("subs")
export default class Sub extends BaseEntity{

    @Column({unique:true})
    @Index()
    name: string;

    @Column()
    title: string;

    @Column({ type:'text', nullable: true})
    description: string;

    @Column({nullable: true})
    imageUrn: string;

    @Column({nullable: true})
    bannerUrn: string;

    @Column()
    username: string;

    @ManyToOne(() => User)
    @JoinColumn({name:"username", referencedColumnName:"username"})
    user: User;

    @OneToMany(()=>Post,(post)=>post.sub)
    posts: Post[];

    @Expose()
    get imageUrl(): string{
        return this.imageUrn
            ? `${process.env.APP_URL}/images/${this.imageUrn}`
            : "https://www.gravatar.com/avatar?d=mp&f=y";
    }

    @Expose()
    get bannerUrl(): string | undefined {
        return this.bannerUrn
            ? `${process.env.APP_URL}/images/${this.bannerUrn}`
            : undefined;
    }
}
