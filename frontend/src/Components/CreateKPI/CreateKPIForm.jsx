// import { functionsIn } from "lodash";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import FormInput from "../Forms/FormInput";
import FormDropdown from "../Forms/FormDropdown";
import { createKPI, getDesignation, getKPIFreq, getKPIsForDesg } from "../../Api/Endpoints/endpoints";
import FormRadioGroup from "../Forms/FormRadioGroup";
import FormYesNo from "../Forms/FormyesNo";
import { toast } from "react-toastify";
import { GetterContext } from "../Context/NewContext";
import { GoTriangleDown } from "react-icons/go";

function CreateKPIForm({ modalSet }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [kpiFreq, setKPIFreq] = useState([]);
    // const [desg, setDesg] = useState([]);
    const { designations } = useContext(GetterContext)
    const [rag, setRag] = useState(false);
    const [kpi_taget_value, setKpiTargetValue] = useState('');
    const [thresh, setThresh] = useState(false);

    useEffect(_ => {
        async function getkpifreq() {
            const response = await getKPIFreq()
            // console.log(response);
            setKPIFreq(response)
        }
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
                designation_id
            } = data;
            const formData = {
                title,
                description,
                frequency_id: parseInt(frequency_id),
                target: target ? parseFloat(target) : null,
                yellow_threshold: target ? parseFloat(yellow_threshold) : null,
                green_threshold: target ? parseFloat(green_threshold) : null,
                designation_id: parseInt(designation_id),
                value_type: target ? 'num' : 'bool'
            };
            // console.log("Executing");
            const kpis = await getKPIsForDesg(designation_id);

            for (let i = 0; i < kpis.length; i++) {
                const k = kpis[i];
                if (k.title.trim() === title.trim()) {
                    toast.error("A KPI with that title already exists!");
                    return;
                }
            }

            const resp = await createKPI(formData);
            if (resp) {
                toast.success("Created KPI!")
            }
            modalSet();
            console.log("Done with submit function")

        } catch (ex) {
            toast.error(`Could not create a kpi: ${ex}`);
        }

    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div
                    className="flex flex-col overflow-y-auto max-h-[80vh] "
                >
                    {/* <FormInput register={register} required={true} form_name={"kpi_title"} hint='KPI title' defaultText="" onChangeText={_ => { }} /> */}
                    <label>
                        KPI Title
                    </label>
                    <input
                        type="text"
                        {...register('title', { required: true })}
                        placeholder='KPI title'
                        className='px-3 py-2 m-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    />
                    <label>
                        KPI Description
                    </label>
                    <input
                        type="text"
                        {...register('description', { required: true })}
                        placeholder='KPI Description'
                        className='px-3 py-2 m-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    />
                    {/* <FormInput hint='KPI description' defaultText="" onChangeText={_ => { }} /> */}
                    {
                        kpiFreq.length > 0 &&
                        // <FormDropdown defaultValue={1} placeholder='KPI Frequency' options={kpiFreq} />
                        <>
                            <label>
                                KPI Frequency
                            </label>
                            <select
                                defaultValue={kpiFreq[0].id}
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
                        designations.length > 0 &&
                        // <FormDropdown defaultValue={1} placeholder='Designation' options={desg} />
                        <>
                            <label>
                                KPI Designation
                            </label>
                            <select
                                defaultValue={designations[0].id}
                                {...register('designation_id', { required: true })}
                                className="px-3 m-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                {designations.map((opt, index) => (
                                    <option key={index} value={opt.id}>
                                        {opt.name}
                                    </option>
                                ))}
                            </select>
                        </>
                    }
                    <div
                        onClick={_ => { setRag(!rag); setKpiTargetValue(''); setThresh(false); }}
                        className="flex flex-row bg-[#312F54] p-2 rounded  justify-between hover:cursor-pointer"
                    >
                        <span className="text-white">More Options</span>
                        {/* <img className={(<GoTriangleDown /> ? "rot  ate-180" : "") + " transition-all duration-200"} /> */}
                        <GoTriangleDown className="text-white mt-1 text-[20px]" />
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
                                {...register('target', { required: false })}
                                value={kpi_taget_value}
                                onChange={e => setKpiTargetValue(e.target.value)}
                                placeholder='KPI Target (Leave empty if kpi is yes/no type)'
                                className='px-3 py-2 m-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            />
                            {
                                kpi_taget_value.trim() != '' &&
                                <FormYesNo label={'Do you want to set threshold?'} defaultValue={false} onChangeValue={x => setThresh(x)} name={'threashold'} />
                            }
                            {
                                (thresh && kpi_taget_value.trim() != '') &&
                                <>
                                    <span className="my-2">Rag Threashold</span>
                                    <div className="flex flex-col justify-center w-[80%] m-3">
                                        <div className="flex flex-row justify-evenly">
                                            <div>
                                                <input
                                                    {...register('yellow_threshold', { required: true })}
                                                    type="number"
                                                    placeholder="percentage"
                                                    className="w-30 p-1 rounded"
                                                />%
                                            </div>
                                            <div>
                                                <input
                                                    {...register('green_threshold', { required: true })}
                                                    type="number"
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

        </>
    )
}

export default CreateKPIForm;