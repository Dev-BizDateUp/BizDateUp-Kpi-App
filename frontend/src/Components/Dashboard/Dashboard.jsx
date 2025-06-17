import React, { use } from 'react'
import Top_Bar from '../Top_Bar/Top_Bar'
import Navbar from '../Navbar/Navbar'
import AddUser from '../AddUser/AddUser'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { getAllValuesKpi, getDepartments, getDesignation, getKPIsForDesg } from '../../Api/Endpoints/endpoints';
const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dept, setDept] = useState([]);
  const [selDept, setSelDept] = useState(0);
  const [desg, setDesg] = useState([]);
  const [selDesg, setSelDesg] = useState(0);
  const [kpi, setKpi] = useState([]);
  const [selKpi, setSelKpi] = useState(0);
  const [selFreq, setSelFreq] = useState(0);
  const freq = [
    { id: 1, name: "Weekly" },
    { id: 2, name: "Monthly" },
    { id: 3, name: "Quarterly" },
    { id: 4, name: "Yearly" }
  ]

  const getKPI_values = async (kpi_id) => {
    try {
      const res = await getAllValuesKpi(kpi_id);
      console.log("Got kpi info:", res.data);
      if (res.data) {
        setData(res.data);
      }
    } catch (error) {
      console.error("Error fetching KPI data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await getDesignation();
        // console.log("designtaions", res);
        if (res) {
          setDesg(res);
        }
      } catch (exc) {
        console.error("Error fetching Designations:", exc);
      }
    })();
    (async () => {
      try {
        const res = await getDepartments();
        // console.log(res.data);
        if (res) {
          setDept(res);
        }
      } catch (error) {
        console.error("Error fetching Departments:", error);
      } finally {
        setLoading(false);
      }

    })();

    // getKPIs();
  }, []);

  useEffect(() => {
    (async () => {
      if (selDesg > 0) {
        const res = await getKPIsForDesg(selDesg);
        console.log("KPI for Designation", res);
        setKpi(res);
      }
    })();
  }, [selDesg]);

  return (
    <>

      {dept.length > 0 && desg.length > 0 &&
        <>
          <div className='flex flex-row m-4'>
            <div className='flex flex-col m-4'>
              <label className='text-lg font-bold w-fit'>Select Department</label>
              <select className='w-fit rounded border-1 border-gray-500 p-2' onChange={(e) => { setSelDept(e.target.value); setSelDesg(0); setKpi([]); setData([]); }}>
                <option value={0}>Select Department</option>
                {
                  dept.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))
                }
              </select>

            </div>
            {
              desg.filter(de => de.department_id == selDept).length > 0 &&
              <div className='flex flex-col m-4'>
                <label className='text-lg font-bold w-fit'>Select Department</label>
                <select className='w-fit rounded border-1 border-gray-500 p-2' onChange={(e) => { setSelDesg(e.target.value); setSelKpi(0); setKpi([]); setData([]); }}>
                  <option value={0}>Select Designation</option>
                  {
                    desg.filter(de => de.department_id == selDept).map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))
                  }
                </select>

              </div>
            }
            {
              kpi.length > 0 &&
              <div className='flex flex-col m-4'>
                <label className='text-lg font-bold w-fit'>Select Frequency</label>
                <select className='w-fit rounded border-1 border-gray-500 p-2' onChange={(e) => { setSelFreq(e.target.value); setSelKpi(0); setData([]); }}>
                  <option value={0}>Select Frequency</option>
                  {
                    freq.map((f) => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))
                  }
                </select>
              </div>
            }
            {
              kpi.length > 0 &&
              <div className='flex flex-col m-4'>
                <label className='text-lg font-bold w-fit'>Select KPI</label>
                <select className='w-fit rounded border-1 border-gray-500 p-2' onChange={(e) => {
                  setSelKpi(e.target.value);
                  // getKPI_values(e.target.value);
                }}>
                  <option value={0}>Select KPI</option>
                  {
                    kpi.map((d) => (
                      <option key={d.id} value={d.id}>{d.title}</option>
                    ))
                  }
                </select>

              </div>
            }
            {
              selKpi > 0 &&
              <div className='flex flex-col m-4'>
                <button className='hover:cursor-pointer bg-blue-500 text-white p-2 rounded' onClick={() => getKPI_values(selKpi)}>Get KPI Values</button>
              </div>
            }
          </div>

        </>
      }
      {
        data.length > 0 &&
        <>
          <LineChart width={600} height={300} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value_achieved" stroke="#8884d8" strokeWidth={2} />
            <Line type="monotone" dataKey="target" stroke="#880088" strokeWidth={2} />
            <Line type="monotone" dataKey="avg" stroke="#009900" strokeWidth={2} />
          </LineChart>

        </>
      }
    </>
  )
}

export default Dashboard