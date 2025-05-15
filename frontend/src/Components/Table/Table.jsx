import React from 'react';

const Table = ({ headers, data }) => {
  return (
    <div className="p-6">
      <div className="overflow-x-auto rounded-2xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200 ">
          <thead className="bg-[#2b2d5b] text-white">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-6 py-4 text-left text-lg font-medium tracking-wide"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.map((datum) => (
              <tr
                key={datum.id}
                className="hover:bg-[#f7f7f7] cursor-pointer transition-colors  "
              >
                <td className="px-6 py-4">{datum.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{datum.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{datum.email}</td>
                <td className="px-6 py-4">{datum.department}</td>
                <td className="px-6 py-4">{datum.designation}</td>
                <td className="px-6 py-4">
                  <span className="bg-[#77DD77] text-white text-lg font-semibold px-3 py-1 rounded shadow">
                    {datum.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xl text-center">{datum.edit}</td>
                <td className="px-6 py-4 text-xl text-center">{datum.delete}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
