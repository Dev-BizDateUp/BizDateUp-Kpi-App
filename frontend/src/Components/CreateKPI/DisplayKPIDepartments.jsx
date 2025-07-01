import React, { useContext, useEffect, useState } from "react";
import ErrorBox from "../ErrorBox";
import { getDepartments } from "../../Api/Endpoints/endpoints";
import Spinner from "../Spinner";
import { Link } from "react-router-dom";
import { useAppContext } from '../Context/Context'
function DisplayKPIDepartments({ onSelectDept, searchWord }) {

    // const [depts, setDepts] = useState([])
    const { dept, setdept } = useAppContext();
    // const { depts } = useAppContext();


    useEffect(() => {
        // const fetchDept = async () => {
        //     const response = await getDepartments()
        //     // console.log(`departments ${response}`);
        //     setDepts(response)
        // }
        // fetchDept()
    }, [])

    function search(d) {
        return d.name.toUpperCase().includes(searchWord.toUpperCase());
    }

    return (
        <>
            <div
                className="flex flex-row flex-wrap"
            >
                {
                    dept.length <= 0 &&
                    <div className="flex flex-row w-full justify-center">
                        <Spinner />
                    </div>
                }
                {
                    dept.length > 0 &&
                    dept.filter(search).map((dep, index) => (
                        <>
                            <div
                                className="bg-[#312F52] rounded-xl m-3 flex flex-col gap-2 flex-wrap p-9 px-11"
                            >
                                <div className="text-white text-3xl text-center">
                                    {dep.name}
                                </div>
                                <Link
                                    className="text-lg text-white hover:text-[#312F52] border-1 border-white hover:shadow-lg hover:bg-white rounded-lg px-6 py-1 hover:cursor-pointer"
                                    // onClick={_ => onSelectDept({ name: dep.name, id: dep.id })}
                                    to={'' + dep.id}
                                >
                                    Select
                                </Link>
                            </div>
                        </>
                    ))
                }
            </div>
        </>
    )
}

export default DisplayKPIDepartments;