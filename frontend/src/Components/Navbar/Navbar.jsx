import { Link, useLocation } from "react-router-dom";

const navItems = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Create Departments", path: "/create-departments" },
  { name: "Create Designation", path: "/create-designation" },
  { name: "Create KPI", path: "/create-kpi" },
  { name: "Add User", path: "/add-user" },
  { name: "Add Data To Kpi", path: "/add-kpi-data" },
  { name: "Manager Review", path: "/manager" },
];

export default function Navbar() {
  const location = useLocation();


  return (
    <nav className="bg-blue text-white px-6 py-4 flex items-center justify-between xl:flex-row md:flex-row flex-col">
      <ul className="flex flex-row items-center gap-3 justify-center">
        {/* {navItems.map((item) => (
          
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
        ))} */}
        {
          navItems.map((item, index) => {
            const same = location.pathname === item.path
            return (
              <li >
                <Link to={item.path}
                  className={`px-2 py-2 rounded-lg w-fit text-[18px] font-medium transition-all ${same ? "bg-white text-[var(--bluecolor)]" : "text-white hover:bg-white hover:text-[var(--bluecolor)]"
                    }`}
                >{item.name}</Link>
              </li>
            )
          })
        }
      </ul>
    </nav>
  );
}
