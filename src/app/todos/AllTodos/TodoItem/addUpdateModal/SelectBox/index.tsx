import { FlagResponseDto } from '@/app/types/flagDto';
import { FaBookmark } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';

interface SelectBoxProps {
    items: FlagResponseDto[];
    defaultSelectedItem?: string
}

const SelectBox = ({ items, defaultSelectedItem }: SelectBoxProps) => {
    const [selectedItem, setSelectedItem] = useState<string>('');

    useEffect(() => {
        if (defaultSelectedItem) {
            setSelectedItem(items.find(item => item._id === defaultSelectedItem)?._id ?? "")
        }
    })

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedItem(e.target.value);
    };

    return (
        <div className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 flex" >
            <div className="mr-2">
                <FaBookmark className="text-xl" color={items.find(item => item._id === selectedItem)?.name ?? "gray"} />
            </div>
            <select
                name='flag'
                id='flag'
                value={selectedItem}
                onChange={handleSelectChange}
                className="w-full outline-none "
            >
                <option value="" className='text-center'>none</option>
                {items.map((item) => (
                    <option key={item._id} value={item._id} className='p-2 text-center' >
                        <div className='p-5'>
                            {item.name}
                        </div>
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectBox;
