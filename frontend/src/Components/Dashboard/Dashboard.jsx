import React, { use, useContext } from "react";
import Top_Bar from "../Top_Bar/Top_Bar";
import Navbar from "../Navbar/Navbar";
import AddUser from "../AddUser/AddUser";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";
import {
  getAllValuesKpi,
  getDepartments,
  getDesignation,
  getEmployees,
  getKpiGraph,
  getKPIsForDesg,
} from "../../Api/Endpoints/endpoints";
import { Link } from "react-router-dom";

import { set } from "lodash";
import SearchBar from "../SearchBar/SearchBar";
import { useAppContext } from "../Context/Context";
import Spinner from "../Spinner";
import { AuthContext, GetterContext } from "../Context/NewContext";

const Dashboard = () => {
  // const [data, setData] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [dept, setDept] = useState([]);
  const { userData } = useContext(AuthContext);
  const { departments, employees, designations, myRole } = useContext(GetterContext);
  const [searchWord, setChangeWord] = useState("")
  const [selDept, setSelDept] = useState(0);
  function search(departments) {
    return departments.name.toUpperCase().includes(searchWord.toUpperCase());
  }
  return (
    <>
      {departments.length > 0 && designations.length > 0 && selDept == 0 ? (
        <>
          <SearchBar title_text={"Select Department for Dashboard"} searchTextChanged={(word) => { setChangeWord(word) }} />
          <div className="flex flex-row flex-wrap gap-5 p-7">
            {
              departments .filter(search).filter(
                d =>
                  myRole.power < 20 ?
                    d.id == employees.find(e => e.id == userData.id)?.department_id :
                    true
              ).map((d) => (
                <Link to={`/dashboard/departments/${d.name}`} className="hover:cursor-pointer">
                  <div
                    key={d.id}
                    className="flex flex-col p-7 px-15 bg-[#312F52] rounded-lg items-center gap-2 justify"
                  >
                    <span className="text-2xl text-white">{d.name}</span>
                    <button
                      onClick={() => setSelDept(d.id)}
                      className="px-4 text-black bg-white rounded text-lg hover:cursor-pointer"
                    >
                      Select
                    </button>
                  </div>
                </Link>
              ))}
          </div>
        </>
      )
        : (
          <div className="flex flex-row w-full m-3 justify-center">
            <Spinner />
          </div>
        )
      }




    </>
  );
};

export default Dashboard;
