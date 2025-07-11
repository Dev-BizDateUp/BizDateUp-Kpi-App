import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useForm } from "react-hook-form"
import { useParams } from 'react-router-dom';
import { updateEmployeeTarget } from '../../Api/Endpoints/endpoints';

const EditKpiTargetModal = ({ rowdata }) => {
    const { emp_id } = useParams()
  const kpi_id = rowdata.id
    const int = parseInt(emp_id)
    const { register, handleSubmit, setValue } = useForm({
        defaultValues: {
            employee_id:int,
            target: rowdata.target,
            kpi_id:kpi_id
        },
    })
    useEffect(() => {
        if (rowdata && rowdata.target !== undefined) {
            setValue("target", rowdata.target);
        }
    }, [rowdata, setValue,]);
    const onSubmit = async(data) => {
    const response = await updateEmployeeTarget(kpi_id,data)
    if (response){
        console.log(response);
        
    }
    else{
        console.log("Something Went Wrong From Frontend");
        
    }
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className='mt-50 '>
                <p>Emp Id {emp_id}</p>
                <input {...register("target")} />
                <input type="submit" />
            </form>


        </>
    )
}

export default EditKpiTargetModal
