import { useState, useEffect, useRef } from "react";

export default function TimeModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const intervalRef = useRef(null); // changed var → const

  useEffect(() => {
    const checkTimeIST = () => {
      const nowUTC = new Date();

      // Convert UTC → IST (UTC + 5:30)
      const istTime = new Date(nowUTC.getTime() + 5.5 * 60 * 60 * 1000);

      const hours = istTime.getUTCHours();
      const minutes = istTime.getUTCMinutes();
      

      if (hours === 18 && minutes === 0) {
        setIsModalOpen(true);
      }
    };

    checkTimeIST();
    intervalRef.current = setInterval(checkTimeIST, 2000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalRef.current);
  }, []); // removed isModalOpen dependency

  const handleClose = () => {
    setIsModalOpen(false);
    clearInterval(intervalRef.current); // stop interval on close
  };

  return (
    <div className="flex items-center justify-center ">
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-xl font-bold mb-4">It’s 6 PM IST 🎉</h2>
            <p className="mb-4">Daily reminder modal popup (based on IST).</p>
            <button
              onClick={handleClose}
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
