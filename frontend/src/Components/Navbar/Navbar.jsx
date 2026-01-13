import { useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { GetterContext } from "../Context/NewContext";

let navItems = [
  { name: "Dashboard", path: "/dashboard", rolePower: 0 },
  { name: "Create Departments", path: "/create-departments", rolePower: 50 },
  { name: "Create Designation", path: "/create-designation", rolePower: 50 },
  { name: "Create KPI", path: "/create-kpi", rolePower: 50 },
  { name: "Add User", path: "/add-user", rolePower: 50 },
  { name: "Add Data To Kpi", path: "/add-kpi-data", rolePower: 20 },
  { name: "Manager Review", path: "/manager", rolePower: 20 },
  { name: "Employee Appraisal", path: "/appraisal", rolePower: 20 },
  { name: "kpi review", path: "/kpireview", rolePower: 20 },
  { name: "Shine Badges", path: "/shine-badges", rolePower: 0 },
  { name: "Approval", path: "/admin-approval", rolePower: 50 },
   { name: "kpi", path: "/kpi", rolePower: 0 },
  { name: "Biz Task", path: "https://script.google.com/a/macros/bizdateup.com/s/AKfycbw7XJ0fhO6iX3L07hEmjbCOuN4D6OrTKwJR0UDw435AkACXHH_hJTm8jbMcze3Oxq4/exec", rolePower: 0 },
];

export default function Navbar({ toggleMenu }) {
  const location = useLocation();
  const { me, myRole } = useContext(GetterContext);

  useEffect(() => { }, [myRole, me]);
  return (
    // 
    <div className="xl:block lg:block  hidden">
      <nav className="bg-blue text-white px-6 py-4 flex items-center justify-between xl:flex-row  flex-col ">
        <ul
          className="flex xl:flex-row flex-col
 items-center gap-3 justify-center "
        >
          <Link
            to="/"
            className={`px-2 py-2 rounded-lg w-fit xl:text-[18px] lg:text-[18px] text-[13px] font-medium transition-all text-white hover:border-white border-[var(--bluecolor)] border-1`}
          >
            <img src="/home.svg" />
          </Link>
          {myRole &&
            navItems
              .filter((n) => n.rolePower <= myRole.power)
              .map((item) => {
                let path = item.path;
                if (path == "/dashboard" && myRole && myRole.power == 0) {
                  path =
                    "/dashboard/departments/emp/" + encodeURIComponent(me.id);
                }
                return (
                  <li>
                    <Link
                      to={path} onClick={toggleMenu} target={path === "https://script.google.com/a/macros/bizdateup.com/s/AKfycbw7XJ0fhO6iX3L07hEmjbCOuN4D6OrTKwJR0UDw435AkACXHH_hJTm8jbMcze3Oxq4/exec" ? "_blank" : ""}
                      className={`px-2 py-2 rounded-lg w-fit xl:text-[16px] lg:text-[16px] md:text-[16px] sm:text-[16px]  font-medium transition-all ${location.pathname === item.path
                        ? "bg-white text-[var(--bluecolor)]"
                        : "text-white hover:bg-white hover:text-[var(--bluecolor)]"
                        }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
        </ul>
      </nav>
    </div>
  );
}
