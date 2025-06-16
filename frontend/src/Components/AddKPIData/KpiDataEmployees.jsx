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
                {
                    !selEmp &&
                    <div className="flex flex-row gap-4 flex-wrap">
                        {
                            emps.map(e => (
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