import React, { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Pagination } from "../../component/pagination";
import { useOnClickOutside } from "../../hook/useOnClickOutside";
import { ConfirmModel } from "../../component/model";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { apiDeleteNorm, apiSearchNorm } from "../../api/axios";
import {
  ICoreOutput,
  ISearchNormOutput,
  INorm,
  IFormSearchInput,
} from "../../api/type";
import { Page, PageSize } from "../../constant";
import queryString from "query-string";
import { PageLoading } from "../../component/page-loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

export const SearchNorm = () => {
  const query = queryString.parse(window.location.search);
  const naviage = useNavigate();
  const [page, setPage] = useState<number>(query?.page ? +query.page : Page);
  const [pagesize, setPagesize] = useState<number>(
    query?.pagesize ? +query?.pagesize : +PageSize()
  );
  const [searchType, setSearchType] = useState<string>(
    typeof query?.search_type === "string" ? query.search_type : ""
  );
  const [searchValue, setSearchValue] = useState<string>(
    typeof query?.search_value === "string" ? query?.search_value : ""
  );
  const [norm, setNorm] = useState<INorm>();
  const queryClient = useQueryClient();
  const { register, handleSubmit, getValues } = useForm<IFormSearchInput>({
    mode: "onChange",
  });

  const {
    data: searchNormData,
    isLoading: searchNormIsLoading,
    error: searchNormError,
  } = useQuery<ISearchNormOutput>(
    [
      "searchNorm",
      "pagesize:" + pagesize,
      "page:" + page,
      `${
        searchType && searchValue
          ? "searchType:" + searchType + ", searchValue:" + searchValue
          : "search:false"
      }`,
    ],
    () => apiSearchNorm({ pagesize, page, searchType, searchValue }),
    {
      onSuccess: () => {
        if (searchType && searchValue) {
          naviage(
            `/search-norm?pagesize=${pagesize}&page=${page}&search_type=${searchType}&search_value=${searchValue}`
          );
        } else {
          naviage(`/search-norm?pagesize=${pagesize}&page=${page}`);
        }
      },
    }
  );
  const deleteNormMutation = useMutation(apiDeleteNorm, {
    onSuccess: (data: ICoreOutput) => {
      if (data.ok) {
        queryClient.invalidateQueries([
          "searchNorm",
          "pagesize:" + pagesize,
          "page:" + page,
        ]);
        setDeleteNormModelOpen(false);
      } else if (data.error) {
        Swal.fire({
          icon: "error",
          title: data.error,
        });
      }
    },
  });
  const deleteNormModelRef = useRef(null);

  const [isDeleteNormModelOpen, setDeleteNormModelOpen] = useState(false);

  useOnClickOutside(deleteNormModelRef, () => {
    if (isDeleteNormModelOpen) setDeleteNormModelOpen(false);
  });

  const onClickDeleteNormButton = (norm: INorm) => {
    setNorm(norm);
    setDeleteNormModelOpen(!isDeleteNormModelOpen);
  };

  const nextDeleteNorm = (normId: number) => {
    Swal.fire({
      title: "규준 삭제",
      text: "해당 규준에 포함된 모든자료가 삭제됩니다. ex) OT,문제,가이드",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteNormMutation.mutate(normId);
      }
    });
  };

  const onSearchSubmit = () => {
    if (!searchNormIsLoading) {
      const { searchType, searchValue } = getValues();
      setSearchType(searchType);
      setSearchValue(searchValue);
      setPage(1);
    }
  };

  if (!searchNormData || searchNormIsLoading || searchNormError) {
    return <PageLoading text="규준 가져오는 중" />;
  }
  return (
    <>
      <div className="  max-w-4xl mx-auto flex justify-center items-center min-w-min">
        <Helmet>
          <title>규준 목록</title>
        </Helmet>
        <div className=" w-full text-center p-2">
          <div className=" text-2xl my-3">규준 리스트</div>

          <div className="max-w-6xl mx-auto flex justify-between min-w-max ">
            <form className="flex" onSubmit={handleSubmit(onSearchSubmit)}>
              <div className="focus:outline-none text-gray-800 text-sm py-1.5 px-3 select-none border border-gray-400 border-r-0">
                검색
              </div>
              <select
                {...register("searchType")}
                className="border border-gray-400 py-1 px-3 rounded-r-md mr-2"
              >
                <option value="name">규준명</option>
              </select>

              <input
                {...register("searchValue")}
                className=" border border-gray-400 shadow-inner  focus: outline-none   py-1 px-3 rounded-md rounded-r-none "
                placeholder="검색값을 입력하세요."
              />
              <div className="focus:outline-none text-gray-800 text-sm py-1.5 px-3 select-none border border-gray-400 border-l-0 hover:bg-gray-200">
                <button>{searchNormIsLoading ? "Loading..." : "찾기"}</button>
              </div>
              <div
                onClick={() => {
                  naviage(`/search-norm?pagesize=${PageSize()}&page=${Page}`);
                  window.location.reload();
                }}
                className="focus:outline-none text-gray-800 text-sm py-1.5 px-3 select-none border border-gray-400 ml-2 hover:bg-gray-200"
              >
                전체
              </div>
            </form>
            <div className="flex">
              {searchNormData?.totalPage >= 1 && (
                <Pagination
                  page={page}
                  pageSize={pagesize}
                  isPageSize={true}
                  totalPage={searchNormData?.totalPage}
                  setPage={setPage}
                  setPageSize={setPagesize}
                />
              )}
              <Link
                className="focus:outline-none w-32 text-gray-800 text-sm h-8 pt-1  px-3 select-none border border-gray-700 hover:bg-gray-200"
                to={`/create-norm`}
              >
                규준 등록
              </Link>
            </div>
          </div>
          <table className=" my-2 table-auto min-w-max  w-full bg-white shadow-md rounded select-none ">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">번호</th>
                <th className="py-3 px-6 text-left">이름</th>
                <th className="py-3 px-6 text-left">제한시간</th>
                <th className="py-3 px-6 text-center">자료</th>
                <th className="py-3 px-6 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 text-sm font-light">
              {searchNormData.result?.map((norm: INorm, index: number) => (
                <tr
                  key={norm.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left ">
                    {searchNormData.totalResult &&
                      searchNormData.totalResult -
                        (page - 1) * pagesize -
                        index}
                  </td>
                  <td className="py-3 px-6 text-left ">{norm.name}</td>
                  <td className="py-3 px-6 text-left ">{norm.timeLimit}초</td>
                  <td className="py-3 px-6 text-center ">
                    <div className="grid grid-cols-3 justify-center gap-1">
                      <Link
                        className="focus:outline-none text-gray-800 text-sm py-1 px-1 select-none border border-gray-800 hover:bg-gray-200"
                        to={`/search-orientation?pagesize=${pagesize}&page=1&normid=${norm.id}`}
                      >
                        OT
                      </Link>
                      <Link
                        className="focus:outline-none text-gray-800 text-sm py-1 px-1 select-none border border-gray-800 hover:bg-gray-200"
                        to={`/search-question?pagesize=${pagesize}&page=1&normid=${norm.id}`}
                      >
                        문제
                      </Link>
                      <Link
                        className="focus:outline-none text-gray-800 text-sm py-1 px-1 select-none border border-gray-800 hover:bg-gray-200"
                        to={`/search-guide?pagesize=${pagesize}&page=1&normid=${norm.id}`}
                      >
                        가이드
                      </Link>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <Link to={`/edit-norm/${norm.id}`}>
                      <FontAwesomeIcon
                        className="fa-lg mx-1 transform hover:text-purple-500 hover:scale-110"
                        icon={faPen}
                      />
                    </Link>
                    <FontAwesomeIcon
                      icon={faTrash}
                      onClick={() => {
                        onClickDeleteNormButton(norm);
                      }}
                      className="mx-1  fa-lg transform hover:text-red-500 hover:scale-110"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {searchNormData?.totalPage >= 1 && (
            <Pagination
              page={page}
              pageSize={pagesize}
              isPageSize={false}
              totalPage={searchNormData?.totalPage}
              setPage={setPage}
              setPageSize={setPagesize}
            />
          )}
        </div>
      </div>

      {/* model list */}
      {isDeleteNormModelOpen && (
        <ConfirmModel
          next={nextDeleteNorm}
          prop={norm?.id}
          isModelOpen={isDeleteNormModelOpen}
          setModelOpen={setDeleteNormModelOpen}
          actionText={`규준 이름 : ${norm?.name} 삭제`}
        />
      )}
    </>
  );
};
