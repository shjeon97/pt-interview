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

export const UploadAdminList = () => {
  const [adminList, setAdminList] =
    useState<{ name: string; password: string; groupIdList: string }[]>();
  const naviage = useNavigate();

  const uploadAdminListMutation = useMutation(apiUploadUserList, {
    onSuccess: (data: ICoreOutput) => {
      if (data.ok) {
        Swal.fire({
          icon: "success",
          title: "면접위원 리스트 업로드 완료",
          showConfirmButton: false,
          timer: 1300,
        });

        naviage(`/search-admin?pagesize=${PageSize()}&page=${Page}`);
      } else {
        Swal.fire({
          icon: "error",
          title: data.error,
        });
      }
    },
  });

  const onSubmit = async () => {
    if (!uploadAdminListMutation.isLoading && adminList) {
      let uploadAdminList: ICreateUser[] = [];
      adminList.map((admin) => {
        if (typeof admin.groupIdList === "string") {
          const list = admin.groupIdList.split(",");
          const groupIdList: number[] = [];
          list.map((groupId) => {
            if (typeof +groupId === "number") {
              return groupIdList.push(+groupId);
            } else {
              throw Swal.fire({
                icon: "error",
                title: "잘못된 형식입니다",
              });
            }
          });

          return uploadAdminList.push({
            name: admin.name,
            password: admin.password,
            groupIdList,
          });
        } else if (typeof admin.groupIdList === "number") {
          return uploadAdminList.push({
            name: admin.name,
            password: admin.password,
            groupIdList: [admin.groupIdList],
          });
        } else {
          throw Swal.fire({
            icon: "error",
            title: "잘못된 형식입니다",
          });
        }
      });

      uploadAdminListMutation.mutate({
        userList: uploadAdminList,
        role: UserRole.Admin,
      });
    }
  };

  return (
    <div className="mt-5 max-w-3xl mx-auto rounded-2xl flex flex-col font-bold justify-center items-center p-10 ">
      <Helmet>
        <title>면접위원 단체 등록</title>
      </Helmet>
      <div className="  w-full  mx-auto flex justify-center items-center ">
        <h4 className="font-semibold text-2xl mb-3">면접위원 단체 등록</h4>
      </div>
      <div className="  w-full  mx-auto flex justify-between items-center ">
        <div>
          <Link className="hover:underline " to={`/search-admin`}>
            면접위원 목록 <FontAwesomeIcon icon={faChevronRight} />
          </Link>
          <Link className="hover:underline " to={`/create-admin`}>
            {" "}
            등록 <FontAwesomeIcon icon={faChevronRight} />
          </Link>
          <span> 단체 등록</span>
        </div>
      </div>
      <hr className=" w-full border-gray-300 my-4" />
      <form className="grid grid-cols-none gap-3 w-full mt-5 mb-5">
        <div className="col-start-1 col-end-13 row-end-auto flex justify-between">
          <label className="block mb-2 text-md text-gray-900 dark:text-gray-300">
            명단 업로드
          </label>
          <div className="flex">
            <div
              className="mr-2 focus:outline-none text-green-600 text-sm py-1 px-2 rounded-md border border-green-600 hover:bg-green-50 w-max"
              onClick={() => apiDownloadTamplate("upload-template-admin.xlsx")}
            >
              템플릿 <FontAwesomeIcon icon={faFileExcel} />
            </div>
            <div
              className=" focus:outline-none text-green-600 text-sm py-1 px-2 rounded-md border border-green-600 hover:bg-green-50 w-max"
              onClick={() => apiDownloadGroup("download-group.xlsx")}
            >
              공고정보 <FontAwesomeIcon icon={faFileExcel} />
            </div>
          </div>
        </div>
        <input
          className="col-start-1 col-end-13 row-end-auto w-full form-control  border border-solid border-gray-300 rounded transition hover:text-gray-600 hover:bg-gray-200 "
          type="file"
          onChange={(e) => excelToJson(e.target, setAdminList)}
        />
        {adminList && adminList[0]?.password && (
          <div className="col-start-auto col-end-2 grid auto-rows-max">
            <div className="col-start-1 col-end-2 row-end-1 ">
              <div className="flex justify-between items-center my-3">
                <h5 className=" font-extrabold text-lg">EXCEL Data</h5>
                <div
                  onClick={() => onSubmit()}
                  className={`ml-10 p-1 bg-gray-600   text-center rounded-md cursor-pointer text-white hover:bg-gray-500 ${
                    !uploadAdminListMutation.isLoading
                      ? "bg-gray-800 hover:bg-gray-700 w-16"
                      : "bg-gray-300 pointer-events-none w-20 "
                  }`}
                >
                  {!uploadAdminListMutation.isLoading ? "등록" : "Loading"}
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
                      Password
                    </td>
                    <td className="bg-gray-200 sticky z-10 top-0 p-2 border border-b-0 border-t-0 border-solid border-gray-800 ">
                      GroupId List
                    </td>
                  </tr>
                </thead>

                <tbody className="align-baseline">
                  {adminList.map((admin) => {
                    return (
                      <tr key={admin.name}>
                        <td className=" p-2 border border-solid border-gray-800 ">
                          {admin.name}
                        </td>
                        <td className=" p-2 border border-solid border-gray-800 ">
                          {admin.password}
                        </td>
                        <td className=" p-2 border border-solid border-gray-800 ">
                          {admin.groupIdList}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          // <div className="grid grid-cols-2">
          //   <div>
          //     <>
          //       <h5>EXCEL Data</h5>
          //       <table
          //         style={{
          //           textAlign: "center",
          //         }}
          //       >
          //         <thead>
          //           <tr>
          //             <td style={{ padding: "10px", border: "1px solid" }}>
          //               Name
          //             </td>
          //             <td style={{ padding: "10px", border: "1px solid" }}>
          //               Password
          //             </td>
          //             <td style={{ padding: "10px", border: "1px solid" }}>
          //               GroupId List
          //             </td>
          //           </tr>
          //         </thead>
          //         <tbody>
          //           {adminList.map((admin) => {
          //             return (
          //               <tr key={admin.name}>
          //                 <td style={{ padding: "10px", border: "1px solid" }}>
          //                   {admin.name}
          //                 </td>
          //                 <td style={{ padding: "10px", border: "1px solid" }}>
          //                   {admin.password}
          //                 </td>
          //                 <td style={{ padding: "10px", border: "1px solid" }}>
          //                   {admin.groupIdList}
          //                 </td>
          //               </tr>
          //             );
          //           })}
          //         </tbody>
          //       </table>
          //     </>
          //   </div>
          //   <div className="mt-6 w-20">
          //     <div
          //       onClick={() => onSubmit()}
          //       className={`p-2 bg-gray-600 min-w-full text-center rounded-md cursor-pointer text-white hover:bg-gray-500 ${
          //         !uploadAdminListMutation.isLoading
          //           ? "bg-gray-800 hover:bg-gray-700"
          //           : "bg-gray-300 pointer-events-none "
          //       }`}
          //     >
          //       {!uploadAdminListMutation.isLoading ? "등록" : "등록중"}
          //     </div>
          //   </div>
          // </div>
        )}
      </form>
    </div>
  );
};
