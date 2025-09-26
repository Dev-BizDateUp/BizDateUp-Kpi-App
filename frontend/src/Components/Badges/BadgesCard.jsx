import React from "react";
// import { Target } from "lucide-react"; 


const BadgeCard = ({ given, total, title, img }) => {

  return (
    <div className="bg-[#687FE5] text-white border border-[#000] rounded-lg p-4 flex items-center shadow-md gap-5">
      {/* Icon */}
      <div className="">
        <img src={img} className="w-full" alt="" />
      </div>

      {/* Content */}
      <div>
        <p className="text-lg font-bold">
          {given} 
        </p>
        <p className="text-lg font-semibold">
          {title}
        </p>
      </div>
    </div>
  );
};

export default BadgeCard;
