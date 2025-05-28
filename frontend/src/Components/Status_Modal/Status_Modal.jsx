import React, { useState } from 'react'
import { useForm } from "react-hook-form";
const Status_Modal = ({emp_status, modal}) => {
     const { register, handleSubmit, watch, formState: { errors } } = useForm();
     const onSubmit = data => console.log(data);
    // const [modal, setmodal] = useState(false)
  return (
 <>
 <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" >
          &times;
        </button>

        <h3 className="modal-title">
          Are You Sure Want To In Active This Employee?
        </h3>

        <img
          className="modal-avatar"
          src="https://cdn3d.iconscout.com/3d/premium/thumb/businessman-5645773-4695432.png"
          alt="employee"
        />

        <div className="modal-actions">
         <form onSubmit={handleSubmit(onSubmit)}>
      {/* <input defaultValue="test" {...register("example")} />
      <input {...register("exampleRequired", { required: true })} />
      {errors.exampleRequired && <span>This field is required</span>}
      <input type="submit" /> */}
    </form>
        </div>
      </div>
    </div>
 
 </>
  )
}

export default Status_Modal