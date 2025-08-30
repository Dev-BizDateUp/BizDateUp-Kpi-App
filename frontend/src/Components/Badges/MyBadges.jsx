import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom';

const MyBadges = () => {
  const location = useLocation();

  const navItems = [
    { name: "My Given Badges", path: "/shine-badges/my/given" },
    { name: "My Received Badges", path: "/shine-badges/my/received" },
  ];

  return (
    <>
      <h1 className="text-3xl text-black font-bold">My Badges</h1>
      <p className="text-xl mt-2 mb-2">View badges you've given and received</p>

      {/* Tab Navigation */}
      <div className=" p-3 rounded-lg">
        <ul className="flex gap-3">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`px-3 py-2 rounded-lg text-[16px] font-medium transition-all ${
                  location.pathname === item.path
                    ? "bg-[#687FE5] text-white"
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
