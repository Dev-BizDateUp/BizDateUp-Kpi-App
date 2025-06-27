import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEmpManagerReviews } from "../../Api/Endpoints/endpoints";
import { toast } from "react-toastify";

const headers = ['ID', 'Employee name', 'Desgnation', 'Time Stamp', 'Manager Name', 'View'];
function toDisplay(d) {
    const date = new Date(d);
    return `${date.getDate()} ${month[date.getMonth()]} ${date.getFullYear()}, `
} const month = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
function EmpManager() {
    const { id } = useParams();
    const [reviews, setReviews] = useState([]);
    const [emp, setEmp] = useState(null);

    useEffect(() => {
        getEmpManagerReviews(id).then(
            res => {
                console.log("employee manager reviews ", res.rows)
                setReviews(res.rows);
                setEmp(res.employee)
            }
        ).catch(exc => {
            toast.error("Failed to fetch manager revies from server");
        })
    }, []);

    return (
        <>
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