import React, { useState, useEffect } from "react";
import { getDesignation } from "../../Api/Endpoints/endpoints";
import ErrorBox from "../ErrorBox";

function DisplayKPIDesignations({ deptID, onSelectDesignation }) {
    const [desg, setDesg] = useState([]);

    useEffect(() => {
        const fetchDept = async () => {
            const response = await getDesignation()
            console.log("designations");
            const set = response.filter(r => r.department_id == deptID)
            console.log(set)
            setDesg(set)
        }
        fetchDept()
    }, [])

    return (
        <>
            <div>
                {
                    desg.length <= 0 ?
                        <ErrorBox>
                            No designations found :(
                        </ErrorBox>
                        :
                        <>
                            <div className="flex flex-row flex-wrap">
                                {
                                    desg.map((d, i) => (
                                        <>
                                            <div className="aspect-[153/105] bg-[#295F98] py-9 px-19 m-3 rounded-lg flex flex-col justify-center">
                                                <div className="text-white text-3xl">
                                                    {d.name}
                                                </div>
                                                <button
                                                    className="text-white text-lg rounded border-white border-2 mt-4 px-6 hover:cursor-pointer hover:text-[#295F98] hover:bg-white hover:shadow-xl"
                                                    onClick={_ => { onSelectDesignation({ name: d.name, id: d.id }) }}
                                                >
                                                    Select
                                                </button>
                                            </div>
                                        </>
                                    ))
                                }
                            </div>
                        </>
                }
            </div>
        </>
    )
}

export default DisplayKPIDesignations;