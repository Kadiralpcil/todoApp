import React, { useEffect, useRef, useState } from "react";
import { MdCancel, MdDelete, MdEdit, MdSave } from "react-icons/md";
import Tooltip from "@/app/components/Tooltip";
import TodoResponseDto from "@/app/types";
import { FlagResponseDto } from "@/app/types/flagDto";
import { FaBookmark } from "react-icons/fa";
import Spinner from "@/app/components/Spinner";

interface TodoItemProps {
    todo: TodoResponseDto;
    setTodoList: React.Dispatch<React.SetStateAction<TodoResponseDto[]>>
    refetchTrigger: () => void;
}

export default function TodoItem({ todo, refetchTrigger, setTodoList }: TodoItemProps) {
    //States
    const [loading, setLoading] = useState(false)
    const [dropdownToggle, setDropdownToggle] = useState(false);
    const [flagList, setFlagList] = useState<FlagResponseDto[]>([]);
    const [editMode, setEditMode] = useState<boolean>(false);
    //Refs
    const inputRef = useRef<HTMLInputElement>(null);
    //Effects
    useEffect(() => {
        if (editMode && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editMode]);
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
        setEditMode(true);
    };
    const handleCancelEdit = () => {
        setEditMode(false);
    };
    //Mutations
    const saveTitle = async (newTitle: string) => {
        setLoading(true)
        await fetch(`api/todos/${todo._id}`, {
            method: "PUT",
            body: JSON.stringify({ newTitle }),
        });
        setEditMode(false);
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


    return (
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
                            <div className="absolute w-12 bg-white rounded-lg shadow-lg z-10">
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
                {editMode ? (
                    <input
                        name="title"
                        id="title"
                        className="outline-2 bg-blue-100 w-full"
                        ref={inputRef}
                        defaultValue={todo.title}
                    />
                ) : (
                    todo.title
                )}
            </span>
            {editMode ? (
                <>
                    <button
                        onClick={() => saveTitle(inputRef.current?.value ?? todo.title)}
                    >
                        <Tooltip content="Save">
                            {loading ? <Spinner /> : <MdSave size={20} color="blue" />}
                        </Tooltip>
                    </button>
                    <button onClick={handleCancelEdit}>
                        <Tooltip content="Cancel">
                            <MdCancel size={20} color="blue" />
                        </Tooltip>
                    </button>
                </>
            ) : (
                <>
                    <div onClick={handleEditMode}>
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
            )}
        </div>
    );
}
