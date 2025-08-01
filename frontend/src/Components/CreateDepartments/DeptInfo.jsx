import { useEffect, useState } from "react";
import {
  getDepartmentDetails,
  getEmployees,
} from "../../Api/Endpoints/endpoints";

function DeptInfo({ know }) {
  const [emps, setEmp] = useState([]);
  const [des, setDes] = useState([]);
  useEffect((_) => {
    async function getInfo() {
      const details = await getDepartmentDetails(know.name);
      if (details.success) {
        setDes(details.data.designations);
        setEmp(details.data.employees);
      }
    }
    getInfo();
  }, []);

  return (
    <>
      <div className="flex flex-col max-h-[80vh] overflow-y-auto">
        <div className=" p-2 rounded m-2 flex flex-col">
          <div className="flex flex-row justify-between ">
            <span className="text-2xl text-[#312F54]">Designations</span>
          </div>
          <div className="flex flex-col justify-between  p-2 rounded m-2 max-h-[20vh] overflow-y-auto">
            {des.length === 0? (<>
            <p>No Designations Yet!</p>
            </>)
            :
            des.map((item, idx) => (
              <>
                <div className="my-1">
                  {idx + 1}) {item.name}
                </div>
              </>
            ))
            }
          </div>
        </div>

        <div className=" p-2 rounded m-2 flex flex-col">
          <div className="flex flex-row justify-between ">
            <span className="text-2xl text-[#312F54]">Employees</span>
          </div>
          <div className="flex flex-col justify-between  p-2 rounded m-2 max-h-[20vh] overflow-y-auto">
            {
                emps.length === 0 ? (
                    <>
                    <p>No Employees Yet!</p>
                    </>
                ):
                (
                    emps?.map((item, idx) => (
              <>
                <div className="my-1">
                  {idx + 1}) {item.name}
                </div>
              </>
            ))
                )
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default DeptInfo;
