"use client";
import { CiLogout } from "react-icons/ci";
import Tooltip from "../components/Tooltip";
import { AllTodos } from "./AllTodos";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FlagResponseDto } from "../types/flagDto";
import { FaBookmark } from "react-icons/fa";
import TodoResponseDto from "../types";

export default function Todos() {
  //State
  const [loading, setLoading] = useState(true);
  const [flagList, setFlagList] = useState<FlagResponseDto[]>([]);
  const [todoList, setTodoList] = useState<TodoResponseDto[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchedFlag, setSearhedFlag] = useState("");
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  //Hooks
  const router = useRouter();

  //Handlers
  const handleSearchChange = (e: string) => {
    setSearchText(e);
  };
  const filteredTodos = todoList.filter((todo) => {
    const titleMatch = todo.title
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const flagMatch = !searchedFlag || todo.flag === searchedFlag;
    return titleMatch && flagMatch;
  });

  const handleLogout = async () => {
    await fetch(`api/logout/`, {
      method: "GET",
    });
    router.push("/login");
  };
  //Effects
  useEffect(() => {
    async function fetchFlags() {
      try {
        const response = await fetch("api/flags", {
          method: "GET",
        });
        const data = await response.json();
        setFlagList(data.flags);
      } catch (error) {
        console.error("Error fetching flags:", error);
      }
    }
    fetchFlags();
  }, []);

  useEffect(() => {
    setLoading(true);
    async function fetchTodos() {
      try {
        const response = await fetch("api/todos", {
          method: "GET",
        });
        const data = await response.json();
        setTodoList(data.todos);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    }
    fetchTodos();
    setLoading(false);
  }, [refetchTrigger]);

  return (
    <>
      <div className="flex justify-end w-full p-6 ">
        <Tooltip content="Çıkış yap">
          <CiLogout onClick={handleLogout} size={32} />
        </Tooltip>
      </div>
      <div className="flex justify-center flex-col items-center">
        <div className="w-full sm:m-3 md:w-[40rem] border p-2 border-gray-300 rounded-lg">
          <div className="flex">
            <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
              {flagList.map((item) => (
                <div
                  key={item._id}
                  className={`cursor-pointer p-1 hover:bg-gray-100 flex justify-center ${searchedFlag === item._id ? "bg-green-300 p-4" : ""
                    }`}
                // onClick={() => saveFlag(item._id)}
                >
                  <FaBookmark
                    onClick={() =>
                      searchedFlag === item._id
                        ? setSearhedFlag("")
                        : setSearhedFlag(item._id)
                    }
                    size={20}
                    className="cursor-pointer"
                    color={item.name === "" ? "gray" : item.name}
                  />
                </div>
              ))}
              <FaBookmark
                onClick={() => setSearhedFlag("")}
                size={20}
                className="cursor-pointer hover:bg-gray-100 flex justify-center "
                color="gray"
              />
            </span>
            <input
              type="text"
              onChange={(e) => handleSearchChange(e.target.value)}
              className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5"
              placeholder="search.."
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-3 w-full min-h-96 sm:m-3 md:w-[40rem]">
          <h1 className=" text-black font-extrabold text-3xl p-4">Todo App</h1>
          <AllTodos
            todos={filteredTodos}
            setTodoList={setTodoList}
            refetchTrigger={() => setRefetchTrigger(refetchTrigger + 1)}
            loading={loading}
            setLoading={setLoading}
            flagList={flagList}
          />
        </div>
      </div>
    </>
  );
}
