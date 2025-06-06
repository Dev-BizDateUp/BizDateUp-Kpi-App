import React from "react";
import ErrorBox from "../ErrorBox";

function DisplayKPIDepartments({ onSelectDept, searchWord }) {

    const depts = [
        'Hr', 'CGO', 'CFO', 'CTO', 'CEO', 'CDO', 'CAO'
    ]

    function search(dept) {
        return dept.toUpperCase().includes(searchWord.toUpperCase());
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
                    depts.filter(search).map((dep, index) => (
                        <>
                            <div
                                className="bg-[#312F52] rounded-xl m-3 flex flex-col gap-2 flex-wrap p-9 px-11"
                            >
                                <div className="text-white text-3xl">
                                    {dep}
                                </div>
                                <button
                                    className="text-lg bg-white rounded-lg px-6 py-1 hover:cursor-pointer"
                                    onClick={onSelectDept(dep)}
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