import { useState, useEffect } from "react";

export default function TimeModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const checkTimeIST = () => {
      const nowUTC = new Date();

      // Convert UTC time → IST (UTC + 5:30)
      const istTime = new Date(nowUTC.getTime() + (5.5 * 60 * 60 * 1000));

      const hours = istTime.getUTCHours();
      const minutes = istTime.getUTCMinutes(); // minutes in IST
      // At exactly 6:00 PM IST
      if (hours === 14 && minutes ===31) {
        setIsModalOpen(true);
      }
    };

    // Run immediately + check every minute
    checkTimeIST();
    const interval = setInterval(checkTimeIST, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center ">

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-xl font-bold mb-4">It’s 6 PM IST 🎉</h2>
            <p className="mb-4">Daily reminder modal popup (based on IST).</p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
