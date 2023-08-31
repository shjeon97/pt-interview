import React, { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Pagination } from "../../component/pagination";
import { useOnClickOutside } from "../../hook/useOnClickOutside";
import { ConfirmModel } from "../../component/model";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { apiDeleteOrientaion, apiSearchOrientation } from "../../api/axios";
import {
  ICoreOutput,
  ISearchCoreOutput,
  IDetailImage,
  ICoreInput,
} from "../../api/type";
import { Page, PageSize } from "../../constant";
import queryString from "query-string";
import { PageLoading } from "../../component/page-loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

export const SearchOrientation = () => {
  const query = queryString.parse(window.location.search);
  const naviage = useNavigate();
  const [page, setPage] = useState<number>(query?.page ? +query.page : Page);
  const [pagesize, setPagesize] = useState<number>(
    query?.pagesize ? +query?.pagesize : +PageSize()
  );
  const [orientation, setOrientation] = useState<IDetailImage>();
  const queryClient = useQueryClient();

  const {
    data: searchOrientationData,
    isLoading: searchOrientationIsLoading,
    error: searchOrientationError,
  } = useQuery<ISearchCoreOutput>(
    [
      "searchOrientation",
      "pagesize:" + pagesize,
      "page:" + page,
      "normId:" + query.normid,
    ],
    () =>
      apiSearchOrientation({
        pagesize,
        page,
        normId: query.normid ? +query.normid : -1,
      }),
    {
      onSuccess: () => {
        naviage(
          `/search-orientation?pagesize=${pagesize}&page=${page}&normid=${
            query.normid ? +query.normid : -1
          }`
        );
      },
    }
  );

  const deleteOrientationMutation = useMutation(apiDeleteOrientaion, {
    onSuccess: (data: ICoreOutput) => {
      if (data.ok) {
        queryClient.invalidateQueries([
          "searchOrientation",
          "pagesize:" + pagesize,
          "page:" + page,
        ]);
        setDeleteOrientationModelOpen(false);
      } else if (data.error) {
        Swal.fire({
          icon: "error",
          title: data.error,
        });
      }
    },
  });

  const deleteOrientationModelRef = useRef(null);
  const [isDeleteOrientationModelOpen, setDeleteOrientationModelOpen] =
    useState(false);
  useOnClickOutside(deleteOrientationModelRef, () => {
    if (isDeleteOrientationModelOpen) setDeleteOrientationModelOpen(false);
  });
  const onClickDeleteOrientationButton = (orientation: IDetailImage) => {
    setOrientation(orientation);
    setDeleteOrientationModelOpen(!isDeleteOrientationModelOpen);
  };
  const nextDeleteOrientation = ({ normId, page }: ICoreInput) => {
    deleteOrientationMutation.mutate({ normId, page });
  };

  if (
    !searchOrientationData ||
    searchOrientationIsLoading ||
    searchOrientationError
  ) {
    return <PageLoading text="OT 가져오는 중" />;
  }
  return (
    <>
      <div className="  max-w-lg mx-auto flex justify-center items-center min-w-min">
        <Helmet>
          <title>OT 목록</title>
        </Helmet>
        <div className=" w-full text-center p-2">
          <div className=" text-xl mt-3">OT 리스트</div>
          <div className="w-full font-bold text-left mb-2">
            <Link className="hover:underline " to={`/search-norm`}>
              규준 목록 <FontAwesomeIcon icon={faChevronRight} />
            </Link>
            <span> OT</span>
          </div>
          <div className=" mx-auto flex justify-between items-center ">
            <div className=" flex justify-between items-center w-full">
              <div className="flex-wrap">
                <Link
                  className="focus:outline-none text-gray-800 text-sm py-1.5 px-3 select-none border border-gray-800 hover:bg-gray-200"
                  to={`/create-orientation?normid=${
                    query.normid ? +query.normid : -1
                  }`}
                >
                  OT 등록
                </Link>
              </div>
            </div>

            <div className="flex-wrap">
              {searchOrientationData?.totalPage >= 1 && (
                <Pagination
                  page={page}
                  pageSize={pagesize}
                  isPageSize={true}
                  totalPage={searchOrientationData?.totalPage}
                  setPage={setPage}
                  setPageSize={setPagesize}
                />
              )}
            </div>
          </div>
          <table className=" my-2 table-auto min-w-max  w-full bg-white shadow-md rounded select-none ">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">페이지 번호</th>
                <th className="py-3 px-6 text-left">이미지</th>
                <th className="py-3 px-6 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 text-sm font-light">
              {searchOrientationData.result?.map(
                (orientation: IDetailImage) => (
                  <tr
                    key={orientation.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-left ">{orientation.page}</td>
                    <td className="py-3 px-6 text-left ">
                      <div
                        onClick={() =>
                          window.open(
                            orientation.imageUrl,
                            "new",
                            "scrollbars=yes,resizable=no width=700 height=700, left=0,top=0"
                          )
                        }
                        className="focus:outline-none w-12 text-center text-gray-800 text-sm py-1 px-1 select-none border border-gray-800 hover:bg-gray-200"
                      >
                        보기
                      </div>
                    </td>

                    <td className="py-3 px-6 text-center">
                      <Link
                        to={`/edit-orientation?normid=${orientation.normId}&page=${orientation.page}`}
                      >
                        <FontAwesomeIcon
                          className="fa-lg mx-1 transform hover:text-purple-500 hover:scale-110"
                          icon={faPen}
                        />
                      </Link>
                      <FontAwesomeIcon
                        icon={faTrash}
                        onClick={() => {
                          onClickDeleteOrientationButton(orientation);
                        }}
                        className="mx-1  fa-lg transform hover:text-red-500 hover:scale-110"
                      />
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
          {searchOrientationData?.totalPage >= 1 && (
            <Pagination
              page={page}
              pageSize={pagesize}
              isPageSize={false}
              totalPage={searchOrientationData?.totalPage}
              setPage={setPage}
              setPageSize={setPagesize}
            />
          )}
        </div>
      </div>

      {/* model list */}
      {isDeleteOrientationModelOpen && (
        <ConfirmModel
          next={nextDeleteOrientation}
          prop={{ normId: orientation?.normId, page: orientation?.page }}
          isModelOpen={isDeleteOrientationModelOpen}
          setModelOpen={setDeleteOrientationModelOpen}
          actionText={`OT : ${orientation?.page}페이지 삭제`}
        />
      )}
    </>
  );
};
