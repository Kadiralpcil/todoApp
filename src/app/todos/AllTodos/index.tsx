"use client"

import React, { useEffect, useRef, useState } from 'react'
import TodoItem from './TodoItem'
import { GoPlusCircle } from "react-icons/go";
import Tooltip from '@/app/components/Tooltip';
import Image from 'next/image';
import nothingTodo from '../../../../public/bruno-mars-nothing-at-all.gif'
import TodoResponseDto from '@/app/types';
import { useRouter } from 'next/navigation';
import Spinner from '@/app/components/Spinner';
import TodoModal from './TodoItem/addUpdateModal';
import { FlagResponseDto } from '@/app/types/flagDto';

interface AllTodosProps {
    todos: TodoResponseDto[],
    setTodoList: React.Dispatch<React.SetStateAction<TodoResponseDto[]>>,
    refetchTrigger: () => void;
    loading: boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    flagList: FlagResponseDto[]
}
export const AllTodos = ({ todos, setTodoList, refetchTrigger, loading, setLoading, flagList }: AllTodosProps) => {
    //State
    const [modal, setModal] = useState(false)
    //Ref
    const addInput = useRef<HTMLInputElement>(null)
    const router = useRouter()
    //Handlers
    const handleSubmit = async (event: React.FormEvent) => {
        const formData = new FormData(event.target as HTMLFormElement);
        const title = formData.get("title");
        if (JSON.stringify({
            title,
        }).length === 0) {
            return
        }
        setLoading(true)

        event.preventDefault();

        await fetch("api/todos", {
            method: "POST",
            body: JSON.stringify({
                title,
            }),
        });
        refetchTrigger()
        if (addInput.current) {
            addInput.current.value = '';
            addInput.current.focus();
        }
        setLoading(false)
    };

    return (
        <>
            <TodoModal
                open={modal}
                onClose={() => setModal(false)}
                editedItem={undefined}
                flagList={flagList}
                onSave={(todo: TodoResponseDto) => setTodoList(todoList => [...todoList, todo])}
            />
            <div>
                <div className="flex justify-end">
                    <button onClick={() => setModal(true)} className='flex justify-end me-2'>
                        {loading ? <Spinner /> : <GoPlusCircle color='gray' size={20} />}
                    </button>
                </div>
                <form onSubmit={handleSubmit} className='flex justify-center'>
                    <input
                        ref={addInput}
                        className='outline-none w-full'
                        placeholder='Quick todo..'
                        id="title"
                        name="title"
                    />

                </form>
                <div className='max-h-[30rem] w-full overflow-auto mt-5'>
                    {loading ? "loading.." :
                        todos.length === 0 ? (
                            <div className='w-full h-full flex flex-col gap-2 justify-center items-center mt-10'>
                                <p>There is nothing to do..</p>
                                <Image
                                    className='rounded-3xl w-[80%] h-full'
                                    src={nothingTodo}
                                    alt='there is nothing to do..'
                                />
                            </div>
                        ) : (todos.map((todo, index) => (
                            <TodoItem
                                key={todo._id}
                                todo={todo}
                                setTodoList={setTodoList}
                                refetchTrigger={() => router.push("/todos")}
                                loading={loading}
                                setLoading={setLoading}
                                flagList={flagList}
                            />
                        )))
                    }
                </div>

            </div>
        </>
    )
}