import { Request, Response, Router } from "express";
import User from "../entities/User";
import { isEmpty, validate } from "class-validator";
import { error } from "console";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const mapError = (errors: Object[])=>{
    return errors.reduce((prev: any,err: any)=>{
        prev[err.property] = Object.entries(err.constraints)[0][1]
        return prev;
    },{})
}


const register = async (req:Request, res:Response) => {
    const { email, username, password} = req.body;
    try{
        let errors: any = {};
        
        // 이메일과 유저이름 unique check
        const emailUser = await  User.findOneBy({email});
        const usernameUser = await User.findOneBy({username});

        // 이미 있다면 errors 객체에 넣음.
        if(emailUser){
            errors.email = "이미 사용중인 이메일입니다.";
        };

        if(usernameUser){
            errors.username = "이미 사용중인 이름입니다.";
        }

        //에러가 있다면 return으로 error 보냄.
        if(Object.keys(errors).length > 0){
            return res.status(400).json(errors);
        }

        const user = new User();
        user.email = email;
        user.username = username;
        user.password = password;

        // user 유효성 검사
        errors = await validate(user);

        if(errors.length > 0){
            return res.status(400).json(mapError(errors));
        }

        // insert
        await user.save();
        return res.json(user);

    }catch(e){
        console.log(e);
        return res.status(500).json(e);
    }
};

const login = async(req: Request, res: Response) => {

    try{
        const {username, password} = req.body;

        let errors: any = {};
        if(isEmpty(username)){
            errors.username = "사용자 이름일 입력해 주세요.";
        }
        if(isEmpty(password)){
            errors.password = "비밀번호를 입력해 주세요.";
        }
        if(Object.keys(errors).length > 0){
            return res.status(400).json(errors);
        }

        const user = await User.findOneBy({username});

        if(!user){
            return res.status(404).json({username: "등록되지 않은 사용자 입니다."});
        }

        const passwordMatches = await bcrypt.compare(password, user.password);

        if(!passwordMatches){
            return res.status(401).json({password:"잘못된 비밀번호 입니다."});
        }

        const token = jwt.sign({username}, process.env.JWT_SECRET);

        res.set("SET-Cookie", cookie.serialize("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"strict",
            maxAge: 60*60*24*7,
            path:"/"
        }));
        return res.status(200).json({user, token});

    } catch(e){
        console.log(e);
        return res.status(500).json(e);
    }

}


const router = Router();
router.post("/register",register);
router.post("/login", login);

export default router;