import React from "react";

const BadgesModal = ({ badge, closeModal }) => {
    if (!badge) return null;

    return (
        <div className="fixed inset-0 bg-[#00000079] bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full relative">
                <button
                    onClick={closeModal}
                    className="absolute top-5 right-5 text-black hover:text-gray-800 text-4xl cursor-pointer font-bold"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-bold mb-4 text-[#312F54]">Given Badges </h2>
                <div className="space-y-4 flex flex-col gap-5">
                    <p><strong className="bg-[#F7F7F7] p-3 text-lg">Employee Name:</strong> <span className="text-xl mx-2 font-semibold text-[#312F54]">{badge.employees_badges_receiver_idToemployees.name}</span></p>
                    <p><strong className="bg-[#F7F7F7] p-3 text-lg">Comment:</strong> <span className="text-xl mx-2 font-semibold text-[#312F54]">{badge.comment}</span></p>
                    <p><strong className="bg-[#F7F7F7] p-3 text-lg">Status:</strong> <span className="text-xl mx-2 font-semibold text-[#312F54]">{badge.status}</span></p>
                    {/* Add more details as needed */}
                </div>
            </div>
        </div>
    );
};

export default BadgesModal;