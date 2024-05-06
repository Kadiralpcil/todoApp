

import { ReactElement, useEffect, useRef, useState } from 'react';
import { IoIosCloseCircleOutline } from "react-icons/io";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactElement;
  title: ReactElement
  size?: "sm"
};

const Modal: React.FC<ModalProps> = ({ open, onClose, children, title, size }) => {
  //Ref
  const modalRef = useRef<HTMLDivElement>(null);
  //Effects
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [open, onClose]);

  return (
    <>
      {open && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center ">
          <div ref={modalRef} className={size ? "w-[15rem] bg-white overflow-y-auto" : "bg-white w-full overflow-y-auto rounded-lg max-h-[40rem] sm:max-w-[40rem] "}>
            <div className="flex justify-between p-4 ">
              <div className='font-bold'>
                {title}
              </div>
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={onClose}
              >
                <IoIosCloseCircleOutline size={26} />
              </button>
            </div>
            <div className="p-6 ">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
