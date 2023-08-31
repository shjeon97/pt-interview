import React, { useCallback, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import moment from "moment";
import { Pagination } from "../../component/pagination";
import { useOnClickOutside } from "../../hook/useOnClickOutside";
import { ConfirmModel } from "../../component/model";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { apiDeleteUser, apiSearchUser } from "../../api/axios";
import {
  ICoreOutput,
  IUser,
  ISearchUserOutput,
  IGroup,
  IFormSearchInput,
} from "../../api/type";
import { Page, PageSize, UserRole } from "../../constant";
import queryString from "query-string";
import { PageLoading } from "../../component/page-loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

export const SearchAdmin = () => {
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
  const [admin, setAdmin] = useState<IUser>();
  const [checkedList, setCheckedList] = useState<number[]>([]);
  const queryClient = useQueryClient();

  const { register, handleSubmit, getValues } = useForm<IFormSearchInput>({
    mode: "onChange",
  });

  const {
    data: searchAdminData,
    isLoading: searchAdminIsLoading,
    error: searchAdminError,
  } = useQuery<ISearchUserOutput>(
    [
      "searchAdmin",
      "pagesize:" + pagesize,
      "page:" + page,
      `${
        searchType && searchValue
          ? "searchType:" + searchType + ", searchValue:" + searchValue
          : "search:false"
      }`,
    ],
    () =>
      apiSearchUser({
        pagesize,
        page,
        searchType,
        searchValue,
        role: UserRole.Admin,
      }),
    {
      onSuccess: () => {
        setCheckedList([]);
        if (searchType && searchValue) {
          naviage(
            `/search-admin?pagesize=${pagesize}&page=${page}&search_type=${searchType}&search_value=${searchValue}`
          );
        } else {
          naviage(`/search-admin?pagesize=${pagesize}&page=${page}`);
        }
      },
    }
  );
  const deleteAdminMutation = useMutation(apiDeleteUser, {
    onSuccess: (data: ICoreOutput) => {
      if (data.ok) {
        queryClient.invalidateQueries([
          "searchAdmin",
          "pagesize:" + pagesize,
          "page:" + page,
        ]);
        setDeleteAdminModelOpen(false);
      } else if (data.error) {
        Swal.fire({
          icon: "error",
          title: data.error,
        });
      }
    },
  });
  const deleteAdminModelRef = useRef(null);

  const [isDeleteAdminModelOpen, setDeleteAdminModelOpen] = useState(false);

  useOnClickOutside(deleteAdminModelRef, () => {
    if (isDeleteAdminModelOpen) setDeleteAdminModelOpen(false);
  });

  const onClickDeleteAdminButton = (admin: IUser) => {
    setAdmin(admin);
    setDeleteAdminModelOpen(!isDeleteAdminModelOpen);
  };

  const nextDeleteAdmin = (adminId: number) => {
    deleteAdminMutation.mutate(adminId);
  };

  const onClikeDeleteAdminListButton = () => {
    if (checkedList.length <= 0) {
      Swal.fire({
        icon: "error",
        titleText: "삭제할 내용을 선택해주세요",
      });
    } else {
      Swal.fire({
        title: "선택 삭제",
        text: "삭제된 정보는 복구할 수 없습니다. 정말 삭제하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "삭제",
        cancelButtonText: "취소",
      }).then((result) => {
        if (result.isConfirmed) {
          checkedList.forEach((testerId) => {
            deleteAdminMutation.mutate(testerId);
          });
          setCheckedList([]);
        }
      });
    }
  };

  const onSearchSubmit = () => {
    if (!searchAdminIsLoading) {
      setCheckedList([]);
      const { searchType, searchValue } = getValues();
      setSearchType(searchType);
      setSearchValue(searchValue);
      setPage(1);
    }
  };

  // 전체 체크 클릭 시 발생하는 함수
  const onCheckedAll = useCallback(
    (checked) => {
      if (checked && searchAdminData?.result) {
        const checkedListArray: number[] = [];

        searchAdminData?.result.forEach((admin) =>
          checkedListArray.push(admin.id)
        );

        setCheckedList(checkedListArray);
      } else {
        setCheckedList([]);
      }
    },
    [searchAdminData]
  );

  // 개별 체크 클릭 시 발생하는 함수
  const onCheckedElement = useCallback(
    (checked, adminId) => {
      if (checked) {
        setCheckedList([...checkedList, adminId]);
      } else {
        setCheckedList(checkedList.filter((el) => el !== adminId));
      }
    },
    [checkedList]
  );

  if (!searchAdminData || searchAdminIsLoading || searchAdminError) {
    return <PageLoading text="면접위원 가져오는 중" />;
  }
  return (
    <>
      <div className="  max-w-6xl mx-auto flex justify-center items-center min-w-min">
        <Helmet>
          <title>면접위원 목록</title>
        </Helmet>
        <div className=" w-full text-center p-2">
          <div className=" text-2xl my-3">면접위원 리스트</div>

          <div className="max-w-6xl mx-auto flex justify-between items-center min-w-max ">
            <form className="flex" onSubmit={handleSubmit(onSearchSubmit)}>
              <div className="focus:outline-none text-gray-800 text-sm py-1.5 px-3 select-none border border-gray-400 border-r-0">
                검색
              </div>
              <select
                {...register("searchType")}
                className="border border-gray-400 py-1 px-3 rounded-r-md mr-2"
              >
                <option value="name">이름</option>
                <option value="groupName">공고명</option>
              </select>

              <input
                {...register("searchValue")}
                className=" border border-gray-400 shadow-inner  focus: outline-none   py-1 px-3 rounded-md rounded-r-none "
                placeholder="검색값을 입력하세요."
              />
              <div className="focus:outline-none text-gray-800 text-sm py-1.5 px-3 select-none border border-gray-400 border-l-0 hover:bg-gray-200">
                <button>{searchAdminIsLoading ? "Loading..." : "찾기"}</button>
              </div>
              <div
                onClick={() => {
                  naviage(`/search-admin?pagesize=${PageSize()}&page=${Page}`);
                  window.location.reload();
                }}
                className="focus:outline-none text-gray-800 text-sm py-1.5 px-3 select-none border border-gray-400 ml-2 hover:bg-gray-200"
              >
                전체
              </div>
            </form>
            <div className="flex">
              {searchAdminData?.totalPage >= 1 && (
                <Pagination
                  page={page}
                  pageSize={pagesize}
                  isPageSize={true}
                  totalPage={searchAdminData?.totalPage}
                  setPage={setPage}
                  setPageSize={setPagesize}
                />
              )}
              <Link
                className="ml-2 focus:outline-none min-w-max text-gray-800 text-sm h-8 pt-1  px-3 select-none border border-gray-700 hover:bg-gray-200"
                to={`/create-admin`}
              >
                면접위원 등록
              </Link>
              {checkedList.length > 0 && (
                <div
                  className="ml-2 focus:outline-none min-w-max  text-white text-sm h-8 pt-1  px-3 select-none border border-gray-700 bg-red-500 hover:bg-red-600"
                  onClick={() => {
                    onClikeDeleteAdminListButton();
                  }}
                >
                  선택 삭제
                </div>
              )}
            </div>
          </div>
          <table className=" my-2 table-auto min-w-max  w-full bg-white shadow-md rounded select-none ">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 pl-6 text-left">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4"
                    onChange={(e) => onCheckedAll(e.target.checked)}
                    checked={
                      checkedList.length === 0
                        ? false
                        : checkedList.length === searchAdminData?.result?.length
                        ? true
                        : false
                    }
                  />
                </th>
                <th className="py-3 px-6 text-left">번호</th>
                <th className="py-3 px-6 text-left">이름</th>
                <th className="py-3 px-6 text-left">비밀번호</th>
                <th className="py-3 px-6 text-left">공고 리스트</th>
                <th className="py-3 px-6 text-center">생성일자</th>
                <th className="py-3 px-6 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 text-sm font-light">
              {searchAdminData.result?.map((admin: IUser, index: number) => (
                <tr
                  key={admin.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 pl-6 text-left ">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-gray-600"
                      onChange={(e) =>
                        onCheckedElement(e.target.checked, admin.id)
                      }
                      checked={checkedList.includes(admin.id) ? true : false}
                    />
                  </td>
                  <td className="py-3 px-6 text-left ">
                    {searchAdminData.totalResult &&
                      searchAdminData.totalResult -
                        (page - 1) * pagesize -
                        index}
                  </td>
                  <td className="py-3 px-6 text-left ">{admin.name}</td>
                  <td className="py-3 px-6 text-left ">{admin.password}</td>
                  <td className="py-3 px-6 text-left ">
                    {admin.group?.map((group: IGroup) => {
                      return " [" + group.name + "] ";
                    })}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {moment(admin.createdAt).format("ll")}
                  </td>

                  <td className="py-3 px-6 text-center">
                    <Link to={`/edit-admin/${admin.id}`}>
                      <FontAwesomeIcon
                        className="fa-lg mx-1 transform hover:text-purple-500 hover:scale-110"
                        icon={faPen}
                      />
                    </Link>
                    <FontAwesomeIcon
                      icon={faTrash}
                      onClick={() => {
                        onClickDeleteAdminButton(admin);
                      }}
                      className="mx-1  fa-lg transform hover:text-red-500 hover:scale-110"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {searchAdminData?.totalPage >= 1 && (
            <Pagination
              page={page}
              pageSize={pagesize}
              isPageSize={false}
              totalPage={searchAdminData?.totalPage}
              setPage={setPage}
              setPageSize={setPagesize}
            />
          )}
        </div>
      </div>

      {/* model list */}
      {isDeleteAdminModelOpen && (
        <ConfirmModel
          next={nextDeleteAdmin}
          prop={admin?.id}
          isModelOpen={isDeleteAdminModelOpen}
          setModelOpen={setDeleteAdminModelOpen}
          actionText={`면접위원 이름 : ${admin?.name} 삭제`}
        />
      )}
    </>
  );
};
