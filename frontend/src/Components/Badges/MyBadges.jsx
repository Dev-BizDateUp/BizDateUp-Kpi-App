import React, { useContext } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom';

const MyBadges = () => {
  const location = useLocation();
  const navItems = [
    { name: "My Given Badges", path: "/shine-badges/my" },
    { name: "My Received Badges", path: "/shine-badges/my/received" },
  ];

  return (
    <>
      <h1 className="xl:text-3xl text-xl  text-black font-bold">My Badges</h1>
      <p className="xl:text-xl text-lg mt-2 mb-2">View badges you've given and received</p>

      {/* Tab Navigation */}
      <div className=" p-3 rounded-lg">
        <ul className="flex lg:flex-row  w-full xl:flex-row flex-col gap-5">
          {navItems.map((item, index) => (
            <li key={index} className="w-full">
              <Link
                to={item.path}
                className={`px-3 py-2 rounded-lg  text-[16px] font-medium transition-all ${
                  location.pathname === item.path
                    ? "bg-[#687FE5] text-white w-full"
                    : "text-black bg-[#f7f7f7] hover:bg-white hover:text-[var(--bluecolor)]"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Nested Tab Content */}
      <div className="bg-white rounded-lg mt-4 p-5">
        <Outlet />
      </div>
    </>
  )
}

export default MyBadges;
