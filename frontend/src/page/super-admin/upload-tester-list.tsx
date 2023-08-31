import { faChevronRight, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import {
  apiDownloadGroup,
  apiDownloadTamplate,
  apiUploadUserList,
} from "../../api/axios";
import { ICoreOutput, ICreateUser } from "../../api/type";
import { Page, PageSize, UserRole } from "../../constant";
import { excelToJson } from "../../hook/useXlsx";
import Swal from "sweetalert2";

export const UploadTesterList = () => {
  const [testerList, setTesterList] =
    useState<
      { name: string; password: string; groupId: number; ptTime: string }[]
    >();
  const naviage = useNavigate();

  const uploadTesterListMutation = useMutation(apiUploadUserList, {
    onSuccess: (data: ICoreOutput) => {
      if (data.ok) {
        Swal.fire({
          icon: "success",
          title: "지원자 리스트 업로드 완료",
          showConfirmButton: false,
          timer: 1300,
        });

        naviage(`/search-tester?pagesize=${PageSize()}&page=${Page}`);
      } else {
        Swal.fire({
          icon: "error",
          title: data.error,
        });
      }
    },
  });

  const onSubmit = async () => {
    if (!uploadTesterListMutation.isLoading && testerList) {
      let uploadTesterList: ICreateUser[] = [];
      testerList.map((tester) => {
        if (typeof +tester.groupId === "number") {
          return uploadTesterList.push({
            name: tester.name,
            password: tester.password,
            groupIdList: [tester.groupId],
            ptTime: tester.ptTime,
          });
        } else {
          throw Swal.fire({
            icon: "error",
            title: "잘못된 형식입니다",
          });
        }
      });

      uploadTesterListMutation.mutate({
        userList: uploadTesterList,
        role: UserRole.Tester,
      });
    }
  };

  return (
    <div className="mt-5 max-w-3xl mx-auto rounded-2xl flex flex-col justify-center items-center p-10 ">
      <Helmet>
        <title>지원자 단체 등록</title>
      </Helmet>
      <h4 className="font-semibold text-2xl  text-center">지원자 단체 등록</h4>
      <div className="w-full font-bold text-left  flex justify-between items-center ">
        <div>
          <Link className="hover:underline " to={`/search-tester`}>
            지원자 목록 <FontAwesomeIcon icon={faChevronRight} />
          </Link>
          <Link className="hover:underline " to={`/create-tester`}>
            {" "}
            등록 <FontAwesomeIcon icon={faChevronRight} />
          </Link>
          <span> 단체 등록</span>
        </div>
      </div>
      <hr className=" w-full border-gray-300 m-4" />
      <form className="grid grid-cols-none gap-3 mt-5 w-full mb-5 font-bold">
        <div className="col-start-1 col-end-13 row-end-auto flex justify-between">
          <label className="mb-2 text-md text-gray-900 dark:text-gray-300">
            명단 업로드
          </label>

          <div className="flex">
            <div
              className="mr-2   focus:outline-none text-green-600 text-sm py-1 px-2 rounded-md border border-green-600 hover:bg-green-50 w-max"
              onClick={() => apiDownloadTamplate("upload-template-tester.xlsx")}
            >
              템플릿 <FontAwesomeIcon icon={faFileExcel} />
            </div>
            <div
              className=" focus:outline-none text-green-600 text-sm py-1 px-2 rounded-md border border-green-600 hover:bg-green-50 w-max"
              onClick={() => apiDownloadGroup("download-norm.xlsx")}
            >
              공고정보 <FontAwesomeIcon icon={faFileExcel} />
            </div>
          </div>
        </div>
        <input
          className=" col-start-1 col-end-13 row-end-auto form-control w-full border border-solid border-gray-300 rounded transition hover:text-gray-600 hover:bg-gray-200 "
          type="file"
          onChange={(e) => excelToJson(e.target, setTesterList)}
        />

        {testerList && testerList[0]?.password && (
          <div className=" col-start-auto  grid auto-rows-max">
            <div className="flex justify-between items-center my-3">
              <h5 className=" font-extrabold text-lg">EXCEL Data</h5>
              <div
                onClick={() => onSubmit()}
                className={`ml-10 p-1 bg-gray-600   text-center rounded-md cursor-pointer text-white hover:bg-gray-500 ${
                  !uploadTesterListMutation.isLoading
                    ? "bg-gray-800 hover:bg-gray-700 w-16"
                    : "bg-gray-300 pointer-events-none w-20 "
                }`}
              >
                {!uploadTesterListMutation.isLoading ? "등록" : "Loading"}
              </div>
            </div>
            <div>
              <div className=" col-auto row-end-2 overflow-x-auto h-96 ">
                <table className=" text-center ">
                  <thead>
                    <tr>
                      <td className="bg-gray-200  sticky z-10 top-0 p-2 border border-t-0 border-b-0 border-solid border-gray-800 ">
                        Name
                      </td>
                      <td className="bg-gray-200 sticky z-10 top-0 p-2 border border-b-0 border-t-0 border-solid border-gray-800 ">
                        Password
                      </td>
                      <td className="bg-gray-200 sticky z-10 top-0 p-2 border border-b-0 border-t-0 border-solid border-gray-800">
                        PT Time
                      </td>
                      <td className="bg-gray-200 sticky z-10 top-0 p-2 border border-b-0 border-t-0 border-solid border-gray-800 ">
                        GroupId List
                      </td>
                    </tr>
                  </thead>
                  <tbody className="align-baseline">
                    {testerList.map((tester) => {
                      return (
                        <tr key={tester.name}>
                          <td className=" p-2 border border-solid border-gray-800 ">
                            {tester.name}
                          </td>
                          <td className=" p-2 border border-solid border-gray-800 ">
                            {tester.password}
                          </td>
                          <td className=" p-2 border border-solid border-gray-800 ">
                            {tester.ptTime}
                          </td>
                          <td className=" p-2 border border-solid border-gray-800 ">
                            {tester.groupId}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
