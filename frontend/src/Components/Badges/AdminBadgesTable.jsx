import React, { useContext, useState } from "react";
import { MdClose } from "react-icons/md";
import { GetterContext } from "../Context/NewContext";
import { approvebadge } from "../../Api/Endpoints/BadgesEndpoints.js/endpoint";
import { toast, ToastContainer } from "react-toastify";

const AdminBadgesTable = ({ columns, data }) => {
    const [selectedRow, setSelectedRow] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState(""); // "details" or "edit"
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reason, setReason] = useState("");
    const { myRole } = useContext(GetterContext);
    const handleRowClick = (row, columnKey) => {
        setSelectedRow(row);
        setModalType(columnKey);
        setModalOpen(true);
    };

    const statusColors = {
        Pending: "bg-[#FDFFAB] text-black",
        Approved: "bg-[#7EFF87] text-white",
        Rejected: "bg-[#FFECEE] text-red-800",
    };
    const closeModal = () => {
        setModalOpen(false);
        setModalType("");
        setSelectedRow(null);
    };
    const changebadgestatus = async (id, payload) => {
        try {
            const data = await approvebadge(id, payload)
        }
        catch (e) {
        }
    }
    const handleApprove = () => {
        const payload = {
            admin_id: myRole?.id,
            badge_id: selectedRow?.id,
            status: "Approved",
            reason: "Approved by admin",
        };
        changebadgestatus(selectedRow?.id, payload);
        setModalOpen(false)
        toast.success("Badge Approved ✅");
    };

    const handleReject = () => {
        if (!reason.trim()) {
            toast.error("Please enter a rejection reason ❌");
            return;
        }

        const payload = {
            admin_id: myRole?.id,
            badge_id: selectedRow?.id,
            status: "Rejected",
            reason,
        };
        changebadgestatus(selectedRow?.id, payload);

        toast.warning("Badge Rejected ⚠️");

        setIsModalOpen(false);
        setModalOpen(false);

        setReason("");
    };

    return (
        <>
            <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left ">
                    <thead className="text-sm text-white uppercase  bg-[#312F52]  ">
                        <tr>
                            {columns?.map((column) => (
                                <th key={column.key} scope="col" className="py-3 px-6">
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className=" text-xl bg-[#f7f7f7] dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                            >
                                {columns?.map((column) => (
                                    <td
                                        key={column.key}
                                        className={`py-4 px-6 `}
                                        onClick={() => handleRowClick(row, column.key)}
                                    >
                                        {column.key === "details" ? (
                                            <span className="bg-white text-left w-[150px] px-5 py-2 rounded-2xl">
                                                {row[column.key]}
                                            </span>
                                        ) : column.key === "status" ? (<> <span className={` ${statusColors[row[column.key]]} p-2 rounded font-bold`}>
                                            {row[column.key]}
                                        </span></>) : (row[column.key])}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
                    onClick={closeModal} // close on backdrop click
                >
                    <div
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-1/3"
                        onClick={(e) => e.stopPropagation()} // prevent modal close on content click
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-[#312F54]">
                                {modalType === "details" ? "Badge Info" : "Edit Badge"}
                            </h2>
                            <MdClose
                                className="text-2xl cursor-pointer font-bold"
                                onClick={closeModal}
                            />
                        </div>

                        {selectedRow ? (
                            <>
                                {modalType === "details" && (
                                    <div className="flex flex-col gap-5">
                                        <p>
                                            <span className="font-medium bg-[#F7F7F7] px-2 py-2 rounded-xl">
                                                Giver:
                                            </span>{" "}
                                            &nbsp;&nbsp;{selectedRow.giver}
                                        </p>
                                        <p>
                                            <span className="font-medium bg-[#F7F7F7] px-2 py-2 rounded-xl">
                                                Recipient:
                                            </span>{" "}
                                            &nbsp;&nbsp;{selectedRow.recipient}
                                        </p>
                                        <p>
                                            <span className="font-medium bg-[#F7F7F7] px-2 py-2 rounded-xl">
                                                Comment:
                                            </span>{" "}
                                            &nbsp;&nbsp;{selectedRow.comment}
                                        </p>
                                        <p>
                                            <span className="font-medium bg-[#F7F7F7] px-2 py-2 rounded-xl">
                                                Status:
                                            </span>{" "}
                                            &nbsp;&nbsp;{selectedRow.status}
                                        </p>
                                    </div>

                                )}
                                {modalType === "edit" && (
                                    <>
                                        <div className="flex flex-col gap-5">
                                            <p>
                                                <span className="font-medium bg-[#F7F7F7] px-2 py-2 rounded-xl">
                                                    Giver:
                                                </span>{" "}
                                                &nbsp;&nbsp;{selectedRow.giver}
                                            </p>
                                            <p>
                                                <span className="font-medium bg-[#F7F7F7] px-2 py-2 rounded-xl">
                                                    Recipient:
                                                </span>{" "}
                                                &nbsp;&nbsp;{selectedRow.recipient}
                                            </p>
                                            <p>
                                                <span className="font-medium bg-[#F7F7F7] px-2 py-2 rounded-xl">
                                                    Comment:
                                                </span>{" "}
                                                &nbsp;&nbsp;{selectedRow.comment}
                                            </p>
                                            <p>
                                                <span className="font-medium bg-[#F7F7F7] px-2 py-2 rounded-xl">
                                                    Status:
                                                </span>{" "}
                                                &nbsp;&nbsp;{selectedRow.status}
                                            </p>
                                        </div>
                                        <div className="flex justify-center gap-4 mt-6">
                                            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700" onClick={handleApprove}>
                                                Approve
                                            </button>
                                            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700" onClick={() => setIsModalOpen(true)}>
                                                Reject
                                            </button>
                                        </div>
                                    </>
                                )}

                            </>
                        ) : (
                            <p>No row selected</p>
                        )}
                    </div>
                </div>
            )}
            {isModalOpen && (
                <div className="fixed inset-0 bg-[#05050580] flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[600px]">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl capitalize font-bold text-[#312F54] mb-4">
                                Reject reason
                            </h2>
                            <MdClose
                                className="text-xl font-bold cursor-pointer"
                                onClick={() => setIsModalOpen(false)}
                            />
                        </div>
                        <label className="block text-black mb-2">
                            Enter reason for rejection:*
                        </label>
                        <input
                            type="text"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Type reason..."
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleReject}
                                disabled={!reason.trim()}
                                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </>
    );
};

export default AdminBadgesTable;
