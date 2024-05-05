import { useEffect, useRef, useState } from "react";

import { useApiFiles } from "@/app/hooks/useApiFiles";

import Modal from "@/app/components/Modal";

import SelectBox from "@/app/todos/AllTodos/TodoItem/addUpdateModal/SelectBox";

import TodoResponseDto from "@/app/types";

import { CiImageOff } from "react-icons/ci";
import { CiFileOff } from "react-icons/ci";
import { FaFile } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { MdFileDownload } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FlagResponseDto } from "@/app/types/flagDto";

interface TodoModalProps {
    editedItem?: TodoResponseDto;
    open: boolean;
    onClose: () => void;
    flagList: FlagResponseDto[]
    onSave?: (newTodo: TodoResponseDto) => void
}

const TodoModal = ({ open, onClose, editedItem, flagList, onSave }: TodoModalProps) => {
    //State
    const [imageFile, setImageFile] = useState<File>();
    const [imageDeleted, setImageDeleted] = useState(false);

    const [file, setFile] = useState<File>();
    const [fileDeleted, setFileDeleted] = useState(false);

    //Ref
    const imgInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    //Hooks
    const { getImageFiles } = useApiFiles();
    const { getFiles } = useApiFiles();

    // Save Mutation
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        imageFile && saveImages();
        file && saveFiles();

        if (editedItem) {
            const formData = new FormData(event.target as HTMLFormElement);

            const newTitle = formData.get("title") as string;
            const newFlag = formData.get("flag") as string;
            const newImageUrl = formData.get("imageUrl") as string;
            const newFileUrl = formData.get("fileUrl") as string;

            await fetch(`api/todos/${editedItem._id}`, {
                method: "PUT",
                body: JSON.stringify({ newTitle, newFlag, newFileUrl, newImageUrl })
            }).then((response) => response.json())
                .then((data) => {
                    onSave && onSave(data.todo);
                    onClose()
                    const formElement = event.target as HTMLFormElement;
                    formElement.reset();

                    setImageFile(undefined);
                    setImageDeleted(false);
                    setFile(undefined);
                    setFileDeleted(false);
                })


        } else {
            const formData = new FormData(event.target as HTMLFormElement);

            const title = formData.get("title") as string;
            const imageUrl = formData.get("imageUrl") as string;
            const flag = formData.get("flag") as string;
            const fileUrl = formData.get("fileUrl") as string;

            await fetch("api/todos", {
                method: "POST",
                body: JSON.stringify({
                    title,
                    imageUrl,
                    flag,
                    fileUrl,
                }),
            }).then((response) => response.json())
                .then((data) => {
                    onSave && onSave(data.todo);
                    onClose()
                    const formElement = event.target as HTMLFormElement;
                    formElement.reset();

                    setImageFile(undefined);
                    setImageDeleted(false);
                    setFile(undefined);
                    setFileDeleted(false);
                })
        }
    };
    const saveImages = () => {
        const formData = new FormData();
        imageFile && formData.append("file", imageFile);

        fetch("/api/images", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch((err) => console.log(err));
    };
    const saveFiles = () => {
        const formData = new FormData();
        file && formData.append("file", file);

        fetch("/api/files", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch((err) => console.log(err));
    };

    //Handlers
    const handleImageFileChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageDeleted(false);
            setImageFile(file);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileDeleted(false);
            setFile(file);
        }
    };
    return (
        <Modal
            title={
                editedItem ? (
                    <div>
                        Edit <i>{editedItem.title}</i>
                    </div>
                ) : (
                    <>Add</>
                )
            }
            open={open}
            onClose={onClose}
        >
            <form id="add-update-form" onSubmit={handleSubmit}>
                <>
                    {/* hidden */}
                    <input
                        hidden
                        ref={imgInputRef}
                        type="file"
                        onChange={handleImageFileChange}
                        accept="image/*"

                    />
                    <input
                        id="imageUrl"
                        name="imageUrl"
                        value={imageFile ? imageFile?.name.replaceAll(" ", "_") : editedItem?.img}
                        hidden
                    />
                    <input
                        hidden
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        accept="application/pdf, application/vnd.ms-excel"
                    />
                    <input
                        id="fileUrl"
                        name="fileUrl"
                        value={file ? file?.name.replaceAll(" ", "_") : editedItem?.file}
                        hidden
                    />
                </>
                <div className="sm:flex sm:gap-2">
                    <div className="mb-4 sm:w-1/2">
                        <label
                            htmlFor="username"
                            className="block text-gray-700 font-semibold mb-2"
                        >
                            Title
                        </label>
                        <input
                            defaultValue={editedItem?.title}
                            type="text"
                            id="title"
                            name="title"
                            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                            placeholder="title..."
                            required
                        />
                    </div>
                    <div className="mb-4 sm:w-1/2">
                        <label
                            htmlFor="username"
                            className="block text-gray-700 font-semibold mb-2"
                        >
                            Flag
                        </label>
                        <SelectBox items={flagList ?? []} />
                    </div>
                </div>
                <div className="sm:flex sm:gap-2  justify-between">

                    <div className="sm:w-1/2 ">
                        <label className="block text-gray-700 font-semibold mb-2 w-full">
                            Thumbnail image
                        </label>
                        <div
                            className="flex justify-center"
                            onClick={() => imgInputRef.current?.click()}
                        >
                            {(imageFile || editedItem?.img) && !imageDeleted ? (
                                <div className="flex flex-col items-center justify-center w-[12rem] min-h-[12rem] cursor-pointer bg-gray-300 rounded">
                                    <img
                                        src={
                                            imageFile
                                                ? URL.createObjectURL(imageFile)
                                                : getImageFiles(editedItem?.img ?? "")
                                        }
                                        alt="Preview"
                                    />
                                    <div className="absolute bg-gray-700 w-[12rem] min-h-[12rem] flex justify-around items-center opacity-0 hover:opacity-80 transition-all	">
                                        <a
                                            onClick={(e) => e.stopPropagation()}
                                            href={
                                                imageFile
                                                    ? URL.createObjectURL(imageFile)
                                                    : getImageFiles(editedItem?.img ?? "")
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <FaEye className="text-3xl text-white cursor-pointer hover:text-gray-300" />
                                        </a>
                                        <a
                                            onClick={(e) => e.stopPropagation()}
                                            href={
                                                imageFile
                                                    ? URL.createObjectURL(imageFile)
                                                    : getImageFiles(editedItem?.img ?? "")
                                            }
                                            download
                                        >
                                            <MdFileDownload className="text-3xl text-white cursor-pointer hover:text-gray-300" />
                                        </a>
                                        <MdDelete
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setImageFile(undefined);
                                                setImageDeleted(true);
                                            }}
                                            className="text-3xl text-white cursor-pointer hover:text-gray-300"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center w-[12rem] min-h-[12rem] cursor-pointer bg-gray-300  rounded">
                                    <CiImageOff className="text-4xl" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="sm:w-1/2 ">
                        <label className="block text-gray-700 font-semibold mb-2">
                            Attch file
                        </label>
                        <div
                            className="flex justify-center"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {(file || editedItem?.file) && !fileDeleted ? (
                                <div className="relative flex flex-col items-center w-[12rem] min-h-[12rem]  bg-gray-200 rounded">
                                    <FaFile className="text-8xl absolute top-4" />
                                    <div className="absolute text-white bottom-0 bg-black text-xs text-center ">
                                        {file ? file.name : editedItem?.file}
                                    </div>
                                    <div className="absolute bg-gray-700 w-[12rem] min-h-[12rem] flex justify-around items-center opacity-0 hover:opacity-80 transition-all	">
                                        <a
                                            onClick={(e) => e.stopPropagation()}
                                            href={
                                                file
                                                    ? URL.createObjectURL(file)
                                                    : getFiles(editedItem?.file ?? "")
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <FaEye className="text-3xl text-white cursor-pointer hover:text-gray-300" />
                                        </a>
                                        <a
                                            onClick={(e) => e.stopPropagation()}
                                            href={
                                                file
                                                    ? URL.createObjectURL(file)
                                                    : getFiles(editedItem?.file ?? "")
                                            }
                                            download
                                        >
                                            <MdFileDownload className="text-3xl text-white cursor-pointer hover:text-gray-300" />
                                        </a>
                                        <MdDelete
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setFile(undefined);
                                                setFileDeleted(true);
                                            }}
                                            className="text-3xl text-white cursor-pointer hover:text-gray-300"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center w-[12rem] min-h-[12rem] cursor-pointer bg-gray-300  rounded">
                                    <CiFileOff className="text-4xl" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-4 mt-2">
                    <button
                        className="text-gray-600 hover:text-gray-800 font-medium"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                    >
                        Save
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default TodoModal;
