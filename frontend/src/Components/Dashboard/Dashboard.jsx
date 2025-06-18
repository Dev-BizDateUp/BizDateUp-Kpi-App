import React, { use } from 'react'
import Top_Bar from '../Top_Bar/Top_Bar'
import Navbar from '../Navbar/Navbar'
import AddUser from '../AddUser/AddUser'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { getAllValuesKpi, getDepartments, getDesignation, getEmployees, getKpiGraph, getKPIsForDesg } from '../../Api/Endpoints/endpoints';
import { set } from 'lodash';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dept, setDept] = useState([]);
  const [selDept, setSelDept] = useState(0);
  const [desg, setDesg] = useState([]);
  const [selDesg, setSelDesg] = useState(0);
  const [emp, setEmp] = useState([]);
  const [selEmp, setSelEmp] = useState(0);
  const [kpi, setKpi] = useState([]);
  const [selFreq, setSelFreq] = useState(0);
  const freq = [
    { id: 1, name: "Weekly" },
    { id: 2, name: "Monthly" },
    { id: 3, name: "Quarterly" },
    { id: 4, name: "Yearly" }
  ]

  const getKPI_values = async (emp_id) => {
    try {
      const res = await getKpiGraph(emp_id);
      console.log("Got kpi info:", res);
      if (res) {
        setData(res);
      }
    } catch (error) {
      console.error("Error fetching KPI data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (
      async () => {
        try {
          const emps = await getEmployees();
          setEmp(emps.employees);
          // console.log("Employees:", emps.employees);

        } catch (exc) {
          console.error("Error fetching KPI data:", exc);
        }
      }
    )();

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
      if (selEmp > 0) {
        await getKPI_values(selEmp);
      }
    })();
  }, [selEmp]);

  return (
    <>

      {dept.length > 0 && desg.length > 0 && selDept == 0 &&
        <div className='flex flex-row flex-wrap gap-5 p-7'>
          {
            dept.map(d => (
              <div
                key={d.id}
                className='flex flex-col p-7 px-15 bg-[#312F52] rounded-lg items-center gap-2 justify'
              >
                <span className='text-2xl text-white'>{d.name}</span>
                <button
                  onClick={() => setSelDept(d.id)}
                  className='px-4 text-black bg-white rounded text-lg hover:cursor-pointer'
                >Select</button>
              </div>
            ))
          }

        </div>
      }
      {
        selDept > 0 && desg.length > 0 && selDesg == 0 &&
        <div className='flex flex-col gap-5 p-7'>
          <div className='flex flex-row gap-5 p-7'>
            {
              desg.filter(d => d.department_id == selDept).map(
                d => (
                  <div
                    key={d.id}
                    className='flex flex-col p-7 px-15 bg-[#312F52] rounded-lg items-center gap-2 justify-between'
                  >
                    <span className='text-2xl text-white'>{d.name}</span>
                    <button
                      onClick={() => setSelDesg(d.id)}
                      className='px-4 text-black bg-white rounded text-lg hover:cursor-pointer'
                    >Select</button>
                  </div>
                )
              )
            }
          </div>
          <button
            onClick={() => setSelDept(0)}
            className='p-4 px-6 text-white bg-[#F3B553] w-fit rounded text-lg hover:cursor-pointer'>Back</button>
        </div>
      }
      {
        selDesg > 0 && selEmp == 0 &&

        <div className='flex flex-col gap-5 p-7'>
          <div className='flex flex-row gap-5 p-7'>
            {
              emp.filter(e => e.designation_id == selDesg).map(
                e => (
                  <div
                    key={e.id}
                    className='flex flex-col p-7 px-15 bg-[#312F52] rounded-lg items-center gap-2 justify-between'
                  >
                    <span className='text-2xl text-white'>{e.name}</span>
                    <button
                      onClick={() => {
                        setSelEmp(e.id);
                        getKPI_values(e.id);
                      }}
                      className='px-4 text-black bg-white rounded text-lg hover:cursor-pointer'
                    >Select</button>
                  </div>
                )
              )
            }
          </div>
          <button
            onClick={() => setSelDesg(0)}
            className='p-4 px-6 text-white bg-[#F3B553] w-fit rounded text-lg hover:cursor-pointer'
          >
            Back
          </button>
        </div>
      }
      {
        selEmp > 0 &&
        <>
          <div className='flex flex-col gap-5 p-7'>
            <span className='text-2xl text-black'>KPI for {emp.filter(e => e.id == selEmp)[0].name}</span>
            <div className='flex flex-row gap-5 p-7'>
              <div>
                {
                  data.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="value_achieved" stroke="#8884d8" strokeWidth={2} />
                        <Line type="monotone" dataKey="target" stroke="#880088" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <span className='text-red-500'>No KPI data available for this employee.</span>
                  )
                }
              </div>
            </div>
            <button
              onClick={() => setSelEmp(0)}
              className='p-4 px-6 text-white bg-[#F3B553] w-fit rounded text-lg hover:cursor-pointer'
            >
              Back
            </button>
          </div>
        </>
      }
      {
        // data.length > 0 &&
        // <>
        //   <LineChart width={600} height={300} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        //     <CartesianGrid strokeDasharray="3 3" />
        //     <XAxis dataKey="name" />
        //     <YAxis />
        //     <Tooltip />
        //     <Legend />
        //     <Line type="monotone" dataKey="value_achieved" stroke="#8884d8" strokeWidth={2} />
        //     <Line type="monotone" dataKey="target" stroke="#880088" strokeWidth={2} />
        //     <Line type="monotone" dataKey="avg" stroke="#009900" strokeWidth={2} />
        //   </LineChart>

        // </>
      }
    </>
  )
}

export default Dashboard