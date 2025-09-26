import React, { useContext, useEffect, useState } from "react";
import BadgeCard from "./BadgesCard";
import approved_badges from "../../assets/Badges/approved-badges.png";
import badge_goal from "../../assets/Badges/badge-goal.png";
import remainig_badges from "../../assets/Badges/remaining-badges.png";
import badges_received from "../../assets/Badges/badges_recevied.png";
import Table from "../../Components/Table/Table.jsx";
import ShineBadgeTable from "./BadgesTable.jsx";
import { GetterContext } from "../Context/NewContext.jsx";
import { get_all_badges_for_particular_emp } from "../../Api/Endpoints/BadgesEndpoints.js/endpoint.js";
import TimeModal from "../TimeModal.jsx";
const BadgesHome = () => {
  const { userData } = useContext(GetterContext);
  const [value, setvalue] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false);

 
  useEffect(() => {
    const fetchbadges = async () => {
      try {
        const data = await get_all_badges_for_particular_emp(userData?.id);
        setvalue(data.result.data.length)
      } catch (e) {
        console.log(e);

      }
    };
    fetchbadges()
  }, [])
  const remaining_badges = 3 - value
  const { empbadges } = useContext(GetterContext)
  const data = empbadges.finduser.filter((item) => item.status === "Approved")
  const remainingbadges = empbadges.finduser.filter((item) => item.status === "Pending")
  const [pendingbadges, setpendingbadges] = useState(remainingbadges)
  const [number, setnumber] = useState(data)
  return (
    <>
      <div className="grid xl:grid-cols-4 lg:grid-cols-2 grid-cols-1  gap-3">
        <BadgeCard
          given={value}
          total={3}
          title="Shine Badges Given This Month"
          img={badge_goal}
        />
        <BadgeCard
          given={pendingbadges?.length}
          total={3}
          title="Shine Badges Approval Pending For This Month"
          img={badges_received}
        />
        <BadgeCard
          given={number.length}
          total={3}
          title=" Shine Badges Approved This Month"
          img={approved_badges}
        />
        <BadgeCard
          given={remaining_badges}
          total={3}
          title=" Shine Badges Remaining This Month"
          img={remainig_badges}
        />
      </div>
      <div className="w-full">
        <ShineBadgeTable />
      </div>
    </>
  );
};

export default BadgesHome;

