import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom';

const Kpi_Form = () => {
      const location = useLocation();

  const navItems = [
    { name: "form", path: "/kpi" },
    { name: "edit", path: "/kpi/edit" },
   
  ];
  return (
      <>
     
      <div className="bg-[#DDDDDD] p-3 rounded-lg overflow-x-auto">
  <ul className="flex gap-3 whitespace-nowrap">
    {navItems.map((item, index) => (
      <li key={index}>
        <Link
          to={item.path}
          className={`px-3 py-2 rounded-lg text-[16px] font-medium transition-all
            ${
              location.pathname === item.path
                ? "bg-white text-[var(--bluecolor)]"
                : "text-black hover:bg-white hover:text-[var(--bluecolor)]"
            }`}
        >
          {item.name}
        </Link>
      </li>
    ))}
  </ul>
</div>
      <div className="bg-white  rounded-lg mt-4 p-5">
        <Outlet />
      </div>
    </>
  )
}

export default Kpi_Form