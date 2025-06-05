import { useEffect, useState } from 'react';
import { IoClose } from "react-icons/io5";

const Modal = ({ isOpen, onClose,title, children }) => {
    const [isVisible, setIsVisible] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            // Delay actual unmount until after animation
            const timeout = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timeout);
        }
    }, [isOpen]);

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 bg-[#05050580] flex justify-center items-center z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'
                }`}
        >
            <div
                className={`bg-white p-6 rounded-lg shadow-md xl:w-[800px] transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                    }`}
            >
                <div className="flex justify-end">
                    
                    <IoClose size={24} className="cursor-pointer" onClick={onClose} />
                </div>
                <div className='text-3xl text-[#312F54] m-2'>
                    {title}
                </div>
                {children}
            </div>
        </div>
    );
};

export default Modal;
