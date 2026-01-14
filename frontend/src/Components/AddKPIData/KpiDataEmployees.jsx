import { useEffect, useState } from "react";
import { getEmployees, getEmployeesUnderDesg } from "../../Api/Endpoints/endpoints";
import KpiDataTable from "./KpiDataTable";
import EntryTable from "./EntryTable";
import { Link, useParams } from "react-router-dom";
import Spinner from "../Spinner";


function KpiDataEmployees({ desg, onSelEmp }) {

    const [emps, setEmps] = useState([])
    const [selEmp, setSelEmp] = useState(null);
    const [inspectKpi, setInspect] = useState(null);
    const { emp_id } = useParams()
    useEffect(_ => {
        (
            async () => {
                const mps = await getEmployeesUnderDesg(desg.id);
                console.log(mps.data);
                setEmps(mps.data);
            }
        )();
    }, []
    )
    return (
        <>
            <div
                className="flex flex-col flex-wrap min-w-full"
            >
                
                {
                    emps.filter(p => p.status == "Active").length == 0 &&
                    <div className="text-2xl text-center p-5">
                        No employees found under this designation.
                    </div>
                }
                {
                    !selEmp &&
                    <div className="flex flex-row gap-4 flex-wrap">
                        {
                            emps.filter(p => p.status == "Active").map(e => (
                             <>
                             <Link 
                             to={"" + encodeURIComponent(e.id)}
                                        onClick={_ => { setSelEmp({ id: e.id, name: e.name }); onSelEmp({ id: e.id, name: e.name }) }}>
                                <div
                                    className="bg-[#242552] p-7 px-15 rounded-lg flex flex-col items-center gap-3"
                                >
                                    <span
                                        className="text-white text-2xl"
                                    >{e.name}</span>
                                    <Link
                                        to={"" + encodeURIComponent(e.id)}
                                        onClick={_ => { setSelEmp({ id: e.id, name: e.name }); onSelEmp({ id: e.id, name: e.name }) }}
                                        className="border-white border-2 text-white px-4 rounded hover:cursor-pointer"
                                    >
                                        Select
                                    </Link>
                                </div>
                             </Link>
                             </>
                            ))
                        }
                    </div>
                }
                {
                    selEmp && (inspectKpi == null) ?
                        <KpiDataTable emp={selEmp} setInspect={setInspect} /> :
                        <EntryTable emp={selEmp} kpi={inspectKpi} />
                }
            </div>
        </>
    )
}

export default KpiDataEmployees;