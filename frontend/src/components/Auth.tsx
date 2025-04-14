import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { SignupInput } from "@nilesh05/medium-common";
import axios from "axios";
import { BACKEND_URL } from "../config";

export default function Auth({type}: {type: "signup" | "signin"}) {

    const [postInput, setPostInput] = useState<SignupInput>({
        username: "",
        password: "",
    })
    const navigate = useNavigate()

    async function sendRequest(){
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`, postInput)
            const jwt = response.data
            localStorage.setItem("token", jwt)
            navigate("/blog")
        } catch (error) {
            
        }
    }

    return(
        <div className="h-screen flex flex-col justify-center items-center space-y-3 font-serif">
            <div>
                <div className="text-2xl font-bold text-center">Create an account</div>
                <div className="text-sm text-center">{type === "signin" ? "Don't have an account?" : "Already have an account?"}
                    <Link className="underline pl-2 " to={type === "signin" ?  "/signup" : "/signin"}>{type == "signin" ? "Sign up" : "Sign in"}
                    </Link>
                </div>
            </div>

            <LabeledInput label="Email" placeholder="Enter your email" onChange={(e) => {
                setPostInput(c => ({
                    ...c,
                    username: e.target.value
                }))
            }} />
            <LabeledInput label="Password" placeholder="Enter your Password" onChange={(e) => {
                setPostInput(c => ({
                    ...c,
                    password: e.target.value
                }))
            }} />

            <button onClick={sendRequest} className="w-screen max-w-sm bg-gray-400 p-3 rounded-2xl text-center hover:bg-gray-600 ease-in-out  hover:text-white duration-400 cursor-pointer">{type === "signin" ? "Sign in" : "Sign up"}</button>
        </div>
    )
}

interface labeledInputProps {
    label: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

function LabeledInput({label, placeholder, onChange, type}: labeledInputProps){
    return(
        <div className="w-screen max-w-sm">
            <label className="block mb-2 font-semibold text-sm  text-black">{label}</label>
            <input onChange={onChange} type={type || "text"} className="bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 " placeholder={placeholder} required />
        </div>
    )
}