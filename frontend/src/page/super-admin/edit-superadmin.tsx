import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { FormButton } from "../../component/form-button";
import { FormError } from "../../component/form-error";
import { useMutation, useQuery } from "react-query";
import { apiEditUser, apiLogin, apiMe } from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { ICoreOutput, ILoginOutput, IUser } from "../../api/type";
import { PageLoading } from "../../component/page-loading";
import Swal from "sweetalert2";

interface IEditSuperAdminFromInput {
  name: string;
  password: string;
  editPassword: string;
  editPasswordRepeat: string;
}

export const EditSuperAdmin = () => {
  const naviage = useNavigate();
  const { data: me } = useQuery<IUser>("me", apiMe);
  const editAdminMutation = useMutation(apiEditUser, {
    onSuccess: (data: ICoreOutput) => {
      if (data.ok) {
        Swal.fire({
          icon: "success",
          title: "관리자 수정 완료",
          showConfirmButton: false,
          timer: 1300,
        });
        naviage(-1);
      }
    },
  });

  const loginMutation = useMutation(apiLogin, {
    onSuccess: (data: ILoginOutput) => {
      if (data.ok && data.token && me) {
        if (!editAdminMutation.isLoading) {
          const { name, editPassword, editPasswordRepeat } = getValues();

          if (editPassword !== editPasswordRepeat) {
            Swal.fire({
              icon: "error",
              title: "새 비밀번호가 일치하지 않습니다.",
            });
          } else {
            editAdminMutation.mutate({
              userId: me?.id,
              name,
              ...(editPassword.length > 1 && { password: editPassword }),
            });
          }
        }
      }
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm<IEditSuperAdminFromInput>({
    mode: "onChange",
  });

  const onSubmit = () => {
    if (!loginMutation.isLoading && me) {
      const { password } = getValues();
      loginMutation.mutate({ name: me.name, password, role: me.role });
    }
  };

  if (!me) {
    return <PageLoading text="Loading" />;
  }

  return (
    <div className="mt-5 max-w-3xl mx-auto rounded-2xl flex flex-col justify-center items-center p-10 ">
      <Helmet>
        <title>관리자 수정</title>
      </Helmet>
      <h4 className="font-semibold text-2xl  text-center">관리자 수정</h4>
      <div className="w-full font-bold text-left mb-2">
        <div
          className="hover:underline cursor-pointer"
          onClick={() => window.history.go(-1)}
        >
          뒤로가기
        </div>
      </div>
      <hr className=" w-full border-gray-300 m-4" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 w-full gap-3 mt-5  mb-5 font-bold"
      >
        <>
          <div className="col-start-1 row-end-auto">이름</div>
          <div className="col-start-2 row-end-auto">비밀번호</div>
          <input
            {...register("name", { required: "이름은 필수 입력값 입니다." })}
            defaultValue={me?.name}
            className="col-start-1 row-end-auto border border-gray-400 shadow-inner focus:ring-2 focus:ring-cyan-400 focus: outline-none   py-2 px-3 rounded-md "
          />
          <input
            {...register("password", {
              required: "비밀번호는 필수 입력값 입니다.",
            })}
            type="password"
            className="col-start-2 row-end-auto border border-gray-400 shadow-inner focus:ring-2 focus:ring-cyan-400 focus: outline-none   py-2 px-3 rounded-md "
          />
          <div className="col-start-1 row-end-auto">
            {typeof errors.name?.message === "string" && (
              <FormError errorMessage={errors.name?.message} />
            )}
          </div>
          <div className="col-start-2 row-end-auto">
            {typeof errors.password?.message === "string" && (
              <FormError errorMessage={errors.password?.message} />
            )}
          </div>

          <div className="col-start-1 row-end-auto">
            새 비밀번호 <span className="text-xs">(비밀번호 변경 시 작성)</span>
          </div>
          <div className="col-start-2 row-end-auto">새 비밀번호 확인</div>
          <input
            {...register("editPassword")}
            type="password"
            className="col-start-1 row-end-auto border border-gray-400 shadow-inner focus:ring-2 focus:ring-cyan-400 focus: outline-none   py-2 px-3 rounded-md "
          />
          <input
            {...register("editPasswordRepeat")}
            type="password"
            className="col-start-2 row-end-auto border border-gray-400 shadow-inner focus:ring-2 focus:ring-cyan-400 focus: outline-none   py-2 px-3 rounded-md "
          />
          {/* <div className="col-start-1 row-end-auto">
            {errors.editPassword?.message && (
              <FormError errorMessage={errors.editPassword?.message} />
            )}
          </div>
          <div className="col-start-2 row-end-auto">
            {errors.editPasswordRepeat?.message && (
              <FormError errorMessage={errors.editPasswordRepeat?.message} />
            )}
          </div> */}

          <div className=" col-start-1 col-end-3 row-end-auto">
            <FormButton
              canClick={isValid}
              loading={editAdminMutation.isLoading}
              actionText={"관리자 수정"}
            />
            {typeof editAdminMutation?.data?.error === "string" && (
              <FormError errorMessage={editAdminMutation.data.error} />
            )}
            {typeof loginMutation.data?.error === "string" && (
              <FormError errorMessage={loginMutation.data.error} />
            )}
          </div>
        </>
      </form>
    </div>
  );
};
