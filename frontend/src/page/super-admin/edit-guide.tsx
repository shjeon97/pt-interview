import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { FormError } from "../../component/form-error";
import { useMutation, useQuery } from "react-query";
import { apiEditGuide, apiSelectGuide } from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { Page, PageSize } from "../../constant";
import { ICoreOutput } from "../../api/type";
import { Link } from "react-router-dom";
import queryString from "query-string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

interface IEditGuideFromInput {
  file: any;
}

export const EditGuide = () => {
  const query = queryString.parse(window.location.search);
  const naviage = useNavigate();
  const [page] = useState<number>(query?.page ? +query.page : Page);
  const [normId] = useState(query?.normid ? +query.normid : -1);
  const [pagesize] = useState<number>(
    query?.pagesize ? +query?.pagesize : +PageSize()
  );
  const [imageSrc, setImageSrc] = useState("");
  const encodeFileToBase64 = (fileBlob: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);

    reader.onload = () => {
      setImageSrc(reader?.result + "");
    };
  };

  const { data: GuideData } = useQuery(
    ["guide", "normId:" + normId, "page:" + page],
    () => apiSelectGuide({ normId, page })
  );

  const editGuideMutation = useMutation(apiEditGuide, {
    onSuccess: (data: ICoreOutput) => {
      if (data.ok) {
        Swal.fire({
          icon: "success",
          title: "가이드 수정 완료",
          showConfirmButton: false,
          timer: 1300,
        });

        naviage(
          `/search-guide?pagesize=${pagesize}&page=1&normid=${
            query.normid ? +query.normid : -1
          }`
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
  } = useForm<IEditGuideFromInput>({
    mode: "onChange",
  });

  const onSubmit = () => {
    if (!editGuideMutation.isLoading) {
      const { file } = getValues();

      editGuideMutation.mutate({
        page,
        normId: query.normid ? +query.normid : -1,
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
    <div className="mt-5 max-w-5xl mx-auto rounded-2xl font-bold  flex flex-col justify-center items-center p-10 ">
      <Helmet>
        <title>가이드 수정</title>
      </Helmet>
      <div className="grid grid-cols-1  grid-rows-none  w-full  mx-auto grid-flow-col gap-20">
        <div className=" row-start-1">
          <h4 className="font-semibold text-2xl  text-center ">가이드 수정</h4>
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
                ( {page}
                페이지 )
              </span>
            </div>
          </div>
          <hr className=" w-full border-gray-300 mt-4" />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-none gap-3 mt-5 w-full mb-5  "
          >
            <>
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
                <div className="col-start-1 col-end-13 row-end-auto">
                  <FormError errorMessage={errors.file?.message} />
                </div>
              )}
              <div className="col-start-1 col-end-13 grid auto-rows-max">
                {imageSrc && isValid ? (
                  <div>
                    <div className="flex justify-between items-center">
                      <h5 className=" font-extrabold  text-lg">미리보기</h5>

                      <div
                        onClick={() => onSubmit()}
                        className={`ml-10 p-1 bg-gray-600   text-center rounded-md cursor-pointer text-white hover:bg-gray-500 ${
                          !editGuideMutation.isLoading
                            ? "bg-gray-800 hover:bg-gray-700 w-16"
                            : "bg-gray-300 pointer-events-none w-20 "
                        }`}
                      >
                        {!editGuideMutation.isLoading ? "등록" : "Loading"}
                      </div>
                      {editGuideMutation?.data?.error && (
                        <FormError
                          errorMessage={editGuideMutation.data.error}
                        />
                      )}
                    </div>
                    <hr className=" w-full border-gray-300 mt-5" />
                    <div>
                      <img src={imageSrc} alt="" />
                    </div>
                  </div>
                ) : (
                  GuideData && (
                    <div>
                      <div className=" flex justify-between items-center">
                        <h5 className=" font-extrabold  text-lg">
                          기존 이미지
                        </h5>
                      </div>
                      <hr className="border-gray-300 mt-5" />
                      <img
                        className="w-screen"
                        src={GuideData.imageUrl}
                        alt=""
                      />
                    </div>
                  )
                )}
              </div>
            </>
          </form>
        </div>
      </div>
    </div>
  );
};
