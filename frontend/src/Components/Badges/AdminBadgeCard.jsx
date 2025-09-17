import React, { useContext, useState } from "react";
import { MdClose } from "react-icons/md";
import { GetterContext } from "../Context/NewContext";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

const AdminBadgeCard = ({ badge, changebadgestatus }) => {
  if (!badge) return null;

  const { myRole } = useContext(GetterContext);

  const {
    employees_badges_user_idToemployees,
    employees_badges_receiver_idToemployees,
    created_at,
    comment,
    status,
    badge_id,
  } = badge;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");

  const formattedDate = new Date(created_at).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleApprove = () => {
    const payload = {
      admin_id: myRole?.id,
      badge_id,
      status: "Approved",
      reason: "Approved by admin",
    };
    changebadgestatus(badge_id, payload);

    toast.success("Badge Approved ✅");
  };

  const handleReject = () => {
    if (!reason.trim()) {
      toast.error("Please enter a rejection reason ❌");
      return;
    }

    const payload = {
      admin_id: myRole?.id,
      badge_id,
      status: "Rejected",
      reason,
    };
    changebadgestatus(badge_id, payload);

    toast.warning("Badge Rejected ⚠️");

    setIsModalOpen(false);
    setReason("");
  };

  return (

    <>
    
       <div className="rounded-xl shadow-lg p-4 bg-[#687FE5] text-white">
        <div className="space-y-3">
          <div className="flex items-center">
            <span className="bg-white text-black font-semibold px-2 py-0.5 rounded">
              Giver Name:
            </span>
            <span className="ml-2 text-xl font-semibold">
              {employees_badges_user_idToemployees?.name}
            </span>
          </div>

          <div className="flex items-center">
            <span className="bg-white text-black font-semibold px-2 py-0.5 rounded">
              Recipient:
            </span>
            <span className="ml-2 text-xl font-semibold">
              {employees_badges_receiver_idToemployees?.name}
            </span>
          </div>

          <div className="flex items-center">
            <span className="bg-white text-black font-semibold px-2 py-0.5 rounded">
              Submitted Date:
            </span>
            <span className="ml-2 text-xl font-semibold">{formattedDate}</span>
          </div>

          <div className="flex items-center">
            <span className="bg-white text-black font-semibold px-2 py-0.5 rounded">
              Status:
            </span>
            <span className="ml-2 text-xl font-semibold capitalize">{status}</span>
          </div>

          <div className="flex items-center">
            <span className="bg-white text-black font-semibold px-2 py-0.5 rounded">
              Comments:
            </span>
            <span className="ml-2 text-xl font-semibold">{comment || "—"}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            className="flex-1 cursor-pointer bg-[#3BDF46] hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition"
            onClick={handleApprove}
          >
            Approve
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 cursor-pointer bg-[#FF0000] hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition"
          >
            Reject
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#05050580] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[600px]">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl capitalize font-bold text-[#312F54] mb-4">
                Reject reason
              </h2>
              <MdClose
                className="text-xl font-bold cursor-pointer"
                onClick={() => setIsModalOpen(false)}
              />
            </div>
            <label className="block text-black mb-2">
              Enter reason for rejection:*
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Type reason..."
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={handleReject}
                disabled={!reason.trim()}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
      
    </>

  );
};

export default AdminBadgeCard;
