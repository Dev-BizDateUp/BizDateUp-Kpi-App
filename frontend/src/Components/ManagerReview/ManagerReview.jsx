import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ManagerReview() {
    const { rev_id } = useParams();

    return (
        <>
            {
                <div className="flex justify-center items-center h-40 text-xl text-[#2b2d5b] font-semibold">
                    Manager Review ID: {rev_id}
                </div>
            }
        </>
    );
}

export default ManagerReview;