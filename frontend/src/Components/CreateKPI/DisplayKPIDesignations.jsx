import React, { useState, useEffect, useContext } from "react";
import { getDesignation } from "../../Api/Endpoints/endpoints";
import ErrorBox from "../ErrorBox";
import Spinner from "../Spinner";
import { Link } from "react-router-dom";
import { useAppContext } from "../Context/Context";
import { GetterContext } from "../Context/NewContext";

function DisplayKPIDesignations({ deptID, searchText, onSelectDesignation }) {
    const { designations } = useContext(GetterContext);

    const [loading, setLoading] = useState(false);

    function search(d) {
        const s = searchText.toUpperCase()
        return d.name.toUpperCase().includes(s) || d.id.toString().toUpperCase().includes(s);
    }

    useEffect(() => {
        // setLoading(true)
        // const fetchDept = async () => {
        //     const response = await getDesignation()
        //     // console.log("designations");
        //     const set = response.filter(r => r.department_id == deptID)
        //     // console.log(set)
        //     setDesg(set)
        // }
        // fetchDept().finally(() => setLoading(false));
    }, [])

    return (
        <>
            {
                loading ?
                    <Spinner />

                    :
                    <div>
                        {
                            designations.length <= 0 ?
                                <ErrorBox>
                                    No designations found :(
                                </ErrorBox>
                                :
                                <>
                                    <div className="flex flex-row flex-wrap">
                                        {
                                            designations.filter(d => d.department_id == deptID).filter(search).map((d, i) => (
                                                <>
                                                    <Link
                                                        className="bg-[#295F98] py-9 px-19 m-3 rounded-lg flex flex-col justify-center hover:scale-105 transition-transform duration-200 cursor-pointer text-decoration-none"
                                                        to={"" + d.id}
                                                    >
                                                        <div className="text-white text-3xl text-center">
                                                            {d.name}
                                                        </div>
                                                        <span
                                                            className="text-white text-lg text-center rounded border-white border-2 mt-4 px-6 hover:cursor-pointer hover:text-[#295F98] hover:bg-white hover:shadow-xlBlock"
                                                        >
                                                            Select
                                                        </span>
                                                    </Link>
                                                </>
                                            ))
                                        }
                                        {
                                            designations.filter(search).length == 0 &&
                                            <ErrorBox >
                                                Designation not found
                                            </ErrorBox>
                                        }
                                    </div>
                                </>
                        }
                    </div>
            }
        </>
    )
}

export default DisplayKPIDesignations;