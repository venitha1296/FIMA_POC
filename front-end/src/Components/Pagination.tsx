import React, { useState } from "react";

interface PaginationProps {
  totalItems: number;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems = 50,
  pageSizeOptions = [10, 12, 15, 20],
  defaultPageSize = 10,
}) => {
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="d-flex justify-content-between bg-white px-3 mb-4">
      {/* Page Size Selector */}
      <div className="pagination-count d-flex align-items-center">
        <label>Showing</label>
        <div className="select-box">
          <select
            className="form-control"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1); // Reset to first page when changing page size
            }}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="arrow"></span>
        </div>
        <label>of {totalItems}</label>
      </div>

      {/* Pagination Navigation */}
      <nav>
        <ul className="pagination justify-content-end">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
          </li>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
              <button className="page-link" onClick={() => handlePageChange(page)}>
                {page}
              </button>
            </li>
          ))}

          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
