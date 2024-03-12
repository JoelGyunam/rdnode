import { IsEmail, Length } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index, OneToMany, BeforeInsert } from "typeorm";
import bcrypt from 'bcryptjs';
import Post from "./Post";
import Vote from "./Vote";

@Entity("users")
export default class User extends BaseEntity{
    
    @Column({unique: true})
    @Index()
    @IsEmail(undefined, { message: "이메일주소가 잘못되었습니다."})
    @Length(1,255, {message: "이메일 주소는 비워둘 수 없습니다."})
    email: string;

    @Column({unique: true})
    @Index()
    @Length(3,32,{message: "사용자 이름은 3자 이상이어야 합니다."})
    username: string;

    @Column()
    @Length(6,255,{message: '비밀번호는 6자 이상이어야 합니다.'})
    password: string;

    @OneToMany(()=> Post, (post)=>post.user)
    posts: Post[]

    @OneToMany(()=>Vote, (vote) => vote.user)
    votes: Vote[]

    @BeforeInsert()
    async hashPassWord(){
        this.password = await bcrypt.hash(this.password, 6);
    }

}
