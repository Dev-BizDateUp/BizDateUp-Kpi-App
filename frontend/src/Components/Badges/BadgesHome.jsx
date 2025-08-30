import React, { useContext, useState } from "react";
import BadgeCard from "./BadgesCard";
import approved_badges from "../../assets/Badges/approved-badges.png";
import badge_goal from "../../assets/Badges/badge-goal.png";
import remainig_badges from "../../assets/Badges/remaining-badges.png";
import badges_received from "../../assets/Badges/badges_recevied.png";
import Table from "../../Components/Table/Table.jsx";
import ShineBadgeTable from "./BadgesTable.jsx";
import { GetterContext } from "../Context/NewContext.jsx";
const BadgesHome = () => {
  const myValue = localStorage.getItem('badgecount');
  console.log(myValue);
  
  const remaining_badges = 3 - myValue
  const {empbadges} = useContext(GetterContext)
  const data = empbadges.finduser.filter((item)=> item.status === "Approved")
const [number, setnumber] = useState(data)
  return (
    <>
      <div className="grid grid-cols-4 gap-3">
        <BadgeCard
          given={myValue}
          total={3}
          title="Shine Badges Given This Month"
          img={badge_goal}
        />
        <BadgeCard
          given={myValue}
          total={3}
          title="Badges Received This Month"
          img={badges_received}
        />
        <BadgeCard
          given={number.length}
          total={3}
          title="Badges Approved This Month"
          img={approved_badges}
        />
        <BadgeCard
          given={remaining_badges}
          total={3}
          title="Badges Remaining This Month"
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

