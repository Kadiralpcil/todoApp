import React, { useEffect, useRef, useState } from "react";

import TodoResponseDto from "@/app/types";
import { FlagResponseDto } from "@/app/types/flagDto";
import { FaBookmark } from "react-icons/fa";

import { Actions } from "./actions";
import TodoModal from "./addUpdateModal";
import { CiImageOff } from "react-icons/ci";
import { FaFileDownload } from "react-icons/fa";
import { useApiFiles } from "@/app/hooks/useApiFiles";

interface TodoItemProps {
    todo: TodoResponseDto;
    setTodoList: React.Dispatch<React.SetStateAction<TodoResponseDto[]>>;
    refetchTrigger: () => void;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    flagList: FlagResponseDto[]
}

export default function TodoItem({
    todo,
    refetchTrigger,
    setTodoList,
    loading,
    setLoading,
    flagList
}: TodoItemProps) {
    //States
    const [dropdownToggle, setDropdownToggle] = useState(false);
    const [currentEditedItem, setCurrentEditedItem] = useState<
        TodoResponseDto | undefined
    >(undefined);

    //Hooks
    const { getImageFiles } = useApiFiles();
    const { getFiles } = useApiFiles()

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


    return (
        <>
            <TodoModal
                editedItem={currentEditedItem}
                open={currentEditedItem !== undefined ? true : false}
                onClose={() => setCurrentEditedItem(undefined)}
                flagList={flagList}
                onSave={(todo: TodoResponseDto) =>
                    setTodoList(todoList => {
                        const updatedList = todoList.filter(item => item._id !== todo._id);
                        return [...updatedList, todo];
                    })
                }

            />
            <div
                key={todo._id}
                className="flex items-center space-x-4 mb-2 shadow-sm p-2 hover:bg-slate-200 flex-1"
            >
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
                    {todo?.img ? (
                        <div className="max-w-[50px] min-w-[50px] min-h-[50px] flex justify-center ">
                            <img
                                src={getImageFiles(todo?.img ?? "")}
                                alt="Preview"
                                className="w-full rounded-lg"
                            />
                        </div>
                    ) : (
                        <div className="max-w-[50px] min-w-[50px] min-h-[50px] justify-center ">
                            <CiImageOff className="text-5xl w-full" />
                        </div>
                    )}

                    <div className="flex justify-between flex-1 items-center">
                        {todo.title}
                        {todo.file && (
                            <a
                                onClick={(e) => e.stopPropagation()}
                                href={getFiles(todo?.file ?? "")}
                                download
                            >
                                <FaFileDownload className="text-xl cursor-pointer " />
                            </a>
                        )}
                    </div>
                </div>
                <Actions
                    loading={loading}
                    handleDelete={() => handleDelete(todo._id)}
                    handleEdit={() => setCurrentEditedItem(todo)}
                />
            </div>
        </>
    );
}
