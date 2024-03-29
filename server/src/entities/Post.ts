import { BaseEntity, Column, Entity, Index, ManyToOne, OneToMany, JoinColumn, BeforeInsert} from "typeorm";
import User from "./User";
import Sub from "./Sub";
import Comment from "./Comment";
import { Exclude, Expose } from "class-transformer";
import { makeId, slugify } from "../utils/helpers";
import Vote from "./Vote";

@Entity("posts")
export default class Post extends BaseEntity{

    @Column()
    @Index()
    identifier: string;

    @Column()
    title: string;

    @Column()
    @Index()
    slug: string;

    @Column({nullable: true, type:"text"})
    body: string;

    @Column()
    subName: string;

    @Column()
    username: string;

    @ManyToOne(()=>User, (user)=>user.posts)
    @JoinColumn({name:"username", referencedColumnName:"username"})
    user: User;

    @ManyToOne(()=>Sub, (sub)=>sub.posts)
    @JoinColumn({name:"subName", referencedColumnName: "name"})
    sub: Sub;

    @Exclude()
    @OneToMany(()=>Comment, (comment)=> comment.post)
    comments: Comment[];

    @Exclude()
    @OneToMany(()=>Vote, (vote)=>vote.post)
    votes: Vote[];

    @Expose() 
    get url (): string {
        return `r/${this.subName}/${this.identifier}/${this.slug}`
    }

    @Expose() 
    get commentCount(): number {
        return this.comments?.length;
    }

    @Expose() 
    get voteScore(): number {
        return this.votes?.reduce((memo, curt)=> memo + (curt.value || 0), 0);
    }

    protected userVote: number;

    setUserVote(user: User){
        const index = this.votes?.findIndex(v => v.username === user.username);
        this.userVote = index > -1 ? this.votes[index].value : 0;
    }

    @BeforeInsert()
    makeIdAndSlug(){
        this.identifier = makeId(7);
        this.slug = slugify(this.title);
    }
}
