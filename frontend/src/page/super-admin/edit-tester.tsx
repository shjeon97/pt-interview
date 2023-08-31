import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { FormButton } from "../../component/form-button";
import { FormError } from "../../component/form-error";
import { useMutation, useQuery } from "react-query";
import {
  apiAllGroup,
  apiDownloadGroup,
  apiEditUser,
  apiSelectUser,
} from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  IAllGroupOutput,
  ICoreOutput,
  ISelectUserOutput,
} from "../../api/type";
import { PageLoading } from "../../component/page-loading";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

interface IEditTesterFromInput {
  name: string;
  password: string;
  groupName: string;
  ptTime: string;
}

export const EditTester = () => {
  const param = useParams();
  const naviage = useNavigate();
  const { data: allGroupData, isLoading: allGroupIsLoading } =
    useQuery<IAllGroupOutput>("allGroup", apiAllGroup);

  const { data: selectTesterData, isLoading: selectTesterIsLoading } =
    useQuery<ISelectUserOutput>(["selectAdmin", param.testerId], () =>
      apiSelectUser(param?.testerId ? +param.testerId : -1)
    );

  const editTesterMutation = useMutation(apiEditUser, {
    onSuccess: (data: ICoreOutput) => {
      if (data.ok) {
        Swal.fire({
          icon: "success",
          title: "지원자 수정 완료",
          showConfirmButton: false,
          timer: 1300,
        });

        naviage(`/search-tester`);
      }
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm<IEditTesterFromInput>({
    mode: "onChange",
  });

  const onSubmit = () => {
    if (
      !editTesterMutation.isLoading &&
      selectTesterData?.result?.id &&
      allGroupData?.ok
    ) {
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

      editTesterMutation.mutate({
        userId: selectTesterData.result.id,
        name,
        password,
        ptTime,
        groupIdList,
      });
    }
  };

  if (
    !allGroupData ||
    allGroupIsLoading ||
    !selectTesterData ||
    selectTesterIsLoading
  ) {
    return <PageLoading text="Loading" />;
  }

  return (
    <div className="mt-5 max-w-3xl mx-auto rounded-2xl flex flex-col justify-center items-center p-10 ">
      <Helmet>
        <title>지원자 수정</title>
      </Helmet>
      <div className="  w-full  mx-auto flex justify-center items-center ">
        <h4 className="font-semibold text-2xl text-center">지원자 수정</h4>
      </div>
      <div className="w-full font-bold text-left mb-2">
        <Link className="hover:underline " to={`/search-tester`}>
          지원자 목록 <FontAwesomeIcon icon={faChevronRight} />
        </Link>
        <span> 수정</span>
      </div>
      <hr className=" w-full border-gray-300 m-4" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 w-full"
      >
        <div className="grid grid-cols-2 gap-2 font-bold">
          <div className="col-start-1 row-end-1">이름</div>
          <div className="col-start-2 row-end-1">비밀번호</div>
          <input
            {...register("name", {
              required: "이름은 필수 입력값 입니다.",
            })}
            defaultValue={selectTesterData.result?.name}
            className="col-start-1 row-end-2 border border-gray-400 shadow-inner focus:ring-2 focus:ring-cyan-400 focus: outline-none   py-2 px-3 rounded-md "
          />
          <input
            {...register("password", {
              required: "비밀번호는 필수 입력값 입니다.",
            })}
            defaultValue={selectTesterData.result?.password}
            className="col-start-2 row-end-2 border border-gray-400 shadow-inner focus:ring-2 focus:ring-cyan-400 focus: outline-none   py-2 px-3 rounded-md "
          />
          <div className="col-start-1 row-end-3">
            {errors.name?.message && (
              <FormError errorMessage={errors.name?.message} />
            )}
          </div>
          <div className="col-start-2 row-end-3">
            {errors.password?.message && (
              <FormError errorMessage={errors.password?.message} />
            )}
          </div>
          <div className="col-start-1 row-end-4 ">
            <div className="flex justify-between items-end">
              <div className="pb-1.5">공고</div>
              <div
                className="select-none focus:outline-none text-green-600 text-sm py-1 px-2 rounded-md border border-green-600 hover:bg-green-50 w-max"
                onClick={() => apiDownloadGroup("download-group.xlsx")}
              >
                공고정보 <FontAwesomeIcon icon={faFileExcel} />
              </div>
            </div>
          </div>
          <div className="col-start-2 row-end-4">면접시간</div>
          <input
            {...register("groupName", {
              required: "공고는 필수 입력값 입니다.",
            })}
            className="col-start-1 row-end-5 border border-gray-400 shadow-inner focus:ring-2 focus:ring-cyan-400 focus: outline-none   py-2 px-3 rounded-md "
            list="groupList"
            placeholder={"등록할 공고를 선택하세요"}
            defaultValue={
              selectTesterData.result?.group &&
              selectTesterData.result?.group[0]?.name
            }
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
            className="col-start-2 row-end-5 border border-gray-400 shadow-inner focus:ring-2 focus:ring-cyan-400 focus: outline-none   py-2 px-3 rounded-md "
            type="time"
            defaultValue={selectTesterData?.result?.ptTime
              ?.toString()
              .slice(0, 5)}
          />
          <div className="col-start-1  col-end-3  row-end-6 ">
            <FormButton
              canClick={isValid}
              loading={editTesterMutation.isLoading}
              actionText={"지원자 수정"}
            />
            {editTesterMutation?.data?.error && (
              <FormError errorMessage={editTesterMutation.data.error} />
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
