import React, { useEffect, useState } from "react";
import ErrorBox from "../ErrorBox";
import { getDepartments } from "../../Api/Endpoints/endpoints";

function DisplayKPIDepartments({ onSelectDept, searchWord }) {

    const [depts, setDepts] = useState([])
    // const { depts } = useAppContext();


    useEffect(() => {
        const fetchDept = async () => {
            const response = await getDepartments()
            // console.log(`departments ${response}`);
            setDepts(response)
        }
        fetchDept()
    }, [])

    function search(dept) {
        return dept.name.toUpperCase().includes(searchWord.toUpperCase());
    }

    return (
        <>
            <div
                className="flex flex-row flex-wrap"
            >
                {
                    depts.length <= 0 &&
                    <ErrorBox>
                        No Departments found :(
                    </ErrorBox>
                }

                {
                    depts.length > 0 &&
                    depts.filter(search).map((dep, index) => (
                        <>
                            <div
                                className="bg-[#312F52] rounded-xl m-3 flex flex-col gap-2 flex-wrap p-9 px-11"
                            >
                                <div className="text-white text-3xl text-center">
                                    {dep.name}
                                </div>
                                <button
                                    className="text-lg text-white hover:text-[#312F52] border-1 border-white hover:shadow-lg hover:bg-white rounded-lg px-6 py-1 hover:cursor-pointer"
                                    onClick={_ => onSelectDept({ name: dep.name, id: dep.id })}
                                >
                                    Select
                                </button>
                            </div>
                        </>
                    ))
                }
            </div>
        </>
    )
}

export default DisplayKPIDepartments;