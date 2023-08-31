import React, { useRef, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { LOCALSTORAGE_TOKEN, Page, PageSize, UserRole } from "../constant";
import { useOnClickOutside } from "../hook/useOnClickOutside";
import { useNavigate } from "react-router";
import { apiMe } from "../api/axios";
import { IUser } from "../api/type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faBuilding,
  faIdCard,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

interface IAdminHeaderProp {
  name: string;
}

export const AdminHeader: React.FC<IAdminHeaderProp> = ({ name }) => {
  const naviage = useNavigate();
  const queryClient = useQueryClient();
  const ref = useRef(null);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { data } = useQuery<IUser>("me", apiMe);

  useOnClickOutside(ref, () => {
    if (isMenuOpen) setMenuOpen(false);
  });

  const logoutAdmin = () => {
    localStorage.removeItem(LOCALSTORAGE_TOKEN);
    queryClient.invalidateQueries("me");
    naviage(`/admin-login`);
  };

  return (
    <header className=" sticky top-0 left-0 right-0 z-10 bg-gray-800 text-gray-50 py-3 min-w-max select-none">
      <div className="max-w-6xl mx-auto flex justify-between items-center ">
        <Link
          className=" w-14 text-center cursor-pointer"
          to={`/search-group?pagesize=${PageSize()}&page=${Page}`}
        >
          <FontAwesomeIcon icon={faBuilding} className="fa-2x" />
        </Link>
        <div className="flex-wrap">
          <div className=" text-white py-1 transition-colors rounded-md text-center cursor-pointer">
            <span
              onClick={() => {
                setMenuOpen(!isMenuOpen);
              }}
            >
              {name}님 안녕하세요{" "}
              <FontAwesomeIcon className="fa-1x" icon={faAngleDown} />
            </span>
          </div>
          {isMenuOpen && (
            <div className=" absolute mt-1  w-40 rounded-md shadow-xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none cursor-pointer">
              <div className="py-1">
                {data && data.role === UserRole.SuperAdmin && (
                  <>
                    <Link
                      to={`/search-norm`}
                      className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      규준 관리
                    </Link>
                    <Link
                      to={`/search-tester`}
                      className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      지원자 관리
                    </Link>
                    <Link
                      className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                      to={`/search-admin`}
                    >
                      면접위원 관리
                    </Link>
                  </>
                )}

                <div className="px-4 py-2 flex justify-between text-sm hover:bg-gray-100">
                  <FontAwesomeIcon
                    onClick={() => logoutAdmin()}
                    className="fa-lg text-gray-700 transform  hover:scale-110 hover:text-red-500"
                    icon={faSignOutAlt}
                  />
                  {data && data.role === UserRole.SuperAdmin && (
                    <Link to={`/edit-superadmin`}>
                      <FontAwesomeIcon
                        className="fa-lg mb-0.5 text-gray-700 transform  hover:scale-110 hover:text-green-400"
                        icon={faIdCard}
                      />
                    </Link>
                  )}
                </div>
                <div ref={ref}></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
