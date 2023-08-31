import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { FormButton } from "../../component/form-button";
import { FormError } from "../../component/form-error";
import { useMutation, useQuery } from "react-query";
import {
  apiAllGroup,
  apiCreateTester,
  apiDownloadGroup,
} from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { Page, PageSize } from "../../constant";
import { IAllGroupOutput, ICoreOutput } from "../../api/type";
import { PageLoading } from "../../component/page-loading";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

interface ICreateTesterFromInput {
  name: string;
  password: string;
  groupName: string;
  ptTime: string;
}

export const CreateTester = () => {
  const naviage = useNavigate();
  const { data: allGroupData, isLoading: allGroupIsLoading } =
    useQuery<IAllGroupOutput>("allGroup", apiAllGroup);

  const createTesterMutation = useMutation(apiCreateTester, {
    onSuccess: (data: ICoreOutput) => {
      if (data.ok) {
        Swal.fire({
          icon: "success",
          title: "지원자 생성 완료",
          showConfirmButton: false,
          timer: 1300,
        });
        naviage(`/search-tester?pagesize=${PageSize()}&page=${Page}`);
      }
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm<ICreateTesterFromInput>({
    mode: "onChange",
  });

  const onSubmit = () => {
    if (!createTesterMutation.isLoading && allGroupData?.ok) {
      const groupIdList: number[] = [];
      const { name, password, ptTime, groupName } = getValues();
      const group = allGroupData.result?.find(
        (group) => group.name === groupName
      );
      if (group?.id) {
        groupIdList.push(group?.id);
      } else {
        Swal.fire({
          icon: "error",
          title: "존재하지 않는 공고입니다",
        });
        return;
      }
      createTesterMutation.mutate({ name, password, ptTime, groupIdList });
    }
  };

  if (!allGroupData || allGroupIsLoading) {
    return <PageLoading text="Loading" />;
  }

  return (
    <div className="mt-5 max-w-3xl mx-auto rounded-2xl font-bold  flex flex-col justify-center items-center p-10 ">
      <Helmet>
        <title>지원자 등록</title>
      </Helmet>
      <h4 className="font-semibold text-2xl  text-center">지원자 등록</h4>
      <div className="  w-full  mx-auto flex justify-between items-center ">
        <div>
          <Link className="hover:underline " to={`/search-tester`}>
            지원자 목록 <FontAwesomeIcon icon={faChevronRight} />
          </Link>
          <span> 등록</span>
        </div>

        <Link
          className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
          to={`/upload-tester-list`}
        >
          단체 등록
        </Link>
      </div>
      <hr className=" w-full border-gray-300 m-4" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 max-w-screen-sm gap-3 mt-5 w-full mb-5"
      >
        <div className="col-start-1 row-end-auto">이름</div>
        <div className="col-start-2 row-end-auto">비밀번호</div>

        <input
          {...register("name", { required: "이름은 필수 입력값 입니다." })}
          className="col-start-1 row-end-auto border border-gray-400 shadow-inner focus:ring-2 focus:ring-cyan-400 focus: outline-none   py-2 px-3 rounded-md "
        />
        <input
          {...register("password", {
            required: "비밀번호는 필수 입력값 입니다.",
          })}
          type={"password"}
          className="col-start-2 row-end-auto border border-gray-400 shadow-inner focus:ring-2 focus:ring-cyan-400 focus: outline-none   py-2 px-3 rounded-md "
        />

        <div className="col-start-1 row-end-auto">
          {errors.name?.message && (
            <FormError errorMessage={errors.name?.message} />
          )}
        </div>
        <div className="col-start-2 row-end-auto">
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
        </div>

        <div className="col-start-1 row-end-auto">
          <div className="flex justify-between">
            <div>공고</div>
            <div
              className=" select-none focus:outline-none text-green-600 text-sm py-1 px-2 rounded-md border border-green-600 hover:bg-green-50 w-max"
              onClick={() => apiDownloadGroup("download-group.xlsx")}
            >
              공고정보 <FontAwesomeIcon icon={faFileExcel} />
            </div>
          </div>
        </div>
        <div className="col-start-2 row-end-auto">면접시간</div>

        <input
          {...register("groupName", {
            required: "공고는 필수 입력값 입니다.",
          })}
          className="col-start-1 row-end-auto border border-gray-400 shadow-inner focus:ring-2 focus:ring-cyan-400 focus: outline-none   py-2 px-3 rounded-md "
          list="groupList"
          placeholder={"등록할 공고를 선택하세요"}
        />
        <datalist id="groupList">
          {allGroupData?.result?.length && (
            <>
              {allGroupData.result.map((norm) => (
                <option key={norm.id}>{norm.name}</option>
              ))}
            </>
          )}
        </datalist>
        <input
          {...register("ptTime", {
            required: "면접시간은 필수 입력값 입니다.",
          })}
          className="col-start-2 row-end-auto  border border-gray-400 shadow-inner focus:ring-2 focus:ring-cyan-400 focus: outline-none   py-2 px-3 rounded-md "
          type="time"
          defaultValue="09:00"
        />
        <div className="col-start-1 col-end-3 row-end-auto">
          <FormButton
            canClick={isValid}
            loading={createTesterMutation.isLoading}
            actionText={"지원자 등록"}
          />
          {createTesterMutation?.data?.error && (
            <FormError errorMessage={createTesterMutation.data.error} />
          )}
        </div>
      </form>
    </div>
  );
};
