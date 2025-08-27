import React from "react";
// import { Target } from "lucide-react"; 

const BadgeCard = ({ given, total, title, month,img }) => {
  return (
    <div className="bg-[#687FE5] text-white border border-[#000] rounded-lg p-4 flex items-center shadow-md gap-5">
      {/* Icon */}
      <div className="">
       <img src={img} className="w-[80px]" alt="" />
      </div>

      {/* Content */}
      <div>
        <p className="text-lg font-bold">
          {given} / {total}
        </p>
        <p className="text-lg font-semibold">
          {title} ({month})
        </p>
      </div>
    </div>
  );
};

export default BadgeCard;
