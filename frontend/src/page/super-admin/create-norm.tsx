import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { FormButton } from "../../component/form-button";
import { FormError } from "../../component/form-error";
import { useMutation } from "react-query";
import { apiCreateNorm } from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { Page, PageSize } from "../../constant";
import { ICoreOutput } from "../../api/type";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

interface ICreateNormFromInput {
  name: string;
  timeLimit: number;
}

export const CreateNorm = () => {
  const naviage = useNavigate();

  const createNormMutation = useMutation(apiCreateNorm, {
    onSuccess: (data: ICoreOutput) => {
      if (data.ok) {
        Swal.fire({
          icon: "success",
          title: "규준 생성 완료",
          showConfirmButton: false,
          timer: 1300,
        });
        naviage(`/search-norm?pagesize=${PageSize()}&page=${Page}`);
      }
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm<ICreateNormFromInput>({
    mode: "onChange",
  });

  const onSubmit = () => {
    if (!createNormMutation.isLoading) {
      const { name, timeLimit } = getValues();

      createNormMutation.mutate({ name, timeLimit });
    }
  };

  return (
    <div className="mt-5 max-w-3xl mx-auto rounded-2xl  flex flex-col justify-center items-center p-10 ">
      <Helmet>
        <title>규준 등록</title>
      </Helmet>
      <h4 className="font-semibold text-2xl  text-center ">규준 등록</h4>
      <div className="  w-full  mx-auto flex justify-between items-center ">
        <div className="w-full font-bold text-left  flex justify-between items-center ">
          <div>
            <Link className="hover:underline " to={`/search-norm`}>
              규준 목록 <FontAwesomeIcon icon={faChevronRight} />
            </Link>
            <span> 등록</span>
          </div>
        </div>
      </div>
      <hr className=" w-full border-gray-300 m-4" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2  gap-3 mt-5 w-full mb-5 font-bold"
      >
        <div className="col-start-1 row-end-auto">이름</div>
        <div className="col-start-2 row-end-auto">제한시간 (초)</div>

        <input
          {...register("name", { required: "이름은 필수 입력값 입니다." })}
          className="col-start-1 row-end-auto border border-gray-400 shadow-inner focus:ring-2 focus:ring-cyan-400 focus: outline-none   py-2 px-3 rounded-md "
        />
        <input
          {...register("timeLimit", {
            required: "제한시간은 필수 입력값 입니다.",
          })}
          type={"number"}
          className="col-start-2 row-end-auto border border-gray-400 shadow-inner focus:ring-2 focus:ring-cyan-400 focus: outline-none   py-2 px-3 rounded-md "
        />

        <div className="col-start-1 row-end-auto">
          {typeof errors.name?.message === "string" && (
            <FormError errorMessage={errors.name?.message} />
          )}
        </div>
        <div className="col-start-2 row-end-auto">
          {typeof errors.timeLimit?.message === "string" && (
            <FormError errorMessage={errors.timeLimit?.message} />
          )}
        </div>
        <div className="col-start-1 col-end-3">
          <FormButton
            canClick={isValid}
            loading={createNormMutation.isLoading}
            actionText={"규준 추가"}
          />
          {typeof createNormMutation?.data?.error === "string" && (
            <FormError errorMessage={createNormMutation.data.error} />
          )}
        </div>
      </form>
    </div>
  );
};
