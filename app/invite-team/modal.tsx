'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import closeIcon from './icons/close-icon.png';

interface MyModalProps {
  isModalOpen: boolean;
  //   setIsModalOpen: (isOpen: boolean) => void;
  handleOpenModal: () => void;
  handleCloseModal: () => void;
  title: string;
  message: string;
  actionName: string;
  //   modalRef: React.RefObject<HTMLDivElement>;
}

const MyModal: React.FC<MyModalProps> = ({
  handleOpenModal,
  handleCloseModal,
  isModalOpen,
  title,
  message,
  actionName,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleCancel = () => {
    handleCloseModal();
    // Add logic for cancel action here
  };

  //   const handleSuspend = () => {
  //     handleCloseModal();
  //     // Add logic for suspend action here
  //   };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        handleCloseModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isModalOpen, handleCloseModal]);

  return (
    <div className="flex items-center justify-center h-screen">
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="bg-white w-[550px] p-6 rounded-lg shadow-lg relative" ref={modalRef}>
            <div className="flex justify-end">
              <button className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={handleCloseModal}>
                <Image src={closeIcon} alt="close" height={24} width={24} />
              </button>
            </div>
            <h2 className=" text-2xl text-center font-medium mt-2 mb-4">{title}</h2>
            <p className="mb-4 text-center">{message}</p>
            <div className="flex justify-center">
              <button
                className="bg-[#f5e7ff] text-primary font-medium px-4 py-2 rounded-md mr-2"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="bg-transparent border border-[#B93F54] hover:bg-[#B93F54] hover:text-white  text-[#B93F54] px-4 py-2 rounded-md"
                // onClick={handleSuspend}
              >
                {actionName}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyModal;
