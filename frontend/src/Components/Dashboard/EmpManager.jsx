import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEmpManagerReviews } from "../../Api/Endpoints/endpoints";
import { toast } from "react-toastify";
import Modal from "../Modal";
import { GetterContext } from "../Context/NewContext";

const headers = ['ID', 'Employee name', 'Desgnation', 'Time Stamp', 'Manager Name', 'View'];
function toDisplay(d) {
    const date = new Date(d);
    return `${date.getDate()} ${month[date.getMonth()]} ${date.getFullYear()}, `
}
const month = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];


function EmpManager() {
    const { id } = useParams();
    const [reviews, setReviews] = useState([]);
    const [emp, setEmp] = useState(null);
    const { myRole, me } = useContext(GetterContext);
    const [viewModal, setViewModal] = useState(false)
    const [selRev, setSelRev] = useState(null);


    useEffect(() => {
        if (myRole.power >= 20) {
            getEmpManagerReviews(id).then(
                res => {
                    setReviews(res.rows);
                    setEmp(res.employee)
                }
            ).catch(exc => {
                toast.error(`Failed to fetch manager revies from server ${exc}`);
            })
        }

    }, []);

    return (
        <>
            {
                viewModal &&
                <>
                    <Modal isOpen={viewModal} onClose={_ => setViewModal(false)} title={'Manager Review'}>
                        <div className="flex flex-col">
                            <div className="m-1 p-1">
                                <label className="bg-[#F7F7F7] p-2 rounded-lg font-bold">Employee Name </label><span className="mx-3">{emp.name}</span>
                            </div>
                            <div className="m-1 p-1">
                                <label className="bg-[#F7F7F7] p-2 rounded-lg  font-bold">Employee ID </label><span className="mx-3">{emp.id}</span>
                            </div>
                            <div className="m-1 p-1">
                                <label className="bg-[#F7F7F7] p-2 rounded-lg  font-bold">Employee Department </label><span className="mx-3">{emp.department_id}</span>
                            </div>
                            <div className="m-1 p-1">
                                <label className="bg-[#F7F7F7] p-2 rounded-lg  font-bold">Employee Designation </label><span className="mx-3">{emp.designation}</span>
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
                                reviews.sort((a, b) => new Date(a.review_date).getTime() > new Date(b.review_date).getTime()).map(r => (
                                    <tr
                                        key={r.id}
                                        className="hover:bg-[#f7f7f7] transition-colors"
                                    >
                                        <td className="px-6 py-4">{r.id}</td>
                                        <td className="px-6 py-4">{emp.name}</td>
                                        <td className="px-6 py-4">{emp.designation ?? ""}</td>
                                        <td className="px-6 py-4">
                                            {toDisplay(r.review_date)}
                                        </td>
                                        <td className="px-6 py-4">{r.manager_name}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => {
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
                </div>
            </div>


        </>
    )
}

export default EmpManager;