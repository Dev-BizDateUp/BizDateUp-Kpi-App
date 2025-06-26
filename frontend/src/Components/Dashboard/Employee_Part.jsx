import React, { useEffect, useState, useMemo, PureComponent } from 'react'
import { useParams } from 'react-router-dom';
import { useAppContext } from '../Context/Context';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

import { getEmployeeGraph } from '../../Api/Endpoints/endpoints';

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

  const { name } = useParams();
  const { employees } = useAppContext()
  const filteredEmployee = employees.filter((e) => e.name === name);
  console.log("employee is ", filteredEmployee);
  const [displayYears, setDisplayYears] = useState([]);
  const [freq_id, setFreqID] = useState(1);
  const [month, setMonth] = useState(9);
  const [selYear, setSelYear] = useState(2025);

  const [data, setData] = useState([]);

  function getGraphs() {

    (async () => {
      const { result: graph } = await getEmployeeGraph(filteredEmployee[0].id, freq_id, selYear, month);
      console.log("Graph is ", graph.data)
      setData(graph.data);
    })();
  }

  useEffect(_ => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 20 }, (_, i) => ({
      year: currentYear + i,
      text: `April ${currentYear + i} - March ${currentYear + i + 1}`
    }));
    setDisplayYears(years)
  }, []);

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
              image: "https://img.icons8.com/ios-filled/50/group.png",
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
              <div>
                Manager Review
              </div>
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

              <div
                className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-2xl shadow-md relative"
              >
                <button
                  onClick={getGraphs}
                  className='bg-[#F3B553] text-white p-2 px-4 rounded-lg shadow hover:cursor-pointer'
                >
                  Fetch graphs
                </button>
              </div>

            </div>

          );
        })}
      </div>
      <div className='flex flex-row flex-wrap'>
        {
          data.length > 0 &&
          data.map(
            kpi => (
              <div className='flex flex-col justify-center items-center'>
                <LineChart
                  width={500}
                  height={300}
                  data={kpi.values}

                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period_id" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value_achieved" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                  {/* <Bar dataKey="uv" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} /> */}

                </LineChart>
                <div className='text-xl'>{kpi.title}</div>
              </div>

            )
          )
        }
      </div>



    </>
  )
}

export default Employee_Part