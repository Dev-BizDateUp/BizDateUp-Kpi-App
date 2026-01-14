const Card = ({ title, subtitle, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-[#312F54] rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:scale-105 transition"
    >
      <p className="text-white text-xl font-semibold text-center">
        {title}
      </p>

      {subtitle && (
        <p className="text-sm text-gray-300 text-center">
          {subtitle}
        </p>
      )}

      <button className="bg-white text-black px-4 py-1 rounded mt-2">
        Select
      </button>
    </div>
  );
};

export default Card;
