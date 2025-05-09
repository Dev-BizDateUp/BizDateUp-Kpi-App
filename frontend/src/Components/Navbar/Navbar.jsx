import { Link, useLocation } from "react-router-dom";

const navItems = [
  { name: "Add User", path: "/add-user" },
  { name: "Create Departments", path: "/create-departments" },
  { name: "Create Designation", path: "/create-designation" },
  { name: "Create KPI", path: "/create-kpi" },
  { name: "Add Data To Kpi", path: "/add-kpi-data" },
  { name: "Dashboard", path: "/dashboard" },
];

export default function Navbar() {
  const location = useLocation();
  console.log( location.pathname);

  return (
    <nav className="bg-blue text-white px-6 py-4 flex items-center justify-between">
      <ul className="flex gap-4">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`px-3 py-2 rounded-lg text-[20px] font-medium text-white hover:text-[var(--bluecolor)] ${
                location.pathname === item.path
                  ? ""
                  : " hover:bg-white"
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
