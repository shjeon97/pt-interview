import { faChevronRight, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import {
  apiDownloadNorm,
  apiDownloadTamplate,
  apiUploadGroupList,
} from "../../api/axios";
import { ICoreOutput, IGroup } from "../../api/type";
import { Page, PageSize } from "../../constant";
import { excelToJson } from "../../hook/useXlsx";
import Swal from "sweetalert2";

export const UploadGroupList = () => {
  const [groupList, setGroupList] = useState<IGroup[]>();
  const naviage = useNavigate();
  const uploadGroupListMutation = useMutation(apiUploadGroupList, {
    onSuccess: (data: ICoreOutput) => {
      if (data.ok) {
        Swal.fire({
          icon: "success",
          title: "공고 리스트 업로드 완료",
          showConfirmButton: false,
          timer: 1300,
        });
        naviage(`/search-group?pagesize=${PageSize()}&page=${Page}`);
      } else {
        Swal.fire({
          icon: "error",
          title: data.error,
        });
      }
    },
  });

  const onSubmit = async () => {
    if (!uploadGroupListMutation.isLoading && groupList) {
      uploadGroupListMutation.mutate(groupList);
    }
  };

  return (
    <div className="mt-5 max-w-4xl min-w-max mx-auto rounded-2xl flex flex-col justify-center items-center p-10 ">
      <Helmet>
        <title>공고 단체 등록</title>
      </Helmet>
      <div className="  w-full  mx-auto flex justify-center items-center ">
        <h4 className="font-semibold text-2xl mb-3">공고 단체 등록</h4>
      </div>
      <div className="w-full  mx-auto flex justify-between items-center ">
        <div className="w-full font-bold text-left  flex justify-between items-center ">
          <div>
            <Link className="hover:underline " to={`/search-group`}>
              공고 목록 <FontAwesomeIcon icon={faChevronRight} />
            </Link>
            <Link className="hover:underline " to={`/create-group`}>
              {" "}
              등록 <FontAwesomeIcon icon={faChevronRight} />
            </Link>
            <span> 단체 등록</span>
          </div>
        </div>
      </div>
      <hr className=" w-full border-gray-300 m-4" />
      <form className="grid grid-cols-none gap-3 w-full mt-5 mb-5 font-bold">
        <div className="col-start-1 col-end-13 row-end-auto flex justify-between">
          <label className="block  text-md text-gray-900 dark:text-gray-300">
            공고 업로드
          </label>
          <div className="flex ml-10">
            <div
              className="mr-2 focus:outline-none text-green-600 text-sm py-1 px-2 rounded-md border border-green-600 hover:bg-green-50 w-max"
              onClick={() => apiDownloadTamplate("upload-template-group.xlsx")}
            >
              템플릿 <FontAwesomeIcon icon={faFileExcel} />
            </div>
            <div
              className=" focus:outline-none text-green-600 text-sm py-1 px-2 rounded-md border border-green-600 hover:bg-green-50 w-max"
              onClick={() => apiDownloadNorm("download-norm.xlsx")}
            >
              규준정보 <FontAwesomeIcon icon={faFileExcel} />
            </div>
          </div>
        </div>

        <input
          className="col-start-1 col-end-13 row-end-auto form-control w-full border border-solid border-gray-300 rounded transition hover:text-gray-600 hover:bg-gray-200 "
          type="file"
          onChange={(e) => excelToJson(e.target, setGroupList)}
        />

        {groupList && groupList[0]?.name && (
          <div className="col-auto col-end-2 grid auto-rows-max">
            <div className="col-start-1 col-end-2 row-end-1 ">
              <div className="flex items-center justify-between my-3">
                <h5 className=" font-extrabold  text-lg">EXCEL Data</h5>
                <div
                  onClick={() => onSubmit()}
                  className={`ml-10 p-1 bg-gray-600   text-center rounded-md cursor-pointer text-white hover:bg-gray-500 ${
                    !uploadGroupListMutation.isLoading
                      ? "bg-gray-800 hover:bg-gray-700 w-16"
                      : "bg-gray-300 pointer-events-none w-20 "
                  }`}
                >
                  {!uploadGroupListMutation.isLoading ? "등록" : "Loading"}
                </div>
              </div>
            </div>
            <div className=" col-auto row-end-2 overflow-x-auto h-96">
              <table className="text-center">
                <thead>
                  <tr>
                    <td className="bg-gray-200  sticky z-10 top-0 p-2 border border-t-0 border-b-0 border-solid border-gray-800 ">
                      Name
                    </td>
                    <td className="bg-gray-200 sticky z-10 top-0 p-2 border border-b-0 border-t-0 border-solid border-gray-800 ">
                      NormId
                    </td>
                    <td className="bg-gray-200 sticky z-10 top-0 p-2 border border-b-0 border-t-0 border-solid border-gray-800">
                      StartDate
                    </td>
                    <td className="bg-gray-200 sticky z-10 top-0 p-2 border border-b-0 border-t-0 border-solid border-gray-800 ">
                      EndDate
                    </td>
                  </tr>
                </thead>

                <tbody className="align-baseline">
                  {groupList.map((admin) => {
                    return (
                      <tr key={admin.name}>
                        <td className=" p-2 border border-solid border-gray-800 ">
                          {admin.name}
                        </td>
                        <td className=" p-2 border border-solid border-gray-800 ">
                          {admin.normId}
                        </td>
                        <td className=" p-2 border border-solid border-gray-800 ">
                          {admin.startDate}
                        </td>
                        <td className=" p-2 border border-solid border-gray-800 ">
                          {admin.endDate}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
