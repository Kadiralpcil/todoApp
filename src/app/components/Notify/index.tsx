import React, { useEffect } from 'react';
import { IconType } from 'react-icons';
import { AiOutlineCheckCircle, AiOutlineWarning, AiOutlineCloseCircle } from 'react-icons/ai';

interface NotifyProps {
    message: string;
    variant: 'success' | 'warning' | 'error';
    onClose?: () => void; // Kapatma işlevi
}

const getIcon = (variant: string): IconType => {
    switch (variant) {
        case 'success':
            return AiOutlineCheckCircle;
        case 'warning':
            return AiOutlineWarning;
        case 'error':
            return AiOutlineCloseCircle;
        default:
            return AiOutlineCheckCircle;
    }
};

const getColorClass = (variant: string): string => {
    switch (variant) {
        case 'success':
            return 'bg-green-100 border-green-400 text-green-800';
        case 'warning':
            return 'bg-yellow-100 border-yellow-400 text-yellow-800';
        case 'error':
            return 'bg-red-100 border-red-400 text-red-800';
        default:
            return 'bg-green-100 border-green-400 text-green-800';
    }
};

const Notify: React.FC<NotifyProps> = ({ message, variant, onClose }) => {
    const Icon = getIcon(variant);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (onClose) {
                onClose(); // Bildirimi kapat
            }
        }, 3000); // 3 saniye sonra kapat

        return () => clearTimeout(timer); // Zamanlayıcıyı temizle
    }, [onClose]);

    return (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-md shadow-md flex items-center space-x-2 border-l-4 ${getColorClass(variant)}`}>
            <span className="text-xl">
                <Icon />
            </span>
            <p className="text-sm">{message}</p>
        </div>
    );
};

export default Notify;
