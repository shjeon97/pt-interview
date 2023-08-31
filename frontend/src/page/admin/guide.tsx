import React, { useState } from "react";
import queryString from "query-string";
import { useQuery } from "react-query";
import { apiFindGuideListRelatedToRorm } from "../../api/axios";
import { IFindGuideRelatedToNormOutput } from "../../api/type";
import { Helmet } from "react-helmet-async";
import { Pagination } from "../../component/pagination";

export const Guide = () => {
  const query = queryString.parse(window.location.search);
  const [page, setPage] = useState(1);
  const normId: number = query.normid ? +query.normid : -1;

  const { data, isLoading } = useQuery<IFindGuideRelatedToNormOutput>(
    ["guide", `normId:${normId}`],
    () => apiFindGuideListRelatedToRorm(normId)
  );

  if (!data || isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">
          가이드 가져오는 중...
        </span>
      </div>
    );
  }
  return (
    <div className="max-w-6xl  mx-auto mt-50 flex flex-col justify-center items-center">
      <Helmet>
        <title>가이드</title>
      </Helmet>
      <div className=" flex justify-center items-center">
        {data?.totalPage && (
          <Pagination
            page={page}
            pageSize={1}
            isPageSize={false}
            totalPage={data?.totalPage}
            setPage={setPage}
            setPageSize={null}
          />
        )}
      </div>

      <div className=" mx-auto">
        {data.ok && data.guideList && (
          <img
            className=" w-screen"
            src={data.guideList[page - 1].imageUrl}
            alt=""
          />
        )}
      </div>
      <div className=" flex justify-center items-center">
        {data?.totalPage && (
          <Pagination
            page={page}
            pageSize={1}
            isPageSize={false}
            totalPage={data?.totalPage}
            setPage={setPage}
            setPageSize={null}
          />
        )}
      </div>
    </div>
  );
};
