import { useEffect, useState } from "react";
import { getEmployees, getEmployeesUnderDesg } from "../../Api/Endpoints/endpoints";
import KpiDataTable from "./KpiDataTable";
function KpiDataEmployees({ desg }) {

    const [emps, setEmps] = useState([])
    const [selEmp, setSelEmp] = useState(null);
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
                className="flex flex-col flex-wrap"
            >
                {emps.length == 0 &&
                    <div className="text-2xl text-center p-5">
                        No employees found under this designation.
                        </div>
                }
                {
                    !selEmp &&
                    <div className="flex flex-row gap-4 flex-wrap">
                        {
                            emps.filter(p => p.status == "Active").map(e => (
                                <div
                                    className="bg-[#242552] p-7 px-15 rounded-lg flex flex-col items-center gap-3"
                                >
                                    <span
                                        className="text-white text-2xl"
                                    >{e.name}</span>
                                    <button
                                        onClick={_ => { setSelEmp({ id: e.id, name: e.name }) }}
                                        className="border-white border-2 text-white px-4 rounded hover:cursor-pointer"
                                    >
                                        Select
                                    </button>
                                </div>
                            ))
                        }
                    </div>
                }
                {
                    selEmp &&
                    <KpiDataTable emp={selEmp} />
                }
            </div>


        </>
    )
}

export default KpiDataEmployees;