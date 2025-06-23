import React from 'react'
import { useParams } from 'react-router-dom';
import { useAppContext } from '../Context/Context';

const Employee_Part = () => {

const { name } = useParams();
const {employees} = useAppContext()
const filteredEmployee = employees.filter((e) => e.name === name);
console.log(filteredEmployee);
  return (
<>
<div className="grid grid-cols-1 gap-8 p-6">
  {filteredEmployee.map((emp, empIndex) => {
    const fields = [
      {
        label: "Name",
        show:true,
        value: emp.name,
        image: emp.image || "https://i.pravatar.cc/150?img=12",
      },
      {
        label: "Department",
        value: emp.department,
        show:true,
        image: "https://img.icons8.com/ios-filled/50/group.png",
      },
      {
        label: "Designation",
        show:true,
        value: emp.designation,
        image: "https://i.pravatar.cc/150?img=32",
      },
    ];

    return (
      <div
        key={empIndex}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
      >
        {fields.map((field, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-gray-100 p-4 rounded-2xl shadow-md relative"
          >
            <span className="text-lg font-medium text-black mt-4">
              {field.value}
            </span>
            <img
              src={field.image}
              alt={field.label}
              className="w-10 h-10 rounded-full object-cover mt-4"
            />
            <span className="absolute top-2 left-2 bg-[#312F52] text-white text-xs px-2 py-1 rounded">
              {
                field.show? field.label : ""
              }
            </span>
          </div>
        ))}
      </div>
    );
  })}
</div>


</>
  )
}

export default Employee_Part