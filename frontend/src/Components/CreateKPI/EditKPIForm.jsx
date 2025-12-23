// import { functionsIn } from "lodash";
import React, { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import FormInput from "../Forms/FormInput";
import FormDropdown from "../Forms/FormDropdown";
import { createKPI, editKPI, getDesignation, getKPIFreq, getKPIID, getKPIsForDesg } from "../../Api/Endpoints/endpoints";
import FormRadioGroup from "../Forms/FormRadioGroup";
import FormYesNo from "../Forms/FormyesNo";
import { toast } from "react-toastify";

function EditKPIForm({ modalSet, kpiID }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [kpiFreq, setKPIFreq] = useState([]);
    const [desg, setDesg] = useState([]);
    const [rag, setRag] = useState(false);
    // const [kpi_taget_value, setKpiTargetValue] = useState('');
    const [thresh, setThresh] = useState(false);

    const [kpiInfo, setKpiInfo] = useState(null);

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
        (async () => {
            const kpi = await getKPIID(kpiID);
            if (kpi.data) {
                setKpiInfo(kpi.data);
                console.log(`KPI has a target? ${kpi.data.target != null}`)
                setRag(kpi.data.target != null);
                setThresh(kpi.data.green_threshold != null);
                // setKpiTargetValue(kpi.target + "")
                console.log(kpi.data);
            }
        })();
        getdesg();
        getkpifreq();
    }, []);

    const onSubmit = async data => {
        try {
            let {
                title,
                description,
                frequency_id,
                target,
                yellow_threshold,
                green_threshold,
                have_threshold,
                designation_id,
                is_active
            } = data;
            const formData = {
                id: kpiID,
                title,
                description,
                frequency_id: parseInt(frequency_id),
                target: target ? parseFloat(target) : null,
                yellow_threshold: target ? parseFloat(yellow_threshold) : null,
                green_threshold: target ? parseFloat(green_threshold) : null,
                designation_id: parseInt(designation_id),
                value_type: target ? 'num' : 'bool',
                is_active:is_active==="true"?true:false 
            };
            console.log(formData);
            
            const resp = await editKPI(formData);
            
            if (resp) {
                toast.success("Eddited KPI!")
            }
            modalSet();
            // console.log("Done with submit function")

        } catch (ex) {
            toast.error(`Could not create a kpi: ${ex}`);
        }

    }

    return (
        <>{
            kpiInfo &&
            <form onSubmit={handleSubmit(onSubmit)}>
                <div
                    className="flex flex-col overflow-y-auto max-h-[80vh]"
                >
                    {/* <FormInput register={register} required={true} form_name={"kpi_title"} hint='KPI title' defaultText="" onChangeText={_ => { }} /> */}
                    <label>
                        KPI Title
                    </label>
                    <input
                        type="text"
                        {...register('title', { required: true })}
                        placeholder='KPI title'
                        defaultValue={kpiInfo.title}
                        className='px-3 py-2 m-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    />
                    <label>
                        KPI Description
                    </label>
                    <input
                        type="text"
                        {...register('description', { required: true })}
                        placeholder='KPI Description'
                        defaultValue={kpiInfo.description}
                        className='px-3 py-2 m-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    />
<label>KPI Active</label>
<select
  {...register("is_active", {
    
  })}
  className="px-3 m-2 py-2 border rounded-md"
>
  <option value="true">Yes</option>
  <option value="false">No</option>
</select>





                    {/* <FormInput hint='KPI description' defaultText="" onChangeText={_ => { }} /> */}
                    {
                        kpiFreq.length > 0 &&
                        // <FormDropdown defaultValue={1} placeholder='KPI Frequency' options={kpiFreq} />
                        <>
                            <label>
                                KPI Frequency
                            </label>
                            <select
                                defaultValue={kpiInfo.frequency_id}
                                {...register('frequency_id', { required: true })}
                                className="px-3 m-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                {kpiFreq.map((opt, index) => (
                                    <option key={index} value={opt.id}>
                                        {opt.name}
                                    </option>
                                ))}
                            </select>
                        </>
                    }
                    {
                        desg.length > 0 &&
                        // <FormDropdown defaultValue={1} placeholder='Designation' options={desg} />
                        <>
                            <label>
                                KPI Designation
                            </label>
                            <select
                                defaultValue={kpiInfo.designation_id}
                                {...register('designation_id', { required: true })}
                                className="px-3 m-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                {desg.map((opt, index) => (
                                    <option key={index} value={opt.id}>
                                        {opt.name}
                                    </option>
                                ))}
                            </select>
                        </>
                    }
                    <div
                        onClick={_ => { setRag(!rag); }}
                        className="flex flex-row bg-[#312F54] p-2 rounded max-w-[15vw] justify-between hover:cursor-pointer"
                    >
                        <span className="text-white">More Options</span>
                        <img className={(rag ? "rotate-180" : "") + " transition-all duration-200"} src="./triangle.svg" />
                    </div>
                    {
                        rag &&
                        <>
                            {/* <FormInput type="number" defaultText={null} hint={"Target"} onChangeText={_ => { }} /> */}

                            <label>
                                KPI Target
                            </label>
                            <input
                                type="number"
                                defaultValue={kpiInfo.target}
                                {...register('target', { required: false })}
                                // value={kpi_taget_value}
                                // onChange={e => setKpiTargetValue(e.target.value)}
                                placeholder='KPI Target (Leave empty if kpi is yes/no type)'
                                className='px-3 py-2 m-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            />
                            {
                                kpiInfo.target != null &&
                                <FormYesNo label={'Do you want to set threshold?'} defaultValue={kpiInfo.green_threshold != null} onChangeValue={x => setThresh(x)} name={'threashold'} />
                            }
                            {
                                (thresh && kpiInfo.target != null) &&
                                <>
                                    <span className="my-2">Rag Threshold</span>
                                    <div className="flex flex-col justify-center w-[80%] m-3">
                                        <div className="flex flex-row justify-evenly">
                                            <div>
                                                <input
                                                    {...register('yellow_threshold', { required: true })}
                                                    type="number"
                                                    defaultValue={kpiInfo.yellow_threshold}
                                                    placeholder="percentage"
                                                    className="w-30 p-1 rounded"
                                                />%
                                            </div>
                                            <div>
                                                <input
                                                    {...register('green_threshold', { required: true })}
                                                    type="number"
                                                    defaultValue={kpiInfo.green_threshold}
                                                    placeholder="percentage"
                                                    className="w-30 p-1 rounded"
                                                />%
                                            </div>

                                        </div>
                                        <div className="flex flex-row w-full gap-2 justify-between ">
                                            <span className="bg-red-500 w-30 h-14 rounded-lg"></span>
                                            <span className="bg-yellow-500 w-30 h-14 rounded-lg"></span>
                                            <span className="bg-green-500 w-30 h-14 rounded-lg"></span>
                                        </div>

                                    </div>
                                </>
                            }


                        </>
                    }
                    <input type="submit" className="hover:cursor-pointer bg-[#312F54] rounded-xl text-white text-xl py-2 my-2" />
                </div>
            </form>
        }
        </>
    )
}

export default EditKPIForm;