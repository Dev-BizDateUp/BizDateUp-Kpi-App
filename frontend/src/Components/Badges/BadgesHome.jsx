import React, { useState } from "react";
import BadgeCard from "./BadgesCard";
import approved_badges from "../../assets/Badges/approved-badges.png";
import badge_goal from "../../assets/Badges/badge-goal.png";
import remainig_badges from "../../assets/Badges/remaining-badges.png";
import badges_received from "../../assets/Badges/badges_recevied.png";
import Table from "../../Components/Table/Table.jsx";
import ShineBadgeTable from "./BadgesTable.jsx";
const BadgesHome = () => {

    const [searchWord, setChangeWord] = useState("")
  
  return (
    <>
      <div className="grid grid-cols-4 gap-3">
        <BadgeCard 
        given={1} 
        total={3} 
        title="Shine Badges Given This Month" 
        month="September" 
        img ={badge_goal}
      />
       <BadgeCard 
        given={1} 
        total={3} 
        title="Shine Badges Given This Month" 
        month="September" 
      /> <BadgeCard 
        given={1} 
        total={3} 
        title="Shine Badges Given This Month" 
        month="September" 
      /> <BadgeCard 
        given={1} 
        total={3} 
        title="Shine Badges Given This Month" 
        month="September" 
      />
      
      </div>
      <div className="table">
    <ShineBadgeTable/>
      </div>
    </>
  );
};

export default BadgesHome;
