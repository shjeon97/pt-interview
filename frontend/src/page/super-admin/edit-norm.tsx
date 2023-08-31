import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { FormButton } from "../../component/form-button";
import { FormError } from "../../component/form-error";
import { useMutation, useQuery } from "react-query";
import { apiEditNorm, apiSelectNorm } from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { ICoreOutput, ISelectNormOutput } from "../../api/type";
import { PageLoading } from "../../component/page-loading";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

interface IEditNormFromInput {
  name: string;
  timeLimit: number;
}

export const EditNorm = () => {
  const param = useParams();
  const naviage = useNavigate();

  const { data: selectNormData, isLoading: selectNormIsLoading } =
    useQuery<ISelectNormOutput>(["selectNorm", param.normId], () =>
      apiSelectNorm(param?.normId ? +param.normId : -1)
    );

  const editNormMutation = useMutation(apiEditNorm, {
    onSuccess: (data: ICoreOutput) => {
      if (data.ok) {
        Swal.fire({
          icon: "success",
          title: "규준 수정 완료",
          showConfirmButton: false,
          timer: 1300,
        });

        naviage(-1);
      }
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm<IEditNormFromInput>({
    mode: "onChange",
  });

  const onSubmit = () => {
    if (
      !editNormMutation.isLoading &&
      selectNormData?.result?.id &&
      selectNormData?.ok
    ) {
      const { name, timeLimit } = getValues();

      editNormMutation.mutate({
        normId: selectNormData.result.id,
        name,
        timeLimit: +timeLimit,
      });
    }
  };

  if (!selectNormData || selectNormIsLoading) {
    return <PageLoading text="Loading" />;
  }

  return (
    <div className="mt-5 max-w-3xl mx-auto rounded-2xl flex flex-col justify-center items-center p-10 ">
      <Helmet>
        <title>규준 수정</title>
      </Helmet>
      <h4 className="font-semibold text-2xl  text-center">규준 수정</h4>
      <div className="  w-full  mx-auto flex justify-between items-center ">
        <div className="w-full font-bold text-left  flex justify-between items-center ">
          <div>
            <Link className="hover:underline " to={`/search-norm`}>
              규준 목록 <FontAwesomeIcon icon={faChevronRight} />
            </Link>
            <span> 단체 </span>
          </div>
        </div>
      </div>
      <hr className=" w-full border-gray-300 m-4" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2  gap-3 mt-5 font-bold w-full mb-5"
      >
        <div className="col-start-1 row-end-auto">이름</div>
        <div className="col-start-2 row-end-auto">제한시간</div>
        <input
          {...register("name", {
            required: "이름은 필수 입력값 입니다.",
          })}
          defaultValue={selectNormData.result?.name}
          className="col-start-1 row-end-auto border border-gray-400 shadow-inner focus:ring-2 focus:ring-cyan-400 focus: outline-none   py-2 px-3 rounded-md "
        />
        <input
          {...register("timeLimit", {
            required: "제한시간은 필수 입력값 입니다.",
          })}
          type={"number"}
          defaultValue={selectNormData.result?.timeLimit}
          className="col-start-2 row-end-auto border border-gray-400 shadow-inner focus:ring-2 focus:ring-cyan-400 focus: outline-none   py-2 px-3 rounded-md "
        />
        <div className="col-start-1 row-end-auto">
          {errors.name?.message && (
            <FormError errorMessage={errors.name?.message} />
          )}
        </div>
        <div className="col-start-2 row-end-auto">
          {errors.timeLimit?.message && (
            <FormError errorMessage={errors.timeLimit?.message} />
          )}
        </div>
        <div className="col-start-1 col-end-3 row-end-auto">
          <FormButton
            canClick={isValid}
            loading={editNormMutation.isLoading}
            actionText={"규준 수정"}
          />
          {editNormMutation?.data?.error && (
            <FormError errorMessage={editNormMutation.data.error} />
          )}
        </div>
      </form>
    </div>
  );
};
