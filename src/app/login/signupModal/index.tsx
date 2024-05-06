import Modal from '@/app/components/Modal';
import Notify from '@/app/components/Notify';
import Spinner from '@/app/components/Spinner';
import React, { useState } from 'react'
interface notificationProps {
    open: boolean,
    messege: string,
    variant: "error" | "success" | "warning"
}
interface SignUpModalProps {
    open: boolean,
    onClose: () => void
}
const SignUpModal = ({ open, onClose }: SignUpModalProps) => {
    //Hooks

    //State
    const [loading, setLoading] = useState(false)
    const [notification, setNotification] = useState<notificationProps | undefined>(undefined)

    //Handlers
    const handleSubmit = async (event: React.FormEvent) => {
        setLoading(true)
        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement);
        const username = formData.get("username");
        const password = formData.get("password");

        const res = await fetch("api/login", {
            method: "POST",
            body: JSON.stringify({
                username,
                password,
                type: "signUp",
            }),
        });
        const { success } = await res.json();
        if (success) {
            setNotification({
                messege: "user created please Login",
                open: true,
                variant: "success"
            })
            onClose()

        } else {
            setNotification({
                messege: "user not created",
                open: true,
                variant: "error"
            })
        }
        setLoading(false)
    };

    return (
        <>
            {notification?.open && <Notify
                message={notification?.messege}
                variant={notification?.variant}
                onClose={() => setNotification({
                    messege: "",
                    open: false,
                    variant: "error"
                })} />}
            <Modal
                title={<b>Sign Up</b>}
                onClose={onClose}
                open={open}
                size={"sm"}

            >
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="username"
                            className="block text-gray-700 font-semibold mb-2"
                        >
                            username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="password"
                            className="block text-gray-700 font-semibold mb-2"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg focus:outline-none focus:shadow-outline flex justify-center"
                    >
                        {loading ? <Spinner /> : "SignUp"}
                    </button>
                </form>
            </Modal>
        </>


    )
}

export default SignUpModal
