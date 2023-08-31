import React from "react";
import { LOCALSTORAGE_PAGINATION_COUNT } from "../constant";

interface IPaginationProp {
  page: number;
  pageSize: number;
  totalPage: number;
  isPageSize: boolean;
  setPage: any;
  setPageSize: any;
}

export const Pagination: React.FC<IPaginationProp> = ({
  page,
  pageSize,
  isPageSize,
  totalPage,
  setPage,
  setPageSize,
}) => {
  if (totalPage <= 0) {
    return null;
  }

  const handleCount = (e: any) => {
    localStorage.setItem(LOCALSTORAGE_PAGINATION_COUNT, e.target.value);
    setPageSize(e.target.value);
    setPage(1);
  };

  return (
    <>
      <div className="container flex justify-center select-none">
        <div className="flex mr-4">
          {isPageSize && (
            <div>
              <select
                onChangeCapture={handleCount}
                className="h-8 px-2 text-gray-600 bg-white border  border-gray-600 hover:bg-gray-200"
                key={pageSize}
                defaultValue={pageSize}
              >
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="60">60</option>
              </select>
            </div>
          )}
        </div>
        <ul className="flex ">
          {page > 1 && (
            <>
              <li onClick={() => setPage(1)}>
                <button className="h-8 px-2 text-gray-600 bg-white border border-r-0 border-gray-600 hover:bg-gray-300">
                  ◀◀
                </button>
              </li>
            </>
          )}

          {page > 1 && (
            <li onClick={() => setPage(page - 1)}>
              <button className="h-8 px-4 font-bold text-gray-600 bg-white border border-r-0 border-gray-600 hover:bg-gray-400 hover:text-white ">
                {page - 1}
              </button>
            </li>
          )}

          <li>
            <button className="h-8 px-4 font-bold text-white bg-gray-600 border border-r-0 border-gray-600 ">
              {page}
            </button>
          </li>

          {totalPage > page && (
            <li onClick={() => setPage(page + 1)}>
              <button className="h-8 px-4 font-bold text-gray-600 bg-white border border-r-0 border-gray-600 hover:bg-gray-400 hover:text-white ">
                {page + 1}
              </button>
            </li>
          )}
          {page < totalPage && (
            <>
              <li onClick={() => setPage(totalPage)}>
                <button className="h-8 px-2 text-gray-600 bg-white border border-gray-600 hover:bg-gray-300">
                  ▶▶
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
};
