"use client"
import React, { useState, ReactNode } from 'react';

interface TooltipProps {
    content: string | ReactNode;
    children: ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const handleMouseEnter = () => {
        setTimeout(() => {
            setShowTooltip(true);
        }, 1000);

        setTimeout(() => {
            setShowTooltip(false);
        }, 3000);

    };


    const handleMouseLeave = () => {
        setShowTooltip(false);
    };


    return (
        <div className="relative inline-block  hover:rounded-md hover:scale-110 transition-all  cursor-pointer" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {showTooltip && (
                <div className="absolute bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap top-full left-1/2 transform -translate-x-1/2 ">
                    {content}
                </div>
            )}
            {children}
        </div>
    );
};

export default Tooltip;
