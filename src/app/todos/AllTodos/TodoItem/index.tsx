import React, { useCallback, useEffect, useRef, useState } from "react";
import { MdCancel, MdDelete, MdEdit, MdSave } from "react-icons/md";
import Tooltip from "@/app/components/Tooltip";
import TodoResponseDto from "@/app/types";
import { FlagResponseDto } from "@/app/types/flagDto";
import { FaBookmark } from "react-icons/fa";
import { RiImageAddFill } from "react-icons/ri";
import { FaFile } from "react-icons/fa";

import Spinner from "@/app/components/Spinner";
import Modal from "@/app/components/Modal";
import { Actions } from "./actions";

interface TodoItemProps {
    todo: TodoResponseDto;
    setTodoList: React.Dispatch<React.SetStateAction<TodoResponseDto[]>>;
    refetchTrigger: () => void;
}

export default function TodoItem({
    todo,
    refetchTrigger,
    setTodoList,
}: TodoItemProps) {
    //States
    const [editMode, setEditMode] = useState("");
    const [loading, setLoading] = useState(false);
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
    //Mutations
    const saveTitle = async (newTitle: string) => {
        setLoading(true);
        await fetch(`api/todos/${todo._id}`, {
            method: "PUT",
            body: JSON.stringify({ newTitle }),
        });
        setTodoList((prevTodoList) => {
            const updatedTodoList = prevTodoList.map((item) => {
                if (item._id === todo._id) {
                    return { ...item, title: newTitle };
                } else {
                    return item;
                }
            });

            return updatedTodoList;
        });
        setLoading(false);
        setEditMode("")
    };
    const saveCompleted = async (newCompleted: boolean) => {
        setLoading(true);
        await fetch(`api/todos/${todo._id}`, {
            method: "PUT",
            body: JSON.stringify({ newCompleted }),
        });

        setTodoList((prevTodoList) => {
            const updatedTodoList = prevTodoList.map((item) => {
                if (item._id === todo._id) {
                    return { ...item, completed: newCompleted };
                } else {
                    return item;
                }
            });

            return updatedTodoList;
        });
        setLoading(false);
    };
    const saveFlag = async (newFlag: string) => {
        setLoading(true);
        setDropdownToggle(!dropdownToggle);
        const res = await fetch(`api/todos/${todo._id}`, {
            method: "PUT",
            body: JSON.stringify({ newFlag }),
        });
        setTodoList((prevTodoList) => {
            const updatedTodoList = prevTodoList.map((item) => {
                if (item._id === todo._id) {
                    return { ...item, flag: newFlag };
                } else {
                    return item;
                }
            });

            return updatedTodoList;
        });
        setLoading(false);
    };
    const handleDelete = async (id: string) => {
        setLoading(true);

        const res = await fetch(`api/todos?id=${id}`, {
            method: "DELETE",
        });
        const { success } = await res.json();

        if (success) {
            setTodoList((todos) => todos.filter((todo) => todo._id !== id));
        }
        setLoading(false);
    };
    useEffect(() => {
        inputRef.current?.focus()
    }, [editMode])


    return (
        <>
            <div key={todo._id} className="flex items-center space-x-4 mb-2 shadow-sm p-2 hover:bg-slate-200 flex-1">
                <input
                    type="checkbox"
                    className="h-5 w-5 cursor-pointer rounded-md border border-blue-gray-200 transition-all"
                    defaultChecked={todo.completed}
                    onChange={(e) => saveCompleted(e.target.checked)}
                />

                <div
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
                    <div className="flex-1">
                        {editMode.length > 0 && editMode === todo._id ? (
                            <>
                                <input
                                    onKeyDown={(e) => {
                                        e.code === "Enter" && saveTitle(inputRef.current?.value ?? "")
                                    }}
                                    ref={inputRef}
                                    defaultValue={todo.title}
                                    className="w-full flex-1"
                                />
                            </>
                        ) : (
                            <>{todo.title}</>
                        )}
                    </div>
                </div>
                <Actions
                    loading={loading}
                    handleDelete={() => handleDelete(todo._id)}
                    handleEdit={() => { setEditMode(""); setEditMode(todo._id) }}
                />
            </div>
        </>
    );
}
