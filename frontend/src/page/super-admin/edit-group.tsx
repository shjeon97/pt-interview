import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiAllNorm, apiEditGroup, apiSelectGroup } from "../../api/axios";
import { ICoreOutput, IEditGroupInput, INorm } from "../../api/type";
import { FormButton } from "../../component/form-button";
import { FormError } from "../../component/form-error";
import { Page, PageSize } from "../../constant";
import Swal from "sweetalert2";

export const EditGroup = () => {
  const param = useParams();
  const naviage = useNavigate();
  const { data: allNormData, isLoading: allNormIsLoading } = useQuery(
    "allNorm",
    apiAllNorm
  );
  const { data: selectGroupData, isLoading: selectGroupIsLoading } = useQuery(
    ["selectGroup", param.groupId],
    () => apiSelectGroup(param?.groupId ? +param.groupId : 1)
  );

  const editGroupMutation = useMutation(apiEditGroup, {
    onSuccess: (data: ICoreOutput) => {
      if (data.ok) {
        Swal.fire({
          icon: "success",
          title: "공고 수정 완료",
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
  } = useForm<IEditGroupInput>({
    mode: "onChange",
  });

  const onSubmit = () => {
    if (!editGroupMutation.isLoading) {
      const editGroupInput = getValues();
      editGroupMutation.mutate(editGroupInput);
    }
  };

  if (
    !selectGroupData ||
    selectGroupIsLoading ||
    !allNormData ||
    allNormIsLoading
  ) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">
          공고 가져오는 중...
        </span>
      </div>
    );
  }

  return (
    <div className="mt-5 max-w-3xl mx-auto rounded-2xl flex flex-col justify-center items-center p-10 ">
      <Helmet>
        <title>공고 수정</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">공고 수정</h4>
      <div className="w-full font-bold text-left mb-2">
        <Link className="hover:underline " to={`/search-group`}>
          공고 목록 <FontAwesomeIcon icon={faChevronRight} />
        </Link>
        <span> 수정</span>
      </div>
      <hr className=" w-full border-gray-300 m-4" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 max-w-screen-sm gap-3 w-full mt-5 font-bold"
      >
        <input
          className=" hidden"
          {...register("groupId")}
          defaultValue={selectGroupData?.result?.id}
        />
        {selectGroupData?.ok && (
          <>
            <div className="col-start-1 row-end-1 ">이름</div>
            <div className="col-start-2 row-end-1">검사 SET</div>

            <input
              {...register("name", {
                required: "이름은 필수 입력값 입니다.",
              })}
              className="col-start-1  row-end-2  border border-gray-400 shadow-inner focus:ring-2 focus:ring-cyan-400 focus: outline-none   py-2 px-3 rounded-md "
              defaultValue={selectGroupData?.result?.name}
            />

            {allNormData?.result?.length && selectGroupData?.result?.normId && (
              <>
                <select
                  {...register("normId", {
                    required: "검사 SET는 필수 입력값 입니다.",
                  })}
                  className="col-start-2  row-end-2  border border-gray-400 shadow-inner focus:ring-2 focus:ring-cyan-400 focus: outline-none   py-2 px-3 rounded-md "
                  defaultValue={selectGroupData.result?.normId}
                >
                  <option value="">검사 SET를 선택하세요</option>
                  {allNormData.result.map((norm: INorm) => {
                    return (
                      <option key={`normId:${norm.id}`} value={norm.id}>
                        {norm.name}
                      </option>
                    );
                  })}
                </select>
              </>
            )}

            <div className="col-start-1 row-end-3">
              {typeof errors.name?.message === "string" && (
                <FormError errorMessage={errors.name?.message} />
              )}
            </div>
            <div className="col-start-2 row-end-3">
              {typeof errors.normId?.message === "string" && (
                <FormError errorMessage={errors.normId?.message} />
              )}
            </div>

            <div className="col-start-1 row-end-4">시작일</div>

            <input
              {...register("startDate", {
                required: "시작일은 필수 입력값 입니다.",
              })}
              className="col-start-1  row-end-5  border border-gray-400 shadow-inner focus:ring-2 focus:ring-cyan-400 focus: outline-none   py-2 px-3 rounded-md "
              type="date"
              defaultValue={moment(selectGroupData?.result?.startDate).format(
                "YYYY-MM-DD"
              )}
            />
            <input
              {...register("startTime", {
                required: "시작시간은 필수 입력값 입니다.",
              })}
              className="col-start-2  row-end-5  border border-gray-400 shadow-inner focus:ring-2 focus:ring-cyan-400 focus: outline-none   py-2 px-3 rounded-md "
              type="time"
              defaultValue={moment(selectGroupData?.result?.startDate).format(
                "HH:mm"
              )}
            />

            <div className="col-start-1 row-end-6">
              {typeof errors.startDate?.message === "string" && (
                <FormError errorMessage={errors.startDate?.message} />
              )}
            </div>
            <div className="col-start-2 row-end-6">
              {typeof errors.startTime?.message === "string" && (
                <FormError errorMessage={errors.startTime?.message} />
              )}
            </div>

            <div className="col-start-1 row-end-7">종료일</div>

            <input
              {...register("endDate", {
                required: "종료일은 필수 입력값 입니다.",
              })}
              className="col-start-1  row-end-auto  border border-gray-400 shadow-inner focus:ring-2 focus:ring-cyan-400 focus: outline-none   py-2 px-3 rounded-md "
              type="date"
              defaultValue={moment(selectGroupData?.result?.endDate).format(
                "YYYY-MM-DD"
              )}
            />
            <input
              {...register("endTime", {
                required: "종료시간은 필수 입력값 입니다.",
              })}
              className="col-start-2  row-end-auto  border border-gray-400 shadow-inner focus:ring-2 focus:ring-cyan-400 focus: outline-none   py-2 px-3 rounded-md "
              type="time"
              defaultValue={moment(selectGroupData?.result?.endDate).format(
                "HH:mm"
              )}
            />

            <div className="col-start-1 row-end-auto ">
              {typeof errors.endDate?.message === "string" && (
                <FormError errorMessage={errors.endDate?.message} />
              )}
            </div>
            <div className="col-start-2 row-end-auto">
              {typeof errors.endTime?.message === "string" && (
                <FormError errorMessage={errors.endTime?.message} />
              )}
            </div>

            <div className="col-start-1 row-end-auto ">
              <FormButton
                canClick={isValid}
                loading={editGroupMutation.isLoading}
                actionText={"공고 수정"}
              />

              {typeof editGroupMutation.data?.error === "string" && (
                <FormError errorMessage={editGroupMutation.data.error} />
              )}
            </div>
          </>
        )}
      </form>
    </div>
  );
};
