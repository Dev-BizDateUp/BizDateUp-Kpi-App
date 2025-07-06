import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ title_text, searchTextChanged}) => {
  const [word, setword] = useState("");
  const [text, settext] = useState("");
  const [filtered, setfiltered] = useState([]);
  const handlechange = (e) => {
    const enteredword = e.target.value;
    searchTextChanged(enteredword)
    settext(enteredword);
  };
  return (
    <>
     <div className="flex justify-between items-center px-5 py-5 xl:flex-row md:flex-row flex-col xl:gap-0 md:gap-0 gap-10">
      <div className="one">
<h2 className="text-2xl ">{title_text}</h2>
      </div>
      <div className="two">
        <div className="relative">
          <FaSearch  className="absolute top-[12px] left-[10px]"/>
         <input type="text" onChange={handlechange} value={text} placeholder="Search..."  className="bg-[#F7F7F7] px-8 py-2  text-black rounded-xl border-none"/>
        </div>
      </div>
     </div>
    </>
  );
};
export default SearchBar;
