import React from "react";
import { Link, useParams } from "react-router-dom";
import { useAppContext } from "../Context/Context";
import SearchBar from "../SearchBar/SearchBar";

const Department_Part = () => {
  const { deptid } = useParams();
  const { departments } = useAppContext();

  const filteredDepartments = departments.filter((d) => d.dept_name === deptid);
console.log(departments);

  return (
    <>
        <SearchBar title_text="Select Designation For Dashboard "  />
      {filteredDepartments.length === 0 || filteredDepartments[0].designations.length === 0 ? (
        <p className="text-center text-red-700 mt-30 text-3xl">
          There is No Department For This
        </p>
      ) : (
        filteredDepartments.map((item, index) => (
          <React.Fragment key={index}>
           <Link to ={`/dashboard/departments/${item.dept_name}/emp`} className="flex flex-col ">
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-7">
  {item.designations.map((designation, idx) => (
    <div
      key={idx}
      className="flex flex-col p-7 bg-[#312F52] rounded-lg items-center gap-2 justify-between"
    >
      <span className="text-2xl text-white">{designation.des_name}</span>
      <button className="px-4 text-black bg-white rounded text-lg hover:cursor-pointer">
        Select
      </button>
    </div>
  ))}
</div>

           </Link>
          </React.Fragment>
        ))
      )}
    </>
  );
};

export default Department_Part;
