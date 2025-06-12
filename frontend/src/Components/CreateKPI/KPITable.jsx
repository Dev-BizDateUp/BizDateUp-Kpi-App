import React from "react";
import { useState, useEffect } from "react";
import Modal from '../Modal';
import ErrorBox from "../ErrorBox";
import { getKPIsForDesg, getKPIFreq,deleteForceKPI } from "../../Api/Endpoints/endpoints";
import { toast } from "react-toastify";

function KPITable({ designation, searchWord }) {

    const titles = ['ID', 'KPI Name', 'Target', 'Frequency', 'Delete', 'Edit'];
    const [freqs, setFreq] = useState([]);
    const [kpiRows, setKpiRows] = useState([]);

    useEffect(() => {
        async function kpi() {
            try {
                const fr = await getKPIFreq();
                setFreq(fr);
                const rows = await getKPIsForDesg(designation);
                setKpiRows(rows);
            }
            catch (ex) {
                console.log("Could not fetch kpis for designation!");
            }
        }
        kpi();
    }, []);

    function search(kpi) {
        return kpi.id.toString().toUpperCase().includes(searchWord.toUpperCase()) || kpi.name.toUpperCase().includes(searchWord.toUpperCase()) || kpi.designation.toUpperCase().includes(searchWord.toUpperCase());
    }
    const [modalOpen, setModalOpen] = useState(false);
    const [toDelete, setToDelete] = useState({});
    function deleteKPI(id) {
        (async () => {
            await deleteForceKPI(id);
            setModalOpen(false);
            toast.success("Deleted KPI");
        })();
    }
    return (
        <>
            {
                modalOpen &&
                <Modal isOpen={modalOpen} title={`Delete KPI: ${toDelete.title}`} onClose={_ => setModalOpen(false)}>
                    <div
                        className="flex flex-row"
                    >
                        <div className="text-6xl">⚠️</div>
                        <div className="flex flex-col">
                            <span>Are you sure you want to delete kpi "{toDelete.title}" and <span className="font-bold">all KPI entries under it</span>? <span className="text-red-500">This cannot be undone.</span></span>
                            <button
                                className="p-2 m-2 border-2 border-red-500 rounded-lg text-red-500 hover:cursor-pointer hover:bg-red-500 hover:text-white"
                                onClick={_ => deleteKPI(toDelete.id)}
                            >
                                DELETE
                            </button>
                        </div>

                    </div>
                </Modal>
            }
            {
                kpiRows.length > 0 ?
                    <div className="px-6">
                        <div className="overflow-x-auto rounded-2xl shadow-lg flex flex-center justify-center">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-[#2b2d5b] text-white rounded-lg">
                                    <tr>
                                        {
                                            titles.map((t, i) => (
                                                <th
                                                    key={i}
                                                    className="px-6 py-4 text-left text-lg font-medium tracking-wide "
                                                >
                                                    {t}
                                                </th>
                                            ))

                                        }
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {
                                        kpiRows.filter(search).map((kpi, idx) => (
                                            <>
                                                <tr
                                                    className="hover:bg-[#f7f7f7] transition-colors"
                                                >
                                                    <td className="px-6 py-4">{kpi.id}</td>

                                                    <td className="px-6 py-4">{kpi.title}</td>

                                                    <td className="px-6 py-4">{kpi.target ?? "None"}</td>

                                                    <td className="px-6 py-4">{freqs.filter(v => v.id == kpi.frequency_id)[0].name}</td>

                                                    <td className="px-6 py-4 justify-center items-center ">
                                                        <button className="hover:cursor-pointer"
                                                            onClick={_ => { setToDelete(kpi); setModalOpen(true); }}
                                                        >
                                                            {/* <img src="./delete.svg" /> */}
                                                            <svg width={24} height={24}>
                                                                <path d="M7 21.5C6.45 21.5 5.97917 21.3042 5.5875 20.9125C5.19583 20.5208 5 20.05 5 19.5V6.5H4V4.5H9V3.5H15V4.5H20V6.5H19V19.5C19 20.05 18.8042 20.5208 18.4125 20.9125C18.0208 21.3042 17.55 21.5 17 21.5H7ZM17 6.5H7V19.5H17V6.5ZM9 17.5H11V8.5H9V17.5ZM13 17.5H15V8.5H13V17.5Z" fill="#1D1B20" />
                                                            </svg>
                                                        </button>
                                                    </td>

                                                    <td className="px-6 py-4 justify-center items-center ">
                                                        <button className="hover:cursor-pointer">
                                                            <img src="./edit.svg" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            </>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    :
                    <ErrorBox >
                        No KPIs to see here 😔
                    </ErrorBox>
            }


        </>
    );
}
export default KPITable;