import React from "react";
import moment from "moment";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { FormButton } from "../../component/form-button";
import { FormError } from "../../component/form-error";
import { useMutation, useQuery } from "react-query";
import { apiAllNorm, apiCreateGroup } from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { Page, PageSize } from "../../constant";
import { IAllNormOutput, ICoreOutput, ICreateGroupInput } from "../../api/type";
import { PageLoading } from "../../component/page-loading";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

export const CreateGroup = () => {
  const naviage = useNavigate();

  const { data: allNormData, isLoading: allNormIsLoading } =
    useQuery<IAllNormOutput>("allNorm", apiAllNorm);

  const createGroupMutation = useMutation(apiCreateGroup, {
    onSuccess: (data: ICoreOutput) => {
      if (data.ok) {
        Swal.fire({
          icon: "success",
          title: "공고 생성 완료",
          showConfirmButton: false,
          timer: 1300,
        });
        naviage(`/search-group?pagesize=${PageSize()}&page=${Page}`);
      }
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm<ICreateGroupInput>({
    mode: "onChange",
  });

  const onSubmit = () => {
    if (!createGroupMutation.isLoading) {
      const createGroupInput = getValues();
      createGroupMutation.mutate(createGroupInput);
    }
  };

  if (!allNormData || allNormIsLoading) {
    return <PageLoading text="Loading" />;
  }

  return (
    <div className="mt-5 max-w-3xl mx-auto  flex flex-col justify-center items-center p-10 ">
      <Helmet>
        <title>공고 등록</title>
      </Helmet>
      <div className="  w-full  mx-auto flex justify-center items-center ">
        <h4 className="font-semibold text-2xl mb-3">공고 등록</h4>
      </div>
      <div className="w-full font-bold text-left  flex justify-between items-center ">
        <div>
          <Link className="hover:underline " to={`/search-group`}>
            공고 목록 <FontAwesomeIcon icon={faChevronRight} />
          </Link>
          <span> 등록</span>
        </div>

        <Link
          className=" flex-wrap text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
          to={`/upload-group-list`}
        >
          단체 등록
        </Link>
      </div>
      <hr className=" w-full border-gray-300 m-4" />
      <form onSubmit={handleSubmit(onSubmit)} className="grid  gap-3 w-full">
        <div className="grid grid-cols-2 gap-2 font-bold">
          <div className="col-start-1  row-end-1 ">이름</div>
          <div className="col-start-2 row-end-1 ">검사 SET</div>
          <input
            {...register("name", { required: "이름은 필수 입력값 입니다." })}
            className="col-start-1  row-end-2  border border-gray-400 shadow-inner focus:ring-2 focus:ring-cyan-400 focus: outline-none   py-2 px-3 rounded-md "
          />
          <select
            {...register("normId", {
              required: "검사 SET는 필수 입력값 입니다.",
            })}
            className="col-start-2  row-end-2  border border-gray-400 shadow-inner focus:ring-2 focus:ring-cyan-400 focus: outline-none   py-2 px-3 rounded-md "
          >
            {allNormData?.result?.length && (
              <>
                <option value="">검사 SET를 선택하세요</option>
                {allNormData.result.map((norm) => (
                  <option key={norm.id} value={norm.id}>
                    {norm.name}
                  </option>
                ))}
              </>
            )}
          </select>

          <div className="col-start-1  row-end-3 ">
            {typeof errors.name?.message === "string" && (
              <FormError errorMessage={errors.name?.message} />
            )}
          </div>
          <div className="col-start-2  row-end-3 ">
            {typeof errors.normId?.message === "string" && (
              <FormError errorMessage={errors.normId?.message} />
            )}
          </div>

          <div className="col-start-1  row-end-4 ">시작일</div>
          <input
            {...register("startDate", {
              required: "시작일은 필수 입력값 입니다.",
            })}
            className="col-start-1  row-end-5  border border-gray-400 shadow-inner focus:ring-2 focus:ring-cyan-400 focus: outline-none   py-2 px-3 rounded-md "
            type="date"
            defaultValue={moment(new Date()).format("yyyy-MM-DD")}
          />
          <input
            {...register("startTime", {
              required: "시작일은 필수 입력값 입니다.",
            })}
            className="col-start-2  row-end-5  border border-gray-400 shadow-inner focus:ring-2 focus:ring-cyan-400 focus: outline-none   py-2 px-3 rounded-md "
            type="time"
            defaultValue="09:00"
          />

          <div className="col-start-1  row-end-6 ">
            {typeof errors.startDate?.message === "string" && (
              <FormError errorMessage={errors.startDate?.message} />
            )}
          </div>
          <div className="col-start-2  row-end-6 ">
            {typeof errors.startTime?.message === "string" && (
              <FormError errorMessage={errors.startTime?.message} />
            )}
          </div>

          <div className="col-start-1  row-end-7 ">종료일</div>

          <input
            {...register("endDate", {
              required: "종료일은 필수 입력값 입니다.",
            })}
            className="col-start-1  row-end-8 border border-gray-400 shadow-inner focus:ring-2 focus:ring-cyan-400 focus: outline-none   py-2 px-3 rounded-md "
            type="date"
            defaultValue={moment(new Date()).add(5, "day").format("yyyy-MM-DD")}
          />
          <input
            {...register("endTime", {
              required: "종료일은 필수 입력값 입니다.",
            })}
            className="col-start-2  row-end-8  border border-gray-400 shadow-inner focus:ring-2 focus:ring-cyan-400 focus: outline-none   py-2 px-3 rounded-md "
            type="time"
            defaultValue="18:00"
          />

          <div className="col-start-1  row-end-9 ">
            {typeof errors.endDate?.message === "string" && (
              <FormError errorMessage={errors.endDate?.message} />
            )}
          </div>
          <div className="col-start-2  row-end-9 ">
            {typeof errors.endTime?.message === "string" && (
              <FormError errorMessage={errors.endTime?.message} />
            )}
          </div>

          <div className="col-start-1 col-end-3   row-end-10 ">
            <FormButton
              canClick={isValid}
              loading={createGroupMutation.isLoading}
              actionText={"공고 등록"}
            />{" "}
            {typeof createGroupMutation?.data?.error === "string" && (
              <FormError errorMessage={createGroupMutation.data.error} />
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
