import React, { useContext, useEffect, useState } from "react";
import ErrorBox from "../ErrorBox";
import { getDepartments } from "../../Api/Endpoints/endpoints";
import Spinner from "../Spinner";
import { Link } from "react-router-dom";
import { useAppContext } from '../Context/Context'
import { GetterContext } from "../Context/NewContext";
function DisplayKPIDepartments({ onSelectDept, searchWord }) {

    // const [depts, setDepts] = useState([])
    const { departments } = useContext(GetterContext)
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
                className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-4 sm:grid-cols-1 md:grid-cols-1"
            >
                {
                    departments.length <= 0 &&
                    <div className="flex flex-row w-full justify-center">
                        <Spinner />
                    </div>
                }
                {
                    departments.filter(search).map((dep, index) => (
                        <Link
                            key={index}
                            className="bg-[#312F52] rounded-xl m-3 flex flex-col gap-2 flex-wrap p-9 px-11 hover:scale-105 transition-transform duration-200 cursor-pointer text-decoration-none"
                            to={'' + dep.id}
                        >
                            <div className="text-white text-3xl text-center">
                                {dep.name}
                            </div>
                            <span
                                className="text-lg text-center text-white hover:text-[#312F52] border-1 border-white hover:shadow-lg hover:bg-white rounded-lg px-6 py-1"
                            >
                                Select
                            </span>
                        </Link>
                    ))
                }
            </div>
        </>
    )
}

export default DisplayKPIDepartments;