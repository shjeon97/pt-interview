import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { FormError } from "../../component/form-error";
import { useMutation, useQuery } from "react-query";
import { apiCreateGuide, apiSearchGuide } from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { Page, PageSize } from "../../constant";
import { ICoreOutput, ISearchCoreOutput } from "../../api/type";
import { Link } from "react-router-dom";
import queryString from "query-string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

interface ICreateGuideFromInput {
  file: any;
}

export const CreateGuide = () => {
  const query = queryString.parse(window.location.search);
  const naviage = useNavigate();
  const [page] = useState<number>(query?.page ? +query.page : Page);
  const [pagesize] = useState<number>(+PageSize());
  const [imageSrc, setImageSrc] = useState("");

  if (!query.normid) {
    Swal.fire({
      icon: "error",
      title: "존재하지 않는 규준입니다",
    });
    naviage(-1);
  }

  const encodeFileToBase64 = (fileBlob: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);
    return new Promise<void>((resolve) => {
      reader.onload = () => {
        setImageSrc(reader?.result + "");
        resolve();
      };
    });
  };

  const { data: searchGuideData } = useQuery<ISearchCoreOutput>(
    [
      "searchGuide",
      "pagesize:" + pagesize,
      "page:" + page,
      "normId:" + query.normid,
    ],
    () =>
      apiSearchGuide({
        pagesize,
        page,
        normId: query.normid ? +query.normid : -1,
      })
  );

  const createGuideMutation = useMutation(apiCreateGuide, {
    onSuccess: (data: ICoreOutput) => {
      if (data.ok) {
        Swal.fire({
          icon: "success",
          title: "가이드 생성 완료",
          showConfirmButton: false,
          timer: 1300,
        });
        naviage(
          `/search-guide?pagesize=${pagesize}&page=1&normid=${query.normid}`
        );
      }
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    reset,
  } = useForm<ICreateGuideFromInput>({
    mode: "onChange",
  });

  const onSubmit = () => {
    if (
      !createGuideMutation.isLoading &&
      typeof searchGuideData?.totalResult === "number" &&
      query.normid
    ) {
      const { file } = getValues();
      createGuideMutation.mutate({
        page: searchGuideData?.totalResult + 1,
        normId: +query.normid,
        file: file[0],
      });
    }
  };

  if (isValid) {
    const { file } = getValues();
    if (file) {
      encodeFileToBase64(file[0]);
    }
  }

  return (
    <div className="mt-5 max-w-5xl mx-auto rounded-2xl  flex flex-col justify-center items-center p-10 font-bold">
      <Helmet>
        <title>가이드 등록</title>
      </Helmet>
      <div className="grid grid-cols-1 grid-rows-none  w-full  mx-auto grid-flow-col gap-20 ">
        <div className=" row-start-1 ">
          <h4 className="font-semibold text-2xl  text-center ">가이드 등록</h4>
          <div className="flex justify-between items-center min-w-max">
            <div>
              <Link
                className="hover:underline "
                to={`/search-guide?pagesize=${pagesize}&page=1&normid=${query.normid}`}
              >
                가이드 목록 <FontAwesomeIcon icon={faChevronRight} />
              </Link>
              <span> 등록</span>{" "}
              <span className="col-start-1 col-row-1 my-2">
                ({" "}
                {typeof searchGuideData?.totalResult === "number" &&
                  searchGuideData?.totalResult + 1}
                페이지 )
              </span>
            </div>
          </div>
          <hr className=" w-full border-gray-300 mt-4" />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-none gap-3 mt-5 w-full mb-5  "
          >
            <div className="col-start-1 col-end-13 row-start-auto">
              이미지 ( jpg, jpeg, png, svg )
            </div>
            <input
              {...register("file", {
                required: "이미지는 필수 입력값입니다.",
              })}
              onClick={() => reset()}
              className="col-start-1 col-end-13 row-end-auto form-control w-full border border-solid border-gray-300 rounded transition hover:text-gray-600 hover:bg-gray-200 "
              type="file"
            />
            {errors.file?.message && (
              <div className="row-start-3">
                <FormError errorMessage={errors.file?.message} />
              </div>
            )}

            {imageSrc && isValid && (
              <div className="col-start-1 col-end-13  grid auto-rows-max">
                <div className="flex justify-between items-center ">
                  <h5 className=" font-extrabold  text-lg">미리보기</h5>
                  <div
                    onClick={() => onSubmit()}
                    className={`ml-10 p-1 bg-gray-600   text-center rounded-md cursor-pointer text-white hover:bg-gray-500 ${
                      !createGuideMutation.isLoading
                        ? "bg-gray-800 hover:bg-gray-700 w-16"
                        : "bg-gray-300 pointer-events-none w-20 "
                    }`}
                  >
                    {!createGuideMutation.isLoading ? "등록" : "Loading"}
                  </div>
                  {createGuideMutation?.data?.error && (
                    <FormError errorMessage={createGuideMutation.data.error} />
                  )}
                </div>
                <hr className=" w-full border-gray-300 mt-5" />
                <div>
                  <img src={imageSrc} alt="" />
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
