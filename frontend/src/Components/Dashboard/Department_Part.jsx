import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppContext } from "../Context/Context";
import SearchBar from "../SearchBar/SearchBar";
import { AuthContext, GetterContext } from "../Context/NewContext";

const Department_Part = () => {
  const { deptid } = useParams();
  const { departments } = useAppContext();
  const { myRole, employees, departments: realDepts, designations } = useContext(GetterContext);
  const { userData } = useContext(AuthContext);
  const [filteredDepartments, setFilter] = useState(departments.filter((d) => d.dept_name === deptid));

  // useEffect(() => {
  //   console.log("filtered departments ", filteredDepartments)
  // }, [])
  useEffect(() => {
    console.log(designations);
    console.log(filteredDepartments);
    console.log(
      filteredDepartments.filter(
        f =>
          designations.find(
            d =>
              employees.find(
                e =>
                  e.id == userData.id
              )?.designation_id == d.id
          )

      )
    );

    if (userData && employees && myRole) {
      if (myRole.power < 20) {
        setFilter([
          departments.find(
            d =>
              d.dept_name ==
              realDepts.find(
                d => d.id == employees.find(e => e.id == userData.id)?.department_id
              )?.name
          )
        ])
      }
    }
  }, [userData])

  return (
    <>
      <SearchBar title_text="Select Designation For Dashboard " />
      {
        filteredDepartments && filteredDepartments.length === 0 || filteredDepartments[0].designations.length === 0 ? (
          <p className="text-center text-red-700 mt-30 text-3xl">
            There is No Department For This
          </p>
        ) : (
          filteredDepartments.map((item, index) => (
            <React.Fragment key={index}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-7">
                {item.designations.filter(
                  d =>
                    myRole.power < 20 ?
                      designations.find(
                        d => d.id == employees.find(
                          e => e.id == userData.id
                        )?.designation_id
                      )?.name == d.des_name :
                      true
                ).map((designation, idx) => (
                  <Link to={`/dashboard/departments/${designation.des_name}/emp`} className="flex flex-col ">
                    <div
                      key={idx}
                      className="flex flex-col p-7 bg-[#312F52] rounded-lg items-center gap-2 justify-between"
                    >
                      <span className="text-2xl text-white">{designation.des_name}</span>
                      <button className="px-4 text-black bg-white rounded text-lg hover:cursor-pointer">
                        Select
                      </button>
                    </div>
                  </Link>
                ))}
              </div>

            </React.Fragment>
          ))
        )}
    </>
  );
};

export default Department_Part;
