import React, { useEffect, useRef, useState } from "react";
import { MdCancel, MdDelete, MdEdit, MdSave } from "react-icons/md";
import Tooltip from "@/app/components/Tooltip";
import TodoResponseDto from "@/app/types";
import { FlagResponseDto } from "@/app/types/flagDto";
import { FaBookmark } from "react-icons/fa";
import { RiImageAddFill } from "react-icons/ri";
import { FaFile } from "react-icons/fa";

import Spinner from "@/app/components/Spinner";
import Modal from "@/app/components/Modal";

interface TodoItemProps {

    todo: TodoResponseDto;
    setTodoList: React.Dispatch<React.SetStateAction<TodoResponseDto[]>>
    refetchTrigger: () => void;

}

export default function TodoItem({ todo, refetchTrigger, setTodoList }: TodoItemProps) {
    //States
    const [modal, setModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [dropdownToggle, setDropdownToggle] = useState(false);
    const [flagList, setFlagList] = useState<FlagResponseDto[]>([]);
    //Refs
    const inputRef = useRef<HTMLInputElement>(null);
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
    //Handlers
    const handleEditMode = () => {
        setModal(true);
    };
    //Mutations
    const saveTitle = async (newTitle: string) => {
        setLoading(true)
        await fetch(`api/todos/${todo._id}`, {
            method: "PUT",
            body: JSON.stringify({ newTitle }),
        });
        setTodoList((prevTodoList) => {
            const updatedTodoList = prevTodoList.map((item) => {
                if (item._id === todo._id) {
                    return { ...item, title: newTitle }
                } else {
                    return item;
                }
            });

            return updatedTodoList;
        });
        setLoading(false)
    };

    const saveCompleted = async (newCompleted: boolean) => {
        setLoading(true)
        await fetch(`api/todos/${todo._id}`, {
            method: "PUT",
            body: JSON.stringify({ newCompleted }),
        });

        setTodoList((prevTodoList) => {
            const updatedTodoList = prevTodoList.map((item) => {
                if (item._id === todo._id) {
                    return { ...item, completed: newCompleted }
                } else {
                    return item;
                }
            });

            return updatedTodoList;
        });
        setLoading(false)
    };
    const saveFlag = async (newFlag: string) => {
        setLoading(true)
        setDropdownToggle(!dropdownToggle)
        const res = await fetch(`api/todos/${todo._id}`, {
            method: "PUT",
            body: JSON.stringify({ newFlag }),
        });
        setTodoList((prevTodoList) => {
            const updatedTodoList = prevTodoList.map((item) => {
                if (item._id === todo._id) {
                    return { ...item, flag: newFlag }
                } else {
                    return item;
                }
            });

            return updatedTodoList;
        });
        setLoading(false)
    };
    const handleDelete = async (id: string) => {
        setLoading(true)

        const res = await fetch(`api/todos?id=${id}`, {
            method: "DELETE",
        });
        const { success } = await res.json();

        if (success) {
            setTodoList((todos) => todos.filter(todo => todo._id !== id))
        };
        setLoading(false)
    }
    const modalChilderen =
        <div>
            <div className="relative mb-3 data-twe-input-wrapper-init"  >
                <input
                    type="text"
                    className="outline-4 peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0"
                    id="title"
                    defaultValue={todo.title}
                    placeholder="Title" />
                <label
                    className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[twe-input-state-active]:-translate-y-[0.9rem] peer-data-[twe-input-state-active]:scale-[0.8] motion-reduce:transition-none "
                >Title
                </label>
            </div>
            <input type="file" />
        </div>

    return (
        <>
            <Modal isOpen={modal} onClose={() => setModal(false)} children={modalChilderen} />
            <div className="flex items-center space-x-4 mb-2 shadow-sm p-2 hover:bg-slate-200">
                <input
                    type="checkbox"
                    className="h-5 w-5 cursor-pointer rounded-md border border-blue-gray-200 transition-all"
                    defaultChecked={todo.completed}
                    onChange={(e) => saveCompleted(e.target.checked)}
                />
                <span
                    className={`ml-6 w-full flex items-center gap-2 ${todo.completed ? "line-through text-gray-500" : ""
                        }`}
                >
                    <button>
                        <FaBookmark
                            onClick={() => setDropdownToggle(!dropdownToggle)}
                            className="cursor-pointer"
                            color={
                                flagList.find((flag) => flag._id === todo.flag)?.name ?? "gray"
                            }
                        />
                        <div className="relative">
                            {dropdownToggle && (
                                <div className="absolute w-24 bg-gray-300 rounded-lg shadow-lg z-10 flex ">
                                    {flagList.map((item) => (
                                        <div
                                            key={item._id}
                                            className="cursor-pointer p-2 hover:bg-gray-100 flex justify-center"
                                            onClick={() => saveFlag(item._id)}
                                        >
                                            <FaBookmark
                                                className="cursor-pointer"
                                                color={item.name === "" ? "gray" : item.name}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </button>
                    <div>
                        {todo.title}
                    </div>
                </span>
                <>
                    <div onClick={() => setModal(true)}>
                        <Tooltip content="Edit">
                            <MdEdit size={20} color="blue" />
                        </Tooltip>
                    </div>
                    <button onClick={() => handleDelete(todo._id)}>
                        <Tooltip content="Delete">
                            {loading ? <Spinner /> : <MdDelete size={20} color="red" />}
                        </Tooltip>
                    </button>
                </>
            </div>
        </>

    );
}

// <button
// onClick={() => saveTitle(inputRef.current?.value ?? todo.title)}
// >
// <Tooltip content="Save">
//     {loading ? <Spinner /> : <MdSave size={20} color="blue" />}
// </Tooltip>
// </button>
// <button onClick={handleCancelEdit}>
// <Tooltip content="Cancel">
//     <MdCancel size={20} color="blue" />
// </Tooltip>
// </button>