import { faBuilding, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router";
import { LOCALSTORAGE_TOKEN } from "../constant";
import Swal from "sweetalert2";

export const TeseterHeader = () => {
  const queryClient = useQueryClient();
  const naviage = useNavigate();
  const logoutTester = () => {
    localStorage.removeItem(LOCALSTORAGE_TOKEN);
    queryClient.invalidateQueries("me");
    naviage(`/tester-login`);
    window.location.reload();
  };

  // [마우스 오른쪽 클릭] / [컨트롤] / [F12] 금지
  useEffect(() => {
    const keyEvent = (e: any) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }

      switch (e.key) {
        case "Control":
          Swal.fire({
            icon: "error",
            title: "Control 사용불가",
          });
          e.preventDefault();
          break;

        case "F12":
          e.preventDefault();
          break;

        case "Meta":
          Swal.fire({
            icon: "error",
            title: "윈도우키 사용불가",
          });
          e.preventDefault();
          break;

        default:
          break;
      }
    };
    document.addEventListener("keydown", keyEvent);
    return () => document.removeEventListener("keydown", keyEvent);
  }, []);

  return (
    <header className=" sticky top-0 left-0 right-0 z-10 bg-gray-800 text-gray-50 py-3 min-w-max select-none">
      <div className="max-w-6xl mx-auto flex justify-between items-center ">
        <FontAwesomeIcon icon={faBuilding} className="fa-2x" />
        <div className="flex-wrap">
          <div
            onClick={() => logoutTester()}
            className="text-gray-300 transform hover:text-red-500 cursor-pointer"
          >
            로그아웃 <FontAwesomeIcon className="fa-lg " icon={faSignOutAlt} />
          </div>
        </div>
      </div>
    </header>
  );
};
