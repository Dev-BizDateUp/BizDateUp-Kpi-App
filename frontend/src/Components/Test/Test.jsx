import React from 'react';
import { useForm } from 'react-hook-form';

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission logic here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="firstName">First Name:</label>
        <input 
          type="text" 
          id="firstName" 
          {...register("firstName", { required: "First name is required" })} 
        />
        {errors.firstName && <span>{errors.firstName.message}</span>}
      </div>

      <div>
        <label htmlFor="lastName">Last Name:</label>
        <input type="text" id="lastName" {...register("lastName")} />
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input 
          type="email" 
          id="email" 
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address"
            }
          })} 
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}

export default MyForm;