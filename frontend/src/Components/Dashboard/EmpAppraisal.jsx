import { useEffect, useState } from "react";
import { GetterContext, SetterContext } from "../Context/NewContext";
import Modal from "../Modal";
import AppraisalView from '../Appraisal/AppraisalView';
// import AppraisalEdit from "./AppraisalEdit";
import { useParams } from "react-router-dom";
import { getAppraisals_emp } from "../../Api/Endpoints/appraisalEndpoints";

function displayDate(date) {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

const headers = ['ID', 'Manager', 'Overall Rating', 'Start Date', 'End Date', 'Review Date', 'View'];

export default function EmpAppraisal() {
    const { id } = useParams();
    // const { appraisals, employees } = useContext(GetterContext);
    const [appraisals, setAppraisals] = useState([]);
    const [selApp, setSelApp] = useState(0);
    const [open, setOpen] = useState(false);
    // const [openEdit, setOpenEdit] = useState(false);
    // const [selEdit, setSelEdit] = useState(null);

    useEffect(() => {
        getAppraisals_emp(id).then(
            res => {
                if (res.result)
                    setAppraisals(res.result);
                else
                    console.error("Could not get employee appraisals ", res.error)
            }
        )
    }, [])

    return (
        <>
            {
                open &&
                <Modal isOpen={open} onClose={() => setOpen(false)} title={'Appraisal View'}>
                    <AppraisalView id={selApp} />
                </Modal>
            }

            <div>
                <div className="p-8 rounded-4xl">
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
                                appraisals &&
                                appraisals.sort((a, b) => new Date(a.review_date).getTime() > new Date(b.review_date).getTime()).map(a => (
                                    <tr
                                        key={a.id}
                                        className="hover:bg-[#f7f7f7] transition-colors"
                                    >
                                        <td className="px-6 py-4">{a.id}</td>
                                        <td className="px-6 py-4">{a.manager_name}</td>
                                        <td className="px-6 py-4">{a.overall_rating}</td>
                                        <td className="px-6 py-4">{displayDate(a.start)}</td>
                                        <td className="px-6 py-4">{displayDate(a.end)}</td>
                                        <td className="px-6 py-4">{displayDate(a.review_date)}</td>
                                        <td className="px-6 py-4 ">
                                            <button
                                                className="bg-green-500 shadow text-white px-4 py-2 rounded-xl hover:cursor-pointer"
                                                onClick={() => {
                                                    setSelApp(a.id);
                                                    setOpen(true);
                                                }}
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