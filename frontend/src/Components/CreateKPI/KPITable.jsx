import React from "react";
import { useState, useEffect } from "react";
import ErrorBox from "../ErrorBox";

function KPITable({ designation, searchWord }) {

    const titles = ['ID', 'KPI Name', 'Designation', 'Frequency', 'Delete', 'Edit'];

    const [kpiRows, setKpiRows] = useState([]);

    function search(kpi) {
        return kpi.id.toUpperCase().includes(searchWord.toUpperCase()) || kpi.name.toUpperCase().includes(searchWord.toUpperCase()) || kpi.designation.toUpperCase().includes(searchWord.toUpperCase());
    }

    return (
        <>
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