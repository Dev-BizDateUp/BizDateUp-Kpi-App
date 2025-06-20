import { useEffect, useState } from "react";
import { ToastContainer } from 'react-toastify'
import Modal from "../Modal";
import ReviewForm from './ReviewForm';
import { MdEdit } from "react-icons/md";

import { getAllManagerReviews } from "../../Api/Endpoints/endpoints";

function ManagerViewTable() {
    const [reviewFormModal, setReviewFormModal] = useState(false);
    const [reviews, setReviews] = useState([]);
    const headers = ['ID', "Employee name", "Designation", "Time Stamp", "Manager Name", "Edit", "View"]
    const month = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    function toDisplay(d) {
        const date = new Date(d);
        return `${date.getDate()} ${month[date.getMonth()]} ${date.getFullYear()}, `
    }

    useEffect(_ => {
        (async () => {
            const res = await getAllManagerReviews();
            console.log("all manager reviews:", res.data)
            setReviews(res.data);
        })()
    }, [])

    return (
        <>
            <ToastContainer />
            {
                reviewFormModal &&
                <>
                    <Modal isOpen={reviewFormModal} onClose={_ => setReviewFormModal(false)} title={"Add new manager review"}>
                        <ReviewForm onReviewCreation={r => setReviewFormModal(false)} />
                    </Modal>
                </>
            }
            <div className="flex flex-col">
                <div className="bg-[#DDDDDD] p-3">
                    <button
                        onClick={_ => setReviewFormModal(true)}
                        className="text-xl bg-white text-black px-1.5 py-1.5 rounded-lg cursor-pointer"
                    >
                        Add Review
                    </button>
                </div>
                <div className="p-6">
                    <div
                        className="overflow-x-auto rounded-2xl shadow-lg flex flex-center justify-center"
                    >
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-[#2b2d5b] text-white">
                                <tr>
                                    {headers.map((header) => (
                                        <th
                                            key={header}
                                            className="px-6 py-4 text-left text-lg font-medium tracking-wide"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {
                                    reviews.sort((a, b) => new Date(a.review_date).getTime() < new Date(b.review_date).getTime()).map(r => (
                                        <tr
                                            key={r.id}
                                            className="hover:bg-[#f7f7f7] transition-colors"
                                        >
                                            <td className="px-6 py-4">{r.id}</td>
                                            <td className="px-6 py-4">{r.employees.name}</td>
                                            <td className="px-6 py-4">{r.employees.designations.name}</td>
                                            <td className="px-6 py-4">
                                                {toDisplay(r.review_date)}
                                            </td>
                                            <td className="px-6 py-4">{r.manager_name}</td>
                                            <td className="px-6 py-4">
                                                <button
                                                    className="hover:cursor-pointer border-2 border-black p-1 rounded-md"
                                                >
                                                    <MdEdit />
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    className="hover:cursor-pointer bg-[#312F54] text-white p-1 px-4 rounded-lg"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>


            </div>

        </>
    )
}

export default ManagerViewTable;