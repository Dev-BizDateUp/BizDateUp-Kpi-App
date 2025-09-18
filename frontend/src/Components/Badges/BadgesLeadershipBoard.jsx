import React, { useContext } from "react";
import trophy from "../../assets/Badges/leadershipboard_trophy.png";
import { GetterContext } from "../Context/NewContext";
import badges_received from "../../assets/Badges/badges_recevied.png";

const BadgesLeadershipBoard = () => {
  const { leadershipboardbadges } = useContext(GetterContext);
  console.log(leadershipboardbadges);

  const data = [...(leadershipboardbadges || [])].sort(
    (a, b) => b.count - a.count
  );
  let currentRank = 1;
  let lastCount = data[0].count;
  data.forEach((item, index) => {
    if (item.count !== lastCount) {
      currentRank++;
      lastCount = item.count;
    }
    item.rank = currentRank;
  });
  return (
    <>
      <h1 className="flex items-center font-bold text-2xl gap-2">
        Leadership Board <img src={trophy} alt="Trophy" className="w-8 h-8" />
      </h1>

      {leadershipboardbadges.length === 0 ? (
        <>
          <h1 className="text-center text-red-500 text-4xl font-bold mt-5">
            No Badges Yet{" "}
          </h1>
        </>
      ) : (
        <>
          <table className="w-full mt-5">
            <thead>
              <tr className="bg-[#312F52] text-white">
                <th className="py-5 text-xl rounded-tl-2xl">Rank</th>
                <th className="py-5 text-xl">Name</th>
                <th className="py-5 text-xl rounded-tr-2xl">Badges Received</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr
                    key={item.id || index}
                    className={`text-center border-b
                  ${
                    index === 0
                      ? "bg-gradient-to-r from-[#10b568] via-[#ffffff] to-[#ffffff] text-black text-xl font-bold"
                      : index === 1
                      ? "bg-gradient-to-r from-[#0c8c70] via-[#ffffff] to-[#ffffff] text-black text-xl font-bold"
                      : index === 2
                      ? "bg-gradient-to-r from-[#099370] via-[#ffffff ]  to-[#ffffff]  text-black text-xl font-bold"
                      : ""
                  }`}
                  >
                    <td className="py-3 font-bold">{item.rank}</td>
                    <td className="py-3  ">{item.name} </td>
                    <td className="py-3 w-full flex items-center justify-center gap-10">
                      {item.count}{" "}
                      <span>
                        {" "}
                        <img src={badges_received} alt="" className=" h-full" />
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="py-5 text-center text-gray-500 italic"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </>
  );
};

export default BadgesLeadershipBoard;
