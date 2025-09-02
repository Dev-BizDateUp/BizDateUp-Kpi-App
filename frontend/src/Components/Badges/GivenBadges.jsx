import React, { useContext, useState } from "react";
import { GetterContext } from "../Context/NewContext";
import BadgesModal from "./BadgesModal";

const GivenBadges = () => {
  const { empallbadges } = useContext(GetterContext);
  const [modal, setmodal] = useState(false)
  const [badges, setbadge] = useState(null)
  const openModal = (badge) => {
    setbadge(badge)
    setmodal(true)
  }
  const closeModal = () => {
    setmodal(false)
  }
  
  return (
    <>
      <div className="grid grid-cols-4 gap-5">
        {empallbadges?.length === 0 ? (
          <><p>No Badges Yet</p></>
        ) : (
          <>
            {empallbadges?.map((badge, index) => (
              <div
                className="badge-card relative bg-[#687FE5]  rounded-xl pt-8 pb-5"
                style={{
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                }}
              >
                <div className="flex flex-col justify-between items-center gap-5">
                  <p className="text-white text-2xl font-bold">{badge.employees_badges_receiver_idToemployees.name}</p>
                  <p className="text-white text-lg text-center" style={{
                    width: "150px",         // limit container width
                    whiteSpace: "nowrap",   // keep text in one line
                    overflow: "hidden",     // hide extra text
                    textOverflow: "ellipsis" // show "..."
                  }}>{badge.comment}</p>
                  <button onClick={() => openModal(badge)} className="text-black bg-white p-2 font-bold text-xl w-[100px] cursor-pointer rounded-xl">
                    View
                  </button>
                </div>
                <div className="absolute top-0 right-0 bg-[#FDFFAB] text-xl px-5 font-semibold rounded">
                  {badge.status}
                </div>
              </div>

            ))}

          </>
        )}
      </div>
      {
        modal ? <BadgesModal badge={badges} closeModal={closeModal} /> : null
      }
    </>
  );
};

export default GivenBadges;
