import { useContext, useEffect, useState } from "react"
import { getKpiEntries_emp, getKPIFreq, getKPIsForDesg, getKPIsForEmployee } from "../../Api/Endpoints/endpoints"
import { GetterContext } from "../Context/NewContext";
import { Link } from "react-router-dom";
import Spinner from "../Spinner";


export default function Home() {
    const [kpis, setKpis] = useState([]);
    const { me } = useContext(GetterContext)
    const [loading, setLoading] = useState(false);
    const [freqs, setFreq] = useState([]);

    useEffect(() => {

        if (me) {
            setLoading(true);
            getKPIsForEmployee(me.id).then(
                res => {
                    // console.log(res);
                    setKpis(res.data.data);
                }
            ).catch(
                err => {
                    console.error("Could not get kpis for this employee", err);
                }
            ).finally(() => {
                setLoading(false);
            })
        }

        async function kpi() {
            try {
                const fr = await getKPIFreq();
                setFreq(fr);
            }
            catch (ex) {
                console.log("Could not fetch kpis for designation!");
            }
        }
        kpi()

    }, [me])
    return (
        <div className="p-2">
            <h1 className="text-3xl px-5 p-2">My KPIs</h1>
            {
                kpis.length == 0 ? (
                    <Spinner />
                ) :( <div className="px-6">
                <div className="overflow-x-auto rounded-2xl shadow-lg flex flex-center justify-center">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-[#2b2d5b] text-white rounded-lg">
                            <tr>
                                <th
                                    className="px-6 py-4 text-left text-lg font-medium tracking-wide "
                                >
                                    ID
                                </th>
                                <th
                                    className="px-6 py-4 text-left text-lg font-medium tracking-wide "

                                >
                                    Title
                                </th>
                                <th
                                    className="px-6 py-4 text-left text-lg font-medium tracking-wide "

                                >
                                    Target
                                </th>
                                <th
                                    className="px-6 py-4 text-left text-lg font-medium tracking-wide "

                                >
                                    Frequency
                                </th>
                                <th
                                    className="px-6 py-4 text-left text-lg font-medium tracking-wide "

                                >
                                    View
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {



                                kpis.map(
                                    k =>
                                    (
                                        <tr
                                            className="hover:bg-[#f7f7f7] transition-colors"
                                        >
                                            <td className="px-6 py-4">{k.id}</td>
                                            <td className="px-6 py-4">{k.title}</td>
                                            <td className="px-6 py-4">{k.target ?? "None"}</td>
                                            <td className="px-6 py-4">{freqs.filter(v => v.id == k.frequency_id)[0]?.name}</td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    className="bg-green-500 text-white p-2 rounded-lg"
                                                    to={`kpi/${encodeURIComponent(k.id)}`}
                                                >
                                                    View
                                                </Link>
                                            </td>

                                        </tr>
                                    )
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>)
              
            }
           
           
        </div>
    )
}