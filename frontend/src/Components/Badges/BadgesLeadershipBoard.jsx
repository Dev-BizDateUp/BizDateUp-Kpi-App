import React, { useContext } from "react";
import trophy from "../../assets/Badges/leadershipboard_trophy.png";
import { GetterContext } from "../Context/NewContext";

const BadgesLeadershipBoard = () => {
  const { leadershipboardbadges } = useContext(GetterContext);
console.log(leadershipboardbadges);

  // Clone and sort so original data isn't mutated
  const data = [...(leadershipboardbadges || [])].sort(
    (a, b) => b.count - a.count
  );

  return (
    <>
      <h1 className="flex items-center font-bold text-2xl gap-2">
        Leadership Board <img src={trophy} alt="Trophy" className="w-8 h-8" />
      </h1>

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
              <tr key={item.id || index} className="text-center border-b">
                <td className="py-3 font-bold">{index + 1}</td>
                <td className="py-3">{item.name}</td>
                <td className="py-3">{item.count}</td>
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
  );
};

export default BadgesLeadershipBoard;
