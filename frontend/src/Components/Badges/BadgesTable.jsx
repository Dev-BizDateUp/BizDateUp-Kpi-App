import React, { useContext, useEffect, useState } from "react";
import { GetterContext } from "../Context/NewContext";
import { IoCloseSharp } from "react-icons/io5";
import not_to_show from "../../assets/Badges/404-image.png"
const StatusBadge = ({ status }) => {

  const statusColors = {
    Pending: "bg-[#FDFFAB] text-black",
    Approved: "bg-[#7EFF87] text-white",
    Rejected: "bg-[#FFECEE] text-red-800",
  };

  return (
    <span
      className={`px-3 py-1 rounded text-lg font-semibold ${statusColors[status]}`}
    >
      {status}
    </span>
  );
};

const ShineBadgeTable = () => {
  const [selectedBadge, setSelectedBadge] = useState(null);
  const { empbadges } = useContext(GetterContext)
  const [modaldata, setmodaldata] = useState()
console.log();

  return (
    <div className="w-full mt-5 rounded-md p-4">
      <h2 className="text-[25px] font-bold mb-2">
        Shine Badge Given For The Month
      </h2>

      {/* <div className="w-full"> */}
     {
      empbadges?.finduser?.length === 0 ? 
      <>
        <div className="flex justify-center items-center">
          <img src={not_to_show} alt="" />
        </div>
      </>
       :  <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#1a1a3d] text-white text-left text-lg font-semibold">
            <th className="p-2">Id</th>
            <th className="p-2">Recipient</th>
            <th className="p-2">Comment</th>
            <th className="p-2">Shine Badge Status</th>
            <th className="p-2">Details</th>
          </tr>
        </thead>
        <tbody>
          {empbadges?.finduser?.map((badge, index) => (
            <>
              <tr key={index + 1} className="border-b text-lg">
                <td className="p-2">{badge.badge_id}</td>
                <td className="p-2">{badge.employees_badges_receiver_idToemployees.name}</td>
                <td className="p-2">{badge.comment}</td>
                <td className="p-2">
                  <StatusBadge status={badge.status} />
                </td>
                <td className="p-2">
                  <button
                    onClick={() => setSelectedBadge(badge)}
                    className="bg-[#1a1a3d] text-white px-4 py-1 rounded-md hover:bg-[#333366] transition cursor-pointer"
                  >
                    View
                  </button>
                </td>
              </tr>
              {selectedBadge && (
                <div className="fixed inset-0 bg-[#0000005b] bg-opacity-40 flex items-center justify-center">
                  <div className="bg-white rounded-lg p-6 w-200 shadow-lg relative">
                    <div className="flex justify-between items-center">
                      <h3 className="text-[20px] text-[#312F54] font-bold mb-3">Badge Details</h3>
                      <IoCloseSharp className="text-xl cursor-pointer" onClick={() => {
                        setSelectedBadge(null)
                        // setmodaldata(badge)
                      }
                      } />
                    </div>
                    <div className="flex gap-5 items-center mb-5">
                      <p className="text-black bg-[#F7F7F7] p-2 font-semibold text-xl" >Receipent Name:</p> <span className="text-xl">{selectedBadge?.employees_badges_receiver_idToemployees.name}</span>
                    </div>
                    <div className="flex gap-5 items-center mb-5">
                      <p className="text-black bg-[#F7F7F7] p-2 font-semibold text-xl" >Comments:</p> <span className="text-xl">{selectedBadge?.comment}</span>
                    </div>
                    <div className="flex gap-5 items-center ">
                      <strong className="text-black bg-[#F7F7F7] p-2 font-semibold text-xl">Status:</strong>               <StatusBadge status={selectedBadge?.status} />

                    </div>
                  </div>
                </div>
              )}
            </>
          ))}
        </tbody>
      </table>
     }
      {/* </div> */}

      {/* Modal */}

    </div>
  );
};

export default ShineBadgeTable;
