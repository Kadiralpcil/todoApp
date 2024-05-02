import Spinner from '@/app/components/Spinner'
import React from 'react'
import { MdDelete, MdEdit } from 'react-icons/md'

interface ActionsProps {
    loading: boolean,
    handleDelete: () => void;
    handleEdit: () => void;
}

export const Actions = ({ loading, handleDelete, handleEdit }: ActionsProps) => {
    return (
        <div className='flex gap-2 pe-2'>
            <div onClick={handleEdit}>
                <MdEdit size={20} color="blue" />
            </div>
            <button onClick={() => handleDelete()}>
                {loading ? <Spinner /> : <MdDelete size={20} color="red" />}
            </button>
        </div>
    )
}
