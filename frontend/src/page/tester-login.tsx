import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router";
import { apiLogin, apiMe } from "../api/axios";
import { ILoginInput, ILoginOutput } from "../api/type";
import { FormButton } from "../component/form-button";
import { FormError } from "../component/form-error";
import { LOCALSTORAGE_TOKEN, UserRole, UserTestState } from "../constant";

export const TesterLogin = () => {
  const naviage = useNavigate();
  const queryClient = useQueryClient();
  useQuery("me", apiMe, {
    onSuccess: (data) => {
      if (data) {
        switch (data.testState) {
          case UserTestState.Pending:
            naviage(`/orientation?normid=${data.group[0].normId}`);
            break;

          case UserTestState.InProgress:
            naviage(`/test`);
            break;

          case UserTestState.Done:
            naviage(`/preview`);
            break;

          default:
            break;
        }
      }
    },
  });
  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<ILoginInput>({ mode: "onChange" });

  const loginMutation = useMutation(apiLogin, {
    onSuccess: (data: ILoginOutput) => {
      if (data.ok && data.token) {
        localStorage.setItem(LOCALSTORAGE_TOKEN, data.token);
        queryClient.invalidateQueries("me");
      }
    },
  });

  const onSubmit = () => {
    if (!loginMutation.isLoading) {
      const { name, password } = getValues();
      loginMutation.mutate({ name, password, role: UserRole.Tester });
    }
  };

  return (
    <div className="h-screen flex items-center justify-center  min-w-min select-none">
      <Helmet>
        <title>지원자 로그인</title>
      </Helmet>
      <div className="bg-white w-full max-w-lg py-10 px-16 rounded-md text-center">
        <h3 className="font-bold text-2xl text-gray-800">지원자 로그인</h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 px-5"
        >
          <input
            {...register("name", { required: "이름은 필수 입력값 입니다." })}
            placeholder="name"
            required
            className="text-center bg-gray-100 shadow-inner focus:ring-2 focus:ring-gray-400 focus: outline-none my-1  py-3 px-3 rounded-md "
          />
          {typeof errors.name?.message === "string" && (
            <FormError errorMessage={errors.name?.message} />
          )}
          <input
            {...register("password", {
              required: "인증키는 필수 입력값 입니다.",
            })}
            type="password"
            placeholder="인증키"
            required
            className="text-center bg-gray-100 shadow-inner focus:ring-2 focus:ring-gray-400 focus: outline-none my-1  py-3 px-3 rounded-md "
          />
          {typeof errors.password?.message === "string" && (
            <FormError errorMessage={errors.password?.message} />
          )}
          <FormButton
            canClick={isValid}
            loading={loginMutation.isLoading}
            actionText={"접속"}
          />
          {typeof loginMutation.data?.error === "string" && (
            <FormError errorMessage={loginMutation.data.error} />
          )}
        </form>
      </div>
    </div>
  );
};
