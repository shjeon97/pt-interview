import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import moment from "moment";
import { Pagination } from "../../component/pagination";
import { ConfirmModel } from "../../component/model";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { apiSearchGroup, apiDeleteGroup, apiMe } from "../../api/axios";
import {
  ISearchGroupOutput,
  ICoreOutput,
  IGroup,
  IMeOutput,
  IFormSearchInput,
} from "../../api/type";
import { Page, PageSize, UserRole } from "../../constant";
import queryString from "query-string";
import { PageLoading } from "../../component/page-loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

export const SearchGroup = () => {
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
  const [group, setGroup] = useState<IGroup>();
  const queryClient = useQueryClient();
  const { data: meData, isLoading: meIsLoading } = useQuery<IMeOutput>(
    "me",
    apiMe
  );

  const { register, handleSubmit, getValues } = useForm<IFormSearchInput>({
    mode: "onChange",
  });

  const {
    data: searchGroupData,
    isLoading: searchGroupIsLoading,
    error: searchGroupError,
  } = useQuery<ISearchGroupOutput>(
    [
      "searchGroup",
      "pagesize:" + pagesize,
      "page:" + page,
      `${
        searchType && searchValue
          ? "searchType:" + searchType + ", searchValue:" + searchValue
          : "search:false"
      }`,
    ],
    () => apiSearchGroup({ pagesize, page, searchType, searchValue }),
    {
      onSuccess: () => {
        if (searchType && searchValue) {
          naviage(
            `/search-group?pagesize=${pagesize}&page=${page}&search_type=${searchType}&search_value=${searchValue}`
          );
        } else {
          naviage(`/search-group?pagesize=${pagesize}&page=${page}`);
        }
      },
    }
  );

  const deleteGroupMutation = useMutation(apiDeleteGroup, {
    onSuccess: (data: ICoreOutput) => {
      if (data.ok) {
        queryClient.invalidateQueries([
          "searchGroup",
          "pagesize:" + pagesize,
          "page:" + page,
        ]);
        setDeleteGroupModelOpen(false);
      } else if (data.error) {
        Swal.fire({
          icon: "error",
          title: data.error,
        });
      }
    },
  });

  const [isDeleteGroupModelOpen, setDeleteGroupModelOpen] = useState(false);

  const onClickDeleteGroupButton = (group: IGroup) => {
    setGroup(group);
    setDeleteGroupModelOpen(!isDeleteGroupModelOpen);
  };

  const nextDeleteGroup = (groupId: number) => {
    deleteGroupMutation.mutate(groupId);
  };

  const onSearchSubmit = () => {
    if (!searchGroupIsLoading) {
      const { searchType, searchValue } = getValues();
      setSearchType(searchType);
      setSearchValue(searchValue);
      setPage(1);
    }
  };

  if (
    !searchGroupData ||
    searchGroupIsLoading ||
    searchGroupError ||
    !meData ||
    meIsLoading
  ) {
    return <PageLoading text="공고 가져오는 중" />;
  }

  return (
    <>
      <div className="  max-w-6xl mx-auto flex justify-center items-center min-w-min">
        <Helmet>
          <title>전체 공고</title>
        </Helmet>
        <div className=" w-full text-center p-2">
          <div className="text-2xl my-3">전체 공고 리스트</div>
          <div className="max-w-6xl mx-auto flex justify-between  ">
            <form className="flex" onSubmit={handleSubmit(onSearchSubmit)}>
              <div className="focus:outline-none text-gray-800 text-sm py-1.5 px-3 select-none border border-gray-400 border-r-0">
                검색
              </div>
              <select
                {...register("searchType")}
                className="border border-gray-400 py-1 px-3 rounded-r-md mr-2"
              >
                <option value="name">공고명</option>
                {/* <option value="norm">규준</option> */}
              </select>

              <input
                {...register("searchValue")}
                className=" border border-gray-400 shadow-inner  focus: outline-none   py-1 px-3 rounded-md rounded-r-none "
                placeholder="검색값을 입력하세요."
              />
              <div className="focus:outline-none text-gray-800 text-sm py-1.5 px-3 select-none border border-gray-400 border-l-0 hover:bg-gray-200">
                <button>{searchGroupIsLoading ? "Loading..." : "찾기"}</button>
              </div>
              <div
                onClick={() => {
                  naviage(`/search-group?pagesize=${PageSize()}&page=${Page}`);
                  window.location.reload();
                }}
                className="focus:outline-none text-gray-800 text-sm py-1.5 px-3 select-none border border-gray-400 ml-2 hover:bg-gray-200"
              >
                전체
              </div>
            </form>

            <div className="flex">
              {searchGroupData?.totalPage >= 1 && (
                <Pagination
                  page={page}
                  pageSize={pagesize}
                  isPageSize={true}
                  totalPage={searchGroupData?.totalPage}
                  setPage={setPage}
                  setPageSize={setPagesize}
                />
              )}

              {meData.role === UserRole.SuperAdmin && (
                <Link
                  className="focus:outline-none w-32 text-gray-800 text-sm h-8 pt-1  px-3 select-none border border-gray-700 hover:bg-gray-200"
                  to={`/create-group`}
                >
                  공고 등록
                </Link>
              )}
            </div>
          </div>

          <table className=" my-2 table-auto min-w-max  w-full bg-white shadow-md rounded select-none ">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">번호</th>
                <th className="py-3 px-6 text-left">면접공고</th>
                <th className="py-3 px-6 text-center">규준</th>
                <th className="py-3 px-6 text-center">시작일</th>
                <th className="py-3 px-6 text-center">종료일</th>
                {meData.role === UserRole.SuperAdmin && (
                  <th className="py-3 px-6 text-center">관리</th>
                )}
              </tr>
            </thead>
            <tbody className="text-gray-800 text-sm font-light">
              {searchGroupData.result?.map((group: IGroup, index: number) => (
                <tr
                  key={group.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left ">
                    {searchGroupData.totalResult &&
                      searchGroupData.totalResult -
                        (page - 1) * pagesize -
                        index}
                  </td>
                  <td className="py-3 px-6 text-left hover:underline">
                    <Link to={`/detail-group/${group.id}`}>{group.name} </Link>
                  </td>
                  <td className="py-3 px-6 text-center">{group.norm.name}</td>
                  <td className="py-3 px-6 text-center">
                    {moment(group.startDate).format("llll")}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {moment(group.endDate).format("llll")}
                  </td>
                  {meData.role === UserRole.SuperAdmin && (
                    <td className="py-3  px-6  text-center flex item-center justify-center ">
                      <Link
                        to={`/edit-group/${group.id}`}
                        className=" mx-1 transform hover:text-purple-500 hover:scale-110"
                      >
                        <FontAwesomeIcon className="fa-lg" icon={faPen} />
                      </Link>
                      <FontAwesomeIcon
                        icon={faTrash}
                        onClick={() => {
                          onClickDeleteGroupButton(group);
                        }}
                        className="mx-1 fa-lg transform hover:text-red-500 hover:scale-110"
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {searchGroupData?.totalPage >= 1 && (
            <Pagination
              page={page}
              pageSize={pagesize}
              isPageSize={false}
              totalPage={searchGroupData?.totalPage}
              setPage={setPage}
              setPageSize={setPagesize}
            />
          )}
        </div>
      </div>

      {/* model list */}
      {isDeleteGroupModelOpen && (
        <ConfirmModel
          next={nextDeleteGroup}
          prop={group?.id}
          isModelOpen={isDeleteGroupModelOpen}
          setModelOpen={setDeleteGroupModelOpen}
          actionText={`면접공고 이름 :  ${group?.name} 삭제`}
        />
      )}
    </>
  );
};
