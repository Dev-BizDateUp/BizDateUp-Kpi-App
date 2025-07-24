import React from 'react';

const Pagination = ({ totalItems, itemsPerPage, currentPage, setCurrentPage }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center mt-4">
      <ul className="flex items-center space-x-2">
        <li>
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
        </li>
        {pageNumbers.map(number => (
          <li key={number}>
            <button
              onClick={() => setCurrentPage(number)}
              className={`px-3 py-1 rounded-md border ${
                currentPage === number
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              } border-gray-300`}
            >
              {number}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;