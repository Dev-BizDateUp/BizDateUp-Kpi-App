import { useEffect, useState } from "react";
import { ToastContainer } from 'react-toastify'
import Modal from "../Modal";
import ReviewForm from './ReviewForm';
import EditReviewForm from "./EditReviewForm";
import { MdEdit } from "react-icons/md";

import { getAllManagerReviews } from "../../Api/Endpoints/endpoints";
import ErrorBox from "../ErrorBox";

function ManagerViewTable() {
    const [reviewFormModal, setReviewFormModal] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [selRev, setSelRev] = useState(null);
    const [editModal, setEditModal] = useState(false)
    const [viewModal, setViewModal] = useState(false)
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
                        <ReviewForm onReviewCreation={r => { setReviewFormModal(false); setReviews([...reviews, r]) }} />
                    </Modal>
                </>
            }
            {
                editModal &&
                <>
                    <Modal isOpen={editModal} onClose={_ => setEditModal(false)} title={'Edit manager review'}>
                        <EditReviewForm current={selRev} onReviewEditted={_ => { setEditModal(false) }} />
                    </Modal>
                </>
            }
            {
                viewModal &&
                <>
                    <Modal isOpen={viewModal} onClose={_ => setViewModal(false)} title={'Manager Review'}>
                        <div className="flex flex-col">
                            <div className="m-1 p-1">
                                <label className="bg-[#F7F7F7] p-2 rounded-lg font-bold">Employee Name </label><span className="mx-3">{selRev.employees.name}</span>
                            </div>
                            <div className="m-1 p-1">
                                <label className="bg-[#F7F7F7] p-2 rounded-lg  font-bold">Employee ID </label><span className="mx-3">{selRev.employees.employee_id}</span>
                            </div>
                            <div className="m-1 p-1">
                                <label className="bg-[#F7F7F7] p-2 rounded-lg  font-bold">Employee Department </label><span className="mx-3">{selRev.employees.department}</span>
                            </div>
                            <div className="m-1 p-1">
                                <label className="bg-[#F7F7F7] p-2 rounded-lg  font-bold">Employee Designation </label><span className="mx-3">{selRev.employees.designations.name}</span>
                            </div>
                            <div className="m-1 p-1">
                                <label className="bg-[#F7F7F7] p-2 rounded-lg  font-bold">Manager Name </label><span className="mx-3">{selRev.manager_name}</span>
                            </div>
                            <div className="m-1 p-1">
                                <label className="bg-[#F7F7F7] p-2 rounded-lg  font-bold">Review Date </label><span className="mx-3">{toDisplay(selRev.review_date)}</span>
                            </div>
                            <div className="m-1 p-1">
                                <label className="bg-[#F7F7F7] p-2 rounded-lg  font-bold">Summary of KPIs assessed </label><span className="mx-3">{selRev.summary_kpi}</span>
                            </div>
                            <div className="m-1 p-1">
                                <label className="bg-[#F7F7F7] p-2 rounded-lg  font-bold">Strengths observed </label><span className="mx-3">{selRev.strengths}</span>
                            </div>
                            <div className="m-1 p-1">
                                <label className="bg-[#F7F7F7] p-2 rounded-lg  font-bold">Areas of improvement </label><span className="mx-3">{selRev.improvement}</span>
                            </div>
                            <div className="m-1 p-1">
                                <label className="bg-[#F7F7F7] p-2 rounded-lg  font-bold">Rating </label><span className="mx-3">{selRev.rating}/5</span>
                            </div>
                            <div className="m-1 p-1">
                                <label className="bg-[#F7F7F7] p-2 rounded-lg  font-bold">Actions </label><span className="mx-3">{selRev.actions.map(a => a + ", ")}</span>
                            </div>
                            <div className="m-1 p-1">
                                <label className="bg-[#F7F7F7] p-2 rounded-lg  font-bold">Recomended action(s) </label><span className="mx-3">{selRev.rating.length > 0 ? selRev.rating.map(k => k + ", ") : "None"}</span>
                            </div>
                            <div className="m-1 p-1">
                                <label className="bg-[#F7F7F7] p-2 rounded-lg  font-bold">Additional Comments </label><span className="mx-3">{selRev.comment}</span>
                            </div>
                            <div className="m-1 p-1">
                                <label className="bg-[#F7F7F7] p-2 rounded-lg  font-bold">Goals/Expectations for Next Review Period </label><span className="mx-3">{selRev.goals}</span>
                            </div>
                        </div>
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
                    {
                        reviews && reviews.length > 0 ?
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
                                            reviews.sort((a, b) => new Date(a.review_date).getTime() > new Date(b.review_date).getTime()).map(r => (
                                                <tr
                                                    key={r.id}
                                                    className="hover:bg-[#f7f7f7] transition-colors"
                                                >
                                                    <td className="px-6 py-4">{r.id}</td>
                                                    <td className="px-6 py-4">{r.employees.name}</td>
                                                    <td className="px-6 py-4">{r.employees.designations.name ?? ""}</td>
                                                    <td className="px-6 py-4">
                                                        {toDisplay(r.review_date)}
                                                    </td>
                                                    <td className="px-6 py-4">{r.manager_name}</td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={_ => {
                                                                setSelRev(r)
                                                                console.log('manager review to edit: ', r)
                                                                setEditModal(true)
                                                            }}
                                                            className="hover:cursor-pointer border-2 border-black p-1 rounded-md"
                                                        >
                                                            <MdEdit />
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={_ => {
                                                                setSelRev(r)
                                                                setViewModal(true);
                                                            }}
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
                            </div> :
                            <ErrorBox>
                                No manager reviews
                            </ErrorBox>
                    }

                </div>


            </div>

        </>
    )
}

export default ManagerViewTable;