import React, { useEffect, useState, useMemo, PureComponent, useContext } from 'react'
import { Link, useParams } from 'react-router-dom';
import { useAppContext } from '../Context/Context';
import { BarChart, ReferenceLine, ComposedChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

import { getEmployeeGraph } from '../../Api/Endpoints/endpoints';
// import BooleanKpiPieCharts from './BooleanKpiPie';
import BooleanKpiPie from './BooleanKpiPie';
import { GetterContext } from '../Context/NewContext';
import ErrorBox from '../ErrorBox';
import Spinner from '../Spinner';

const months = [
  { fin: 0, name: 'April', canonic: 3 },
  { fin: 1, name: 'May', canonic: 4 },
  { fin: 2, name: 'June', canonic: 5 },
  { fin: 3, name: 'July', canonic: 6 },
  { fin: 4, name: 'August', canonic: 7 },
  { fin: 5, name: 'September', canonic: 8 },
  { fin: 6, name: 'October', canonic: 9 },
  { fin: 7, name: 'November', canonic: 10 },
  { fin: 8, name: 'December', canonic: 11 },
  { fin: 9, name: 'January', canonic: 0 },
  { fin: 10, name: 'February', canonic: 1 },
  { fin: 11, name: 'March', canonic: 2 },
];

export function extractBooleanPieData(kpis) {
  return kpis
    .filter(kpi => kpi.target === null) // boolean KPIs only
    .map(kpi => {
      const achieved = kpi.values.filter(v => v.value_achieved === 1).length;
      const notAchieved = kpi.values.filter(v => v.value_achieved === 0).length;

      return {
        id: kpi.id,
        title: kpi.title,
        pieData: [
          { name: 'Achieved', value: achieved },
          { name: 'Not Achieved', value: notAchieved },
        ],
      };
    });
}


function formatDate(date) {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

function generateWeeks(year) {
  const weeks = [];

  let startDate = new Date(year, 3, 1, 0, 0, 0); // 1 April YYYY
  const endDate = new Date(year + 1, 2, 31, 0, 0, 0); // 31 March next year

  // First Sunday after 1st April
  let firstSunday = new Date(startDate);
  while (firstSunday.getDay() !== 0) {
    firstSunday.setDate(firstSunday.getDate() + 1);
  }

  weeks.push({
    week: 1,
    start: formatDate(startDate),
    end: formatDate(firstSunday),
    finYear: year
  });

  let weekStart = new Date(firstSunday);
  weekStart.setDate(weekStart.getDate() + 1); // Next Monday
  let weekNum = 2;

  while (weekStart <= endDate) {
    let weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    if (weekEnd > endDate) weekEnd = new Date(endDate);

    weeks.push({
      week: weekNum++,
      start: formatDate(weekStart),
      end: formatDate(weekEnd),
      finYear: year
    });

    weekStart.setDate(weekStart.getDate() + 7);
  }

  return weeks;
}
const Employee_Part = () => {

  const { id } = useParams();
  const { employees, myRole } = useContext(GetterContext)
  const filteredEmployee = employees.filter((e) => e.id == id);
  console.log("employee is ", filteredEmployee);
  const [displayYears, setDisplayYears] = useState([]);
  const [freq_id, setFreqID] = useState(1);
  const [month, setMonth] = useState(9);
  const [isBar, setIsBar] = useState(false);
  const [selYear, setSelYear] = useState(2025);

  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedEmployeeID) return;
    (async () => {
      setLoading(true);
      const { result: graph } = await getEmployeeGraph(selectedEmployeeID, freq_id, selYear, month);
      setData(graph.data);
      setLoading(false);
    })();
  }, [freq_id, selYear, month]);


  useEffect(_ => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 20 }, (_, i) => ({
      year: currentYear + i,
      text: `April ${currentYear + i} - March ${currentYear + i + 1}`
    }));
    setDisplayYears(years)
  }, []);

  const selectedEmployeeID = useMemo(() => {
    return employees.find((e) => e.id == id)?.id;
  }, [employees, id]);


  const dispWeeks = useMemo(() => generateWeeks(selYear), [selYear]);

  return (
    <>
      <div className="grid grid-cols-1 gap-8 p-6">
        {filteredEmployee.map((emp, empIndex) => {
          const fields = [
            {
              label: "Name",
              show: true,
              value: emp.name,
              image: emp.image || "https://i.pravatar.cc/150?img=12",
            },
            {
              label: "Department",
              value: emp.department,
              show: true,
              image: "https://i.pravatar.cc/",
            },
            {
              label: "Designation",
              show: true,
              value: emp.designation,
              image: "https://i.pravatar.cc/150?img=32",
            },
          ];

          return (
            <div
              key={empIndex}
              className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6"
            >
              {fields.map((field, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-100 p-4 rounded-2xl shadow-md relative"
                >
                  <span className="text-lg font-medium text-black mt-4">
                    {field.value}
                  </span>
                  <img
                    src={field.image}
                    alt={field.label}
                    className="w-10 h-10 rounded-full object-cover mt-4"
                  />
                  <span className="absolute top-2 left-2 bg-[#312F52] text-white text-xs px-2 py-1 rounded">
                    {
                      field.show ? field.label : ""
                    }
                  </span>
                </div>
              ))}
              {
                (myRole && myRole.power >= 20) ?
                  <div
                    className="flex flex-col items-center justify-between bg-gray-100 p-4 rounded-2xl shadow-md relative"
                  >
                    <span className='text-lg'>Manager Review</span>
                    <Link
                      to={`manager`}
                      className='bg-[#312F52] text-white p-1 px-5 rounded-lg hover:cursor-pointer'
                    >View</Link>
                  </div> :
                  <div></div>
              }


              <div
                className="flex flex-col items-center justify-between bg-gray-100 p-4 rounded-2xl shadow-md relative"
              >
                <span className='text-xl w-full'>Select Frequency</span>
                <select
                  value={freq_id}
                  onChange={e => setFreqID(e.target.value)}
                  className='w-[80%] bg-white mt-6 p-3 rounded-xl'>
                  <option value={1}>
                    Weekly
                  </option>
                  <option value={2}>
                    Monthly
                  </option>
                  <option value={3}>
                    Quarterly
                  </option>
                  <option value={4}>
                    Yearly
                  </option>
                </select>
              </div>
              <div

                className="flex flex-col items-center justify-between bg-gray-100 p-4 rounded-2xl shadow-md relative"
              >
                <span className='text-xl w-full'>Select Year</span>
                <select value={selYear} onChange={e => setSelYear(e.target.value)} className='w-[80%] bg-white mt-6 p-3 rounded-xl'>
                  {
                    displayYears.map(y => (
                      <option value={y.year}>
                        {y.year}
                      </option>
                    ))
                  }
                </select>
              </div>

              {
                (freq_id == 1) &&
                <div
                  className="flex flex-col items-center justify-between bg-gray-100 p-4 rounded-2xl shadow-md relative"
                >
                  <span className='text-xl w-full'>Select Month</span>
                  <select
                    value={month}
                    onChange={e => setMonth(e.target.value)}
                    className='w-[80%] bg-white mt-6 p-3 rounded-xl'>
                    {
                      months.sort((a, b) => a.canonic > b.canonic).map((m, i) => (
                        <option value={m.fin}>
                          {m.name}
                        </option>
                      ))
                    }
                  </select>
                </div>
              }
              {
                (myRole && myRole.power >= 20) ?
                  <div
                    className="flex flex-col items-center justify-between bg-gray-100 p-4 rounded-2xl shadow-md relative"
                  >
                    <span className='text-lg'>Appraisal</span>
                    <Link
                      to={`appraisal`}
                      className='bg-[#312F52] text-white p-1 px-5 rounded-lg hover:cursor-pointer'
                    >View</Link>
                  </div> :
                  <div></div>
              }
            </div>

          );
        })}
      </div>
      <div className='flex flex-col flex-wrap'>
        {
          loading &&
          <div className='w-full'>
            <Spinner />
          </div>
        }
        {
          data.length > 0 ?
            <>
              <div className='flex flex-row justify-end px-6'>
                <button
                  className='hover:cursor-pointer flex flex-row m-3 shadow border-1 border-[#312F52] rounded-lg font-bold w-fit'
                  onClick={_ => setIsBar(!isBar)}>
                  <div className={`rounded-md p-4 ${isBar ? " bg-[#312F52] text-white " : ""}`}>
                    Bar
                  </div>
                  <div className={`rounded-md p-4 ${!isBar ? " bg-[#312F52] text-white " : ""}`}>
                    Line
                  </div>
                </button>
              </div>
              <div
                className='flex flex-row flex-wrap'
              >
                {
                  data.map(
                    kpi => (
                      <div className='flex flex-col justify-center items-center'>

                        {
                          kpi.target != null &&
                          <>
                            <div className='text-xl'>{kpi.title}</div>
                            <ComposedChart
                              width={500}
                              height={300}
                              data={kpi.values}

                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="label" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              {
                                isBar &&
                                <Bar barSize={20} type="monotone" fill="#F3B553" dataKey="value_achieved" activeBar={<Rectangle fill="pink" stroke="green" />} />

                              }
                              {
                                !isBar &&
                                <Line type="monotone" dataKey="value_achieved" activeBar={<Rectangle fill="pink" stroke="blue" />} />

                              }

                              {/* <Bar dataKey="uv" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} /> */}

                              <ReferenceLine strokeDasharray="3 3" y={kpi.target} label={`Target ${kpi.target}`} stroke="red" />

                            </ComposedChart>
                          </>

                        }
                        {
                          kpi.target == null &&
                          <BooleanKpiPie booleanKpis={extractBooleanPieData(data)} />
                        }
                      </div>

                    )
                  )
                }
              </div>

            </>
            :
            <ErrorBox>
              No data for this time period
            </ErrorBox>
        }
      </div>



    </>
  )
}

export default Employee_Part