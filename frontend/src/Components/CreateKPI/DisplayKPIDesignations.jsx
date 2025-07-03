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
        //     console.log("designations");
        //     const set = response.filter(r => r.department_id == deptID)
        //     console.log(set)
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
                                            designations.filter(search).map((d, i) => (
                                                <>
                                                    <div className="aspect-[153/105] bg-[#295F98] py-9 px-19 m-3 rounded-lg flex flex-col justify-center">
                                                        <div className="text-white text-3xl">
                                                            {d.name}
                                                        </div>
                                                        <Link
                                                            className="text-white text-lg rounded border-white border-2 mt-4 px-6 hover:cursor-pointer hover:text-[#295F98] hover:bg-white hover:shadow-xl"
                                                            to={"" + d.id}
                                                        >
                                                            Select
                                                        </Link>
                                                    </div>
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