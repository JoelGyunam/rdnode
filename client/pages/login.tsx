import React, { FormEvent, useState } from "react";
import InputGroup from "../src/components/InputGroup";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import { useAuthDispatch } from "../src/context/auth";



const Login = () => {
    let router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<any>({});

    const dispatch = useAuthDispatch();

    const handleSubmit = async(event:FormEvent)=>{
        event.preventDefault();
        try{
            const res = await axios.post("/auth/login",{password,username},{withCredentials : true});

            dispatch("LOGIN",res.data?.user);
            router.push("/")
        } catch(e:any){
            console.log(e);
            setErrors(e.response.data)
        }
    };

    return(
        <div className="bg-white">
            <div className="flex flex-col items-center justify-center h-screen p-6">
                <div className="w-10/12 mx-auto md:w-96">
                    <h1 className="mb-2 text-lg font-medium text-black">로그인</h1>
                    <form onSubmit={handleSubmit}>
                        <InputGroup 
                            placeholder='Username'
                            value={username}
                            setValue={setUsername}
                            error={errors.username}
                        />
                        <InputGroup 
                            placeholder='Password'
                            value={password}
                            setValue={setPassword}
                            error={errors.password}
                        />
                        <button className="w-full py-2 mb-1 text-xs font-bold text-white uppercase bg-gray-400 border-gray-400 rounded">
                            로그인
                        </button>
                    </form>
                    <small className="text-gray-500 flex">
                        <p>
                            아직 아이디가 없나요?
                        </p>
                        <div className='ml-1 text-blue-500 uppercase'>
                            <Link href="/register" >
                                회원가입
                            </Link>
                        </div>
                    </small>
    
                        

                </div>
            </div>
        </div>
    )
}

export default Login;