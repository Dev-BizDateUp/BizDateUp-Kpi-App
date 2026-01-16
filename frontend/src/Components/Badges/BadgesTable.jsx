import React, { useContext, useEffect, useState } from "react";
import { GetterContext } from "../Context/NewContext";
import { IoCloseSharp } from "react-icons/io5";
import not_to_show from "../../assets/Badges/404-image.png";
import { get_all_badges_for_particular_emp } from "../../Api/Endpoints/BadgesEndpoints.js/endpoint";
const StatusBadge = ({ status }) => {


  const statusColors = {
    Pending: "bg-[#FDFFAB] text-black",
    Approved: "bg-[#7EFF87] text-white",
    Rejected: "bg-[#FFECEE] text-red-800",
  };
  return (
    <span
      className={`px-3 py-1 rounded xl:text-lg text-[14px] font-semibold ${statusColors[status]}`}
    >
      {status}
    </span>
  );
};

const ShineBadgeTable = () => {
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [modaldata, setmodaldata] = useState();
  const { userData } = useContext(GetterContext);
  const [badges, setbadges] = useState([])
  useEffect(() => {
    const fetchbadges = async () => {
      try {
        const data =  await get_all_badges_for_particular_emp(userData?.id);
        setbadges(data.result.data)
      } catch (e) {
        // console.log(e);
        
      }
    };
    fetchbadges()
  }, [userData?.id]);

  return (
    <div className="w-full mt-5 rounded-md px-1">
      <h2 className="xl:text-2xl text-[21px] font-bold mb-2">
        Shine Badge Given For The Month
      </h2>

      {/* <div className="w-full"> */}
      {badges?.length === 0 ? (
        <>
          <div className="flex justify-center items-center">
            <img src={not_to_show} alt="" />
          </div>
        </>
      ) : (
      <div className="overflow-x-auto">
          <table className="w-full border-collapse overflow-x-scroll ">
          <thead>
            <tr className="bg-[#1a1a3d] text-white text-left text-lg font-semibold">
              <th className="p-2 xl:text-xl text-[14px]">Id</th>
              <th className="p-2 xl:text-xl text-[14px]">Recipient</th>
              <th className="p-2 xl:text-xl text-[14px]">Comment</th>
              <th className="p-2 xl:text-xl text-[14px]">Shine Badge Status</th>
              <th className="p-2 xl:text-xl text-[14px]">Details</th>
            </tr>
          </thead>
          <tbody>
            {badges?.map((badge, index) => (
              <>
                <tr key={index + 1} className="border-b text-lg">
                  <td className="p-2  text-[14px]">{badge.badge_id}</td>
                  <td className="p-2  text-[14px]">
                    {badge.employees_badges_receiver_idToemployees.name}
                  </td>
                  <td className="p-2  text-[14px]">{badge.comment}</td>
                  <td className="p-2  text-[14px]">
                    <StatusBadge status={badge.status} />
                  </td>
                  <td className="p-2  text-[14px]">
                    <button
                      onClick={() => setSelectedBadge(badge)}
                      className="bg-[#1a1a3d]  text-[14px] text-white px-4 py-1 rounded-md hover:bg-[#333366] transition cursor-pointer"
                    >
                      View
                    </button>
                  </td>
                </tr>
                {selectedBadge && (
                  <div className="fixed inset-0 bg-[#0000005b] bg-opacity-40 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-200 shadow-lg relative">
                      <div className="flex justify-between items-center">
                        <h3 className="text-[20px] text-[#312F54] font-bold mb-3">
                          Badge Details
                        </h3>
                        <IoCloseSharp
                          className="text-xl cursor-pointer"
                          onClick={() => {
                            setSelectedBadge(null);
                            // setmodaldata(badge)
                          }}
                        />
                      </div>
                      <div className="flex gap-5 items-center mb-5">
                        <p className="text-black bg-[#F7F7F7] p-2 font-semibold text-xl">
                          Receipent Name:
                        </p>{" "}
                        <span className="text-xl">
                          {
                            selectedBadge
                              ?.employees_badges_receiver_idToemployees.name
                          }
                        </span>
                      </div>
                      <div className="flex gap-5 items-center mb-5">
                        <p className="text-black bg-[#F7F7F7] p-2 font-semibold text-xl">
                          Comments:
                        </p>{" "}
                        <span className="text-xl">
                          {selectedBadge?.comment}
                        </span>
                      </div>
                      <div className="flex gap-5 items-center ">
                        <strong className="text-black bg-[#F7F7F7] p-2 font-semibold text-xl">
                          Status:
                        </strong>{" "}
                        <StatusBadge status={selectedBadge?.status} />
                      </div>
                    </div>
                  </div>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
      )}
      {/* </div> */}

      {/* Modal */}
    </div>
  );
};

export default ShineBadgeTable;
