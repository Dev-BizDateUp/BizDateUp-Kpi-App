import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { GetterContext } from "../Context/NewContext";
import { getKpiEntries_emp } from "../../Api/Endpoints/endpoints";
import Spinner from "../Spinner";
import Loader_Animation from "../Loader_Animation/Loader_Animation";

function get_time(id, row) {
    if (id == 1) {
        const start = new Date(new Date(row.kpi_periods.start_date).getTime() + (24 * 3600 * 1000));
        const end = new Date(new Date(row.kpi_periods.end_date).getTime() + (24 * 3600 * 1000));
        return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
    } else if (id == 2) {
        return months[row.kpi_periods.month].name;
    } else if (id == 3) {
        return row.kpi_periods.quarter;
    } else {
        return row.kpi_periods.year;
    }
}
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



export default function HomeKpi() {
    const { kpi_id } = useParams();
    const { me, kpis } = useContext(GetterContext);
    const [kpi, setKpi] = useState(null);
    const [kpiData, setKpiData] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (me) {
            setLoading(true)
            getKpiEntries_emp(kpi_id, me.id).then(res => {

                setKpiData(res.result.data);
            }).finally(() => {
                setKpi(kpis.find(k => k.id == kpi_id));
                setLoading(false);
            })

        }

    }, [me])

    return (
        <>
            <div
                className="p-6"
            >
                {
                    kpiData.length === 0 ? <>
                        <Spinner />

                    </> : <>
                        <div
                            className="min-w-full overflow-x-auto rounded-2xl shadow-lg flex flex-center justify-center  justify-stretch"
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
                                                fIDtoStr(kpi?.frequency_id)
                                            }
                                        </th>
                                        <th className="px-6 py-4 text-left text-lg font-medium tracking-wide">
                                            Target
                                        </th>
                                        <th className="px-6 py-4 text-left text-lg font-medium tracking-wide">
                                            Value Achieved
                                        </th>
                                        {
                                            kpiData[0] != undefined && kpiData[0].color != undefined &&
                                            <th className="px-6 py-4 text-left text-lg font-medium tracking-wide">
                                                Color
                                            </th>
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        kpiData.length === 0 ? <>
                                            <Spinner />
                                        </> : <>
                                            {
                                                kpiData.map((r, i) => (
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
                                                                    kpi.target ? r.value_achieved : (r.value_achieved > 0 ? "Yes" : "No")
                                                                }
                                                            </td>
                                                            {
                                                                r.color != undefined &&
                                                                <td className={`px-6 py-4 `}>
                                                                    <div className={`bg-${r.color}-500 text-white rounded-sm font-bold text-center py-1`}>
                                                                        {r.color.toUpperCase()}
                                                                    </div>

                                                                </td>
                                                            }

                                                        </tr>
                                                    </>
                                                ))
                                            }
                                        </>
                                    }
                                </tbody>
                            </table>
                        </div></>
                }

            </div>

        </>
    )
}