import { useEffect, useState } from "react";
import { getKpiEntries_emp } from "../../Api/Endpoints/endpoints";
import { toast } from "react-toastify";
import Modal from "../Modal";
import EntryEditForm from "./EntryEditForm.jsx";

const months = [
    { name: 'April', canonic: 3 },
    { name: 'May', canonic: 4 },
    { name: 'June', canonic: 5 },
    { name: 'July', canonic: 6 },
    { name: 'August', canonic: 7 },
    { name: 'September', canonic: 8 },
    { name: 'October', canonic: 9 },
    { name: 'November', canonic: 10 },
    { name: 'December', canonic: 11 },
    { name: 'January', canonic: 0 },
    { name: 'February', canonic: 1 },
    { name: 'March', canonic: 2 },
];


function EntryTable({ kpi, emp }) {

    function fIDtoStr(id) {
        if (id == 1) {
            return 'Week';
        } else if (id == 2) {
            return 'Month';
        } else if (id == 3) {
            return 'Quarter';
        } else {
            return 'Year';
        }
    }

    function get_time(id, row) {
        if (id == 1) {
            const start = new Date(new Date(row.kpi_periods.start_date).getTime() + (24 * 3600 * 1000));
            const end = new Date(new Date(row.kpi_periods.end_date).getTime() + (24 * 3600 * 1000));
            return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
        } else if (id == 2) {
            return months[row.kpi_periods.month - 1].name;
        } else if (id == 3) {
            return row.kpi_periods.quarter;
        } else {
            return row.kpi_periods.year;
        }
    }

    useEffect(_ => {
        (async _ => {
            if (kpi && emp) {
                const res = await getKpiEntries_emp(kpi.id, emp.id);
                // console.log("Rows of kpi entries are ", res)
                if (res.result) {
                    setRows(res.result.data);
                } else {
                    toast.error(`Could not get kpi entries ${res.error}`);
                }
            }
        })();
    }, [kpi, emp])

    const [rows, setRows] = useState([]);
    const [editModal, setEditModal] = useState(false);
    const [entry, setEntry] = useState(null);


    return (
        <>
            {
                kpi && emp &&
                <>
                    {
                        editModal &&
                        <Modal isOpen={editModal} onClose={_ => setEditModal(false)} title={'Edit kpi entry'}>
                            <EntryEditForm onSuccess={_ => setEditModal(false)} entry={entry} />
                        </Modal>
                    }
                    <div
                        className="min-w-full overflow-x-auto rounded-2xl shadow-lg flex flex-center justify-center justify-stretch"
                    >
                        <table className="min-w-full divide-y divide-gray-200 justify-stretch">
                            <thead className="bg-[#2b2d5b] text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-lg font-medium tracking-wide">
                                        ID
                                    </th>
                                    <th className="px-6 py-4 text-left text-lg font-medium tracking-wide">
                                        KPI Name
                                    </th>
                                    <th className="px-6 py-4 text-left text-lg font-medium tracking-wide">
                                        Year
                                    </th>
                                    <th className="px-6 py-4 text-left text-lg font-medium tracking-wide">
                                        {
                                            fIDtoStr(kpi.frequency_id)
                                        }
                                    </th>
                                    <th className="px-6 py-4 text-left text-lg font-medium tracking-wide">
                                        Target
                                    </th>
                                    <th className="px-6 py-4 text-left text-lg font-medium tracking-wide">
                                        Value Achieved
                                    </th>
                                    <th className="px-6 py-4 text-left text-lg font-medium tracking-wide">
                                        Edit Data
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    rows.map((r, i) => (
                                        <>
                                            <tr
                                                key={i}
                                                className="hover:bg-[#f7f7f7] transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    {r.id}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {kpi.title}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {r.kpi_periods.year}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {
                                                        get_time(kpi.frequency_id, r)
                                                    }
                                                </td>
                                                <td className="px-6 py-4">
                                                    {
                                                        kpi.target ?? "None"
                                                    }
                                                </td>
                                                <td className="px-6 py-4">
                                                    {
                                                        r.value_achieved
                                                    }
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        className="text-xl rounded shadow p-1 px-2 hover:cursor-pointer"
                                                        onClick={
                                                            _ => {
                                                                setEditModal(true);
                                                                setEntry({ ...r, kpi: kpi });
                                                            }
                                                        }
                                                    >
                                                        Edit Data
                                                    </button>
                                                </td>
                                            </tr>
                                        </>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </>
            }

        </>
    )
}

export default EntryTable;