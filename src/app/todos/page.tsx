"use client"
import { CiLogout } from "react-icons/ci";
import Tooltip from "../components/Tooltip";
import { AllTodos } from "./AllTodos";
import { useRouter } from "next/navigation";

export default function Todos() {

    const router = useRouter()
    const handleLogout = async () => {
        // await Logout()
        await fetch(`api/logout/`, {
            method: "GET",
        });
        router.push('/login')
    }

    return (
        <>
            <div onClick={handleLogout} className="flex justify-end w-full p-6 ">
                <Tooltip content="Çıkış yap">
                    <CiLogout size={32} />
                </Tooltip>
            </div>
            <div className="flex justify-center">
                <div className="bg-white rounded-lg shadow-lg p-3 w-full min-h-96 sm:m-3 md:w-[40rem]">
                    <h1 className=" text-black font-extrabold text-3xl p-4">Todo App</h1>
                    <AllTodos />
                </div>
            </div>
        </>
    )
}