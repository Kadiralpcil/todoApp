"use client";

import { useRouter } from "next/navigation";
import Notify from "../components/Notify";
import { useState } from "react";
import Spinner from "../components/Spinner";

interface notificationProps {
  open: boolean,
  messege: string,
  variant: "error" | "success" | "warning"
}
export default function LoginPage() {
  //Hooks
  const router = useRouter();

  //State
  const [notification, setNotification] = useState<notificationProps | undefined>(undefined)
  const [loading, setLoading] = useState(false)

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
      }),
    });

    const { success } = await res.json();
    if (success) {
      setNotification({
        messege: "success",
        open: true,
        variant: "success"
      })

      router.push("/todos");
    } else {
      setNotification({
        messege: "username or password is not valid",
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
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-white p-8 rounded shadow-md w-96">

          <h2 className="text-2xl font-bold mb-4">Login</h2>

          <div className="mb-2 text-gray-500 font-bold">
            <p className="mb-1">Welcome! Use the following credentials:</p>
            <p className="mb-1">Username: admin</p>
            <p>Password: admin</p>
          </div>
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
              {loading ? <Spinner /> : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>

  );
}
