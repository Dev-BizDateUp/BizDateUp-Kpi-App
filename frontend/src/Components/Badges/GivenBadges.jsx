import React, { useContext, useEffect, useState } from "react";
import { GetterContext } from "../Context/NewContext";
import BadgesModal from "./BadgesModal";
import { get_all_badges_for_particular_emp } from "../../Api/Endpoints/BadgesEndpoints.js/endpoint";
import Loader_Animation from "../Loader_Animation/Loader_Animation";
import Spinner from "../Spinner";

const GivenBadges = () => {
  const { empallbadges } = useContext(GetterContext);
  const [modal, setmodal] = useState(false)
  const [badges, setbadge] = useState(null)
  const [value, setvalue] = useState([])
  const [loading, setloading] = useState(false)
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
        setloading(true)
        setvalue(data.result.data)
        setloading(false)

      } catch (e) {
        console.log(e);
      }
    };
    fetchbadges()
  }, [userData?.id])
  if (loading) {
    console.log("loading");
    <Spinner />
    return
  }
  return (
    <>
      {value.length === 0 ? (
        <>
          <p className="text-4xl text-center text-red-600 font-bold w-full ">No Badges Yet</p>

        </>
      ) : (
        <>
          <div className="grid xl:grid-cols-4 grid-cols-1  gap-5">
            {value?.map((badge, index) => (
              <div key={index + 1}
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

          </div>
        </>
      )}
      {
        modal ? <BadgesModal badge={badges} closeModal={closeModal} /> : null
      }
    </>
  );
};

export default GivenBadges;
