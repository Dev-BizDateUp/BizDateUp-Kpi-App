<<<<<<< HEAD
import React, { useContext, useState } from "react";
=======
import React, { useContext, useEffect, useState } from "react";
>>>>>>> bb2aa8c7ba85051fa54582fb2dae42ba82ca07cd
import { GetterContext } from "../Context/NewContext";
import BadgesModal from "./BadgesModal";
import { get_all_badges_for_particular_emp } from "../../Api/Endpoints/BadgesEndpoints.js/endpoint";
import Loader_Animation from "../Loader_Animation/Loader_Animation";
import Spinner from "../Spinner";

const GivenBadges = () => {
  const { empallbadges } = useContext(GetterContext);
<<<<<<< HEAD
  const [selectedBadge, setSelectedBadge] = useState(null);

  const handleOpenModal = (badge) => {
    setSelectedBadge(badge);
  };

  const handleCloseModal = () => {
    setSelectedBadge(null);
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-5">
        {empallbadges?.length === 0 ? (
          <p>No Badges Yet</p>
        ) : (
          <>
            {empallbadges?.map((badge, index) => (
              <div
                key={index}
                className="badge-card relative bg-[#687FE5] rounded-xl pt-8 pb-5"
=======
  const [modal, setmodal] = useState(false)
  const [badges, setbadge] = useState(null)
  const [value, setvalue] = useState([])
  const { userData } = useContext(GetterContext);
  const openModal = (badge) => {
    setbadge(badge)
    setmodal(true)
  }
  const closeModal = () => {
    setmodal(false)
  }
  useEffect(() => {
    const fetchbadges = async () => {
      try {
        const data = await get_all_badges_for_particular_emp(userData?.id);
        setvalue(data.result.data)
      } catch (e) {
        console.log(e);
      }
    };
    fetchbadges()
  }, [userData?.id])

  return (
    <>
      {value?.length === 0 ? (
        <>
          <p className="text-4xl text-center text-red-600 font-bold w-full ">No Badges Yet</p>
         <Spinner/>

        </>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-5">
            {value?.map((badge, index) => (
              <div key={index + 1}
                className="badge-card relative bg-[#687FE5]  rounded-xl pt-8 pb-5"
>>>>>>> bb2aa8c7ba85051fa54582fb2dae42ba82ca07cd
                style={{
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                }}
              >
                <div className="flex flex-col justify-between items-center gap-5">
<<<<<<< HEAD
                  <p className="text-white text-2xl font-bold">
                    {badge.employees_badges_receiver_idToemployees.name}
                  </p>
                  <p
                    className="text-white text-lg text-center"
                    style={{
                      width: "150px", // limit container width
                      whiteSpace: "nowrap", // keep text in one line
                      overflow: "hidden", // hide extra text
                      textOverflow: "ellipsis", // show "..."
                    }}
                  >
                    {badge.comment}
                  </p>
                  <button
                    onClick={() => handleOpenModal(badge)}
                    className="text-black bg-white p-2 font-bold text-xl w-[100px] cursor-pointer rounded-xl"
                  >
=======
                  <p className="text-white text-2xl font-bold">{badge.employees_badges_receiver_idToemployees.name}</p>
                  <p className="text-white text-lg text-center" style={{
                    width: "150px",         // limit container width
                    whiteSpace: "nowrap",   // keep text in one line
                    overflow: "hidden",     // hide extra text
                    textOverflow: "ellipsis" // show "..."
                  }}>{badge.comment}</p>
                  <button onClick={() => openModal(badge)} className="text-black bg-white p-2 font-bold text-xl w-[100px] cursor-pointer rounded-xl">
>>>>>>> bb2aa8c7ba85051fa54582fb2dae42ba82ca07cd
                    View
                  </button>
                </div>
                <div className="absolute top-0 right-0 bg-[#FDFFAB] text-xl px-5 font-semibold rounded">
                  {badge.status}
                </div>
              </div>

            ))}
<<<<<<< HEAD
          </>
        )}
      </div>

      {/* Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-[#05050580] bg-opacity-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-[400px] p-6 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-5 right-5 cursor-pointer text-gray-600 hover:text-black text-4xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-[#312F54]">
              Badge Details
            </h2>
            <p className="mb-2 pb-4 mt-3">
              <span className="font-semibold bg-[#F7F7F7] text-black text-xl px-3 py-3 rounded-xl">
                Receiver:{" "}
              </span>
              <span className="text-xl mx-3">
                {selectedBadge.employees_badges_receiver_idToemployees.name}
              </span>
            </p>
            <p className="mb-2 pb-4  mt-3">
              <span className="font-semibold bg-[#F7F7F7] text-black text-xl px-3 py-3 rounded-xl">
                Comment:{" "}
              </span>
              <span className="text-xl mx-3"> {selectedBadge.comment}</span>
            </p>
            <p className="mb-2 pb-4  mt-3">
              <span className="font-semibold bg-[#F7F7F7] text-black text-xl px-3 py-3 rounded-xl">
                Status:{" "}
              </span>
              <span className="text-xl mx-3"> {selectedBadge.status}</span>
            </p>
          </div>
        </div>
      )}
=======

          </div>
        </>
      )}
      {
        modal ? <BadgesModal badge={badges} closeModal={closeModal} /> : null
      }
>>>>>>> bb2aa8c7ba85051fa54582fb2dae42ba82ca07cd
    </>
  );
};

export default GivenBadges;
