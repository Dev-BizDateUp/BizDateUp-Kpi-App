import React, { useEffect, useState } from "react";


// Sample Data
const badgeData = [
  {
    id: 1,
    recipient: "Aalain",
    comment: "This is A Comment",
    status: "Pending",
  },
  {
    id: 2,
    recipient: "Yogesh",
    comment: "This is A Comment",
    status: "Approved",
  },
  {
    id: 3,
    recipient: "Khwaish",
    comment: "This is A Comment",
    status: "Rejected",
  },
];

const StatusBadge = ({ status }) => {

  
  const statusColors = {
    Pending: "bg-yellow-200 text-yellow-800",
    Approved: "bg-green-200 text-green-800",
    Rejected: "bg-red-200 text-red-800",
  };

  return (
    <span
      className={`px-3 py-1 rounded text-sm font-semibold ${statusColors[status]}`}
    >
      {status}
    </span>
  );
};

const ShineBadgeTable = () => {
  const [selectedBadge, setSelectedBadge] = useState(null);

  return (
    <div className="border border-blue-400 rounded-md p-4">
      <h2 className="text-sm font-bold mb-2">
        Shine Badge Given For The Month Of September
      </h2>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#1a1a3d] text-white text-left text-sm">
            <th className="p-2">Id</th>
            <th className="p-2">Recipient</th>
            <th className="p-2">Comment</th>
            <th className="p-2">Shine Badge Status</th>
            <th className="p-2">Details</th>
          </tr>
        </thead>
        <tbody>
          {badgeData.map((badge) => (
            <tr key={badge.id} className="border-b text-sm">
              <td className="p-2">{badge.id}</td>
              <td className="p-2">{badge.recipient}</td>
              <td className="p-2">{badge.comment}</td>
              <td className="p-2">
                <StatusBadge status={badge.status} />
              </td>
              <td className="p-2">
                <button
                  onClick={() => setSelectedBadge(badge)}
                  className="bg-[#1a1a3d] text-white px-4 py-1 rounded-md hover:bg-[#333366] transition"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
            <h3 className="text-lg font-bold mb-3">Badge Details</h3>
            <p>
              <strong>Recipient:</strong> {selectedBadge.recipient}
            </p>
            <p>
              <strong>Comment:</strong> {selectedBadge.comment}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <StatusBadge status={selectedBadge.status} />
            </p>

            <button
              onClick={() => setSelectedBadge(null)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShineBadgeTable;
