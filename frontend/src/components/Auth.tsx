import { useState } from "react";
import { Link } from "react-router-dom";
import { SignupInput } from "@nilesh05/medium-common";

export default function Auth({type}: {type: "signup" | "signin"}) {

    const [postInput, setPostInput] = useState<SignupInput>({
        username: "",
        password: "",
    })

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
                    username: e.target.value
                }))
            }} />

            <button className="w-screen max-w-sm bg-gray-400 p-3 rounded-2xl text-center hover:bg-gray-600 ease-in-out  hover:text-white duration-400 cursor-pointer">{type === "signin" ? "Sign in" : "Sign up"}</button>
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
            <input onChange={onChange} type={type || "password"} className="bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 " placeholder={placeholder} required />
        </div>
    )
}