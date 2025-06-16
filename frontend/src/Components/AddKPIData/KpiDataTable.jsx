import { useEffect, useState } from "react";
import {
    getKpiVals_Employee, getKPIsForEmployee
} from '../../Api/Endpoints/endpoints'
import Modal from "../Modal";
import AddKPIValueForm from "./AddKPIValueForm";

function KpiDataTable({ emp }) {
    const [kvals, setKvals] = useState([]);
    const [addValModal, setAddValModal] = useState(false);
    const [selKpi,setSelKpi] = useState(null);

    useEffect(_ => {
        (async () => {
            const kvs = await getKPIsForEmployee(emp.id);
            if (kvs.data.data) {
                setKvals(kvs.data.data);
            }
            console.log(kvs.data);
        })();
    }, [emp]);

    function fIDtoStr(id) {
        if (id == 1) {
            return 'Weekly';
        } else if (id == 2) {
            return 'Monthly';
        } else if (id == 3) {
            return 'Quarterly';
        } else {
            return 'Yearly';
        }
    }

    return (
        <>
            {
                emp &&
                <div className="flex flex-row gap-2">
                    <div className="text-2xl mb-2">{emp.name}</div>
                    {/* <button
                        onClick={_ => setAddValModal(true)}
                        className="p-2 px-4 my-2 rounded-xl hover:cursor-pointer border-black border-1"
                    >
                        Add
                    </button> */}
                </div>
            }
            {
                addValModal &&
                <Modal isOpen={addValModal} onClose={_ => setAddValModal(false)} title={"Add new entry to kpi"}>
                    <AddKPIValueForm empID={emp.id} kpi={selKpi} onFormSubmit={_ => setAddValModal(false)}/>
                </Modal>
            }
            <div
                className="overflow-x-auto rounded-2xl shadow-lg flex flex-center justify-center justify-stretch"
            >
                <table className="min-w-full divide-y divide-gray-200 justify-stretch">
                    <thead className="bg-[#2b2d5b] text-white">
                        <tr>
                            <th className="px-6 py-4 text-left text-lg font-medium tracking-wide">
                                ID
                            </th>
                            <th className="px-6 py-4 text-left text-lg font-medium tracking-wide">
                                KPI name
                            </th>
                            <th className="px-6 py-4 text-left text-lg font-medium tracking-wide">
                                Frequency
                            </th>
                            <th className="px-6 py-4 text-left text-lg font-medium tracking-wide">
                                Data
                            </th>
                            <th className="px-6 py-4 text-left text-lg font-medium tracking-wide">
                                Target
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            kvals.map((k, id) => (
                                <tr
                                    key={k.id}
                                    className="hover:bg-[#f7f7f7] transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        {k.id}
                                    </td>
                                    <td className="px-6 py-4">
                                        {k.title}
                                    </td>
                                    <td className="px-6 py-4">
                                        {fIDtoStr(k.frequency_id)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {/* {k.value_achieved} */}
                                        {/* <div>Add</div> */}
                                        <button
                                            className="p-3 shadow-lg hover:cursor-pointer rounded-xl"
                                            onClick={_ => {
                                                setSelKpi(k);
                                                setAddValModal(true)
                                            }}
                                        >
                                            Add
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        {k.target}
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

            </div>

        </>
    )
}

export default KpiDataTable;