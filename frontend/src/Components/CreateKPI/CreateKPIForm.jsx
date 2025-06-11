// import { functionsIn } from "lodash";
import React, { useEffect, useState } from "react";
import FormInput from "../Forms/FormInput";
import FormDropdown from "../Forms/FormDropdown";
import { getDesignation, getKPIFreq } from "../../Api/Endpoints/endpoints";
import FormRadioGroup from "../Forms/FormRadioGroup";
import FormYesNo from "../Forms/FormyesNo";

function CreateKPIForm() {
    const [kpiFreq, setKPIFreq] = useState([]);
    const [desg, setDesg] = useState([]);
    const [rag, setRag] = useState(false);
    useEffect(_ => {
        async function getkpifreq() {
            const response = await getKPIFreq()
            // console.log(response);
            setKPIFreq(response)
        }
        async function getdesg() {
            const response = await getDesignation();
            setDesg(response);
        }
        getdesg();
        getkpifreq();
    }, []);

    return (
        <>
            <form>
                <div
                    className="flex flex-col overflow-y-auto max-h-[80vh]"
                >
                    <FormInput hint='KPI title' defaultText="" onChangeText={_ => { }} />
                    <FormInput hint='KPI description' defaultText="" onChangeText={_ => { }} />
                    {
                        kpiFreq.length > 0 &&
                        <FormDropdown defaultValue={1} placeholder='KPI Frequency' options={kpiFreq} />
                    }
                    {
                        desg.length > 0 &&
                        <FormDropdown defaultValue={1} placeholder='Designation' options={desg} />
                    }
                    <FormInput type="number" defaultText={1} hint={"Target"} onChangeText={_ => { }} />
                    <div
                        onClick={_ => setRag(!rag)}
                        className="flex flex-row bg-[#312F54] p-2 rounded max-w-[15vw] justify-between"
                    >
                        <span className="text-white">More Options</span>
                        <img className={(rag ? "" : "rotate-90") + " transition-all duration-100"} src="./triangle.svg" />
                    </div>
                    {
                        rag &&
                        <>
                            <FormYesNo label={'Do you want to set threshold?'} defaultValue={true} name={'threashold'} />
                            <span className="my-2">Rag Threashold</span>
                            <div className="flex flex-col justify-center w-[80%] m-3">
                                <div className="flex flex-row justify-evenly">
                                    <input type="number" placeholder="percentage" className="w-30 p-1 rounded" />
                                    <input type="number" placeholder="percentage" className="w-30 p-1 rounded" />
                                </div>
                                <div className="flex flex-row w-full gap-2 justify-between ">
                                    <span className="bg-red-500 w-30 h-14 rounded-lg"></span>
                                    <span className="bg-yellow-500 w-30 h-14 rounded-lg"></span>
                                    <span className="bg-green-500 w-30 h-14 rounded-lg"></span>
                                </div>

                            </div>

                        </>
                    }



                </div>
            </form>

        </>
    )
}

export default CreateKPIForm;