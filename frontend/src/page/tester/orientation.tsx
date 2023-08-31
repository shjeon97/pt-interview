import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router";
import { apiSearchOrientation, apiStartTest } from "../../api/axios";
import queryString from "query-string";
import { ICoreOutput, ISearchCoreOutput } from "../../api/type";
import Swal from "sweetalert2";

export const Orientation = () => {
  const query = queryString.parse(window.location.search);

  const naviage = useNavigate();
  const [page, setPage] = useState(1);
  const [pagesize] = useState<number>(1);
  const [normId] = useState(query?.normid ? +query.normid : -1);
  const queryClient = useQueryClient();

  const startTestMutation = useMutation(apiStartTest, {
    onSuccess: (data: ICoreOutput) => {
      if (data.ok) {
        queryClient.invalidateQueries(["me"]);
        naviage(`/test`);
      } else {
        Swal.fire({
          icon: "error",
          title: data.error,
        });
      }
    },
  });

  const {
    data: orientationData,
    isLoading: orientationIsLoading,
    error: orientationError,
  } = useQuery<ISearchCoreOutput>(
    [
      "orientation",
      "normId:" + query.normId,
      "pagesize:" + pagesize,
      "page:" + page,
    ],
    () => apiSearchOrientation({ pagesize, page, normId })
  );

  const startTest = () => {
    if (!startTestMutation.isLoading) {
      startTestMutation.mutate();
    }
  };

  if (
    !orientationData ||
    orientationIsLoading ||
    orientationError ||
    !orientationData?.result
  ) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">
          오리엔테이션 가져오는 중...
        </span>
      </div>
    );
  }

  return (
    <div className="mt-20 flex flex-col justify-center items-center">
      <Helmet>
        <title>오리엔테이션</title>
      </Helmet>
      <div className="max-w-6xl w-full mx-auto">
        <div className="grid grid-cols-none gap-2">
          <div className="col-start-1 col-end-13 row-end-1 ">
            <img
              className=" shadow-lg rounded-lg"
              src={orientationData.result[0]?.imageUrl}
              alt=""
            />
          </div>
          <div className="col-start-1 col-end-13 row-end-2">
            {orientationData.result[0].page === orientationData.totalPage ? (
              <div className="flex justify-between">
                {page > 1 ? (
                  <div
                    onClick={() => setPage(page - 1)}
                    className="py-2 px-3 w-auto cursor-pointer text-center rounded-md bg-green-600 hover:bg-green-700 text-white"
                  >
                    이전
                  </div>
                ) : (
                  <div></div>
                )}
                <div
                  onClick={() => startTest()}
                  className="py-2 px-3 w-auto cursor-pointer text-center rounded-md bg-red-500 hover:bg-red-600 text-white"
                >
                  풀이 시작
                </div>
              </div>
            ) : (
              <div className="flex justify-between">
                {page > 1 ? (
                  <div
                    onClick={() => setPage(page - 1)}
                    className="py-2 px-3 w-auto cursor-pointer text-center rounded-md bg-green-600 hover:bg-green-700 text-white"
                  >
                    이전
                  </div>
                ) : (
                  <div></div>
                )}

                <div
                  onClick={() => setPage(page + 1)}
                  className="py-2 px-3  w-auto  cursor-pointer text-center rounded-md bg-green-600 hover:bg-green-700 text-white"
                >
                  다음
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
