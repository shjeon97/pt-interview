import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { FormButton } from "../../component/form-button";
import { FormError } from "../../component/form-error";
import { useMutation, useQuery } from "react-query";
import { apiAllGroup, apiCreateAdmin, apiDownloadGroup } from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { Page, PageSize } from "../../constant";
import { IAllGroupOutput, ICoreOutput, IGroup } from "../../api/type";
import { PageLoading } from "../../component/page-loading";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faFileExcel,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

interface ICreateAdminFromInput {
  name: string;
  password: string;
  groupName: string;
}

export const CreateAdmin = () => {
  const naviage = useNavigate();
  const [groupList, setGroupList] = useState<IGroup[]>([]);
  const { data: allGroupData, isLoading: allGroupIsLoading } =
    useQuery<IAllGroupOutput>("allGroup", apiAllGroup);

  const createAdminMutation = useMutation(apiCreateAdmin, {
    onSuccess: (data: ICoreOutput) => {
      if (data.ok) {
        Swal.fire({
          icon: "success",
          title: "면접위원 생성 완료",
          showConfirmButton: false,
          timer: 1300,
        });
        naviage(`/search-admin?pagesize=${PageSize()}&page=${Page}`);
      }
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    reset,
  } = useForm<ICreateAdminFromInput>({
    mode: "onChange",
  });

  const onSubmit = () => {
    if (!createAdminMutation.isLoading) {
      const { name, password } = getValues();
      const groupIdList: number[] = [];
      if (groupList) {
        groupList.map((e) => groupIdList.push(e.id));
      }
      createAdminMutation.mutate({ name, password, groupIdList });
    }
  };

  const onClickPushGroup = () => {
    if (allGroupData?.ok) {
      const { groupName, name, password } = getValues();
      const group = allGroupData.result?.find(
        (group) => group.name === groupName
      );
      reset({ groupName: "", name, password });

      if (groupList.length > 0 && group) {
        const exists = groupList.find((e) => e.name === group.name);
        if (!exists) {
          setGroupList([...groupList, group]);
        }
      } else if (group) {
        setGroupList([group]);
      }
    }
  };
  const onClickExceptGroup = (group: IGroup) => {
    const newGroupList = groupList.filter((e) => e.id !== group.id);
    if (newGroupList) {
      setGroupList([...newGroupList]);
    }
  };

  if (!allGroupData || allGroupIsLoading) {
    return <PageLoading text="Loading" />;
  }

  return (
    <div className="mt-5 max-w-3xl mx-auto rounded-2xl font-bold flex flex-col justify-center items-center p-10 ">
      <Helmet>
        <title>면접위원 등록</title>
      </Helmet>
      <div className="  w-full  mx-auto flex justify-center items-center ">
        <h4 className="font-semibold text-2xl mb-3">면접위원 등록</h4>
      </div>
      <div className="  w-full  mx-auto flex justify-between items-center ">
        <div>
          <Link className="hover:underline " to={`/search-admin`}>
            면접위원 목록 <FontAwesomeIcon icon={faChevronRight} />
          </Link>
          <span> 등록</span>
        </div>
        <Link
          className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
          to={`/upload-admin-list`}
        >
          단체 등록
        </Link>
      </div>
      <hr className=" w-full border-gray-300 m-4" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
      >
        <div className="grid grid-cols-2 gap-2 font-bold">
          <div className="col-start-1  row-end-1 ">이름</div>
          <div className="col-start-2  row-end-1 ">비밀번호</div>

          <input
            {...register("name", { required: "이름은 필수 입력값 입니다." })}
            className="col-start-1  row-end-2  border border-gray-400 shadow-inner focus:ring-2 focus:ring-cyan-400 focus: outline-none   py-2 px-3 rounded-md "
          />

          <input
            {...register("password", {
              required: "비밀번호는 필수 입력값 입니다.",
            })}
            className="col-start-2  row-end-2  border border-gray-400 shadow-inner focus:ring-2 focus:ring-cyan-400 focus: outline-none   py-2 px-3 rounded-md "
          />

          <div className="col-start-1  row-end-3">
            {errors.name?.message && (
              <FormError errorMessage={errors.name?.message} />
            )}
          </div>

          <div className="col-start-2  row-end-3">
            {errors.password?.message && (
              <FormError errorMessage={errors.password?.message} />
            )}
          </div>

          <div className="col-start-1  row-end-4">
            <div className="flex justify-between">
              <span>공고</span>
              <span
                className="focus:outline-none text-green-600 text-sm py-1 px-2 rounded-md border border-green-600 hover:bg-green-50 w-max"
                onClick={() => apiDownloadGroup("download-group.xlsx")}
              >
                공고정보 <FontAwesomeIcon icon={faFileExcel} />
              </span>
            </div>
          </div>

          <input
            {...register("groupName")}
            className="col-start-1  row-end-5  border border-gray-400 shadow-inner focus:ring-2 focus:ring-cyan-400 focus: outline-none   py-2 px-3 rounded-md "
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

          <div
            onClick={() => onClickPushGroup()}
            className="col-start-2  row-end-5  text-center w-20  focus:outline-none text-white py-2  transition-colors rounded-md bg-gray-800 hover:bg-gray-700"
          >
            등록
          </div>

          {groupList.length >= 1 && (
            <div className="col-start-1 row-end-6">
              <div>공고 목록</div>
              <div className="grid grid-cols-1 bg-gray-200 p-2 rounded-md">
                <div className="flex flex-wrap ">
                  {groupList?.map((group) => (
                    <div
                      key={group.id}
                      className="p-2 m-1 bg-gray-600 text-gray-100 rounded-md"
                    >
                      {group.name}
                      <span
                        className=" cursor-pointer"
                        onClick={() => onClickExceptGroup(group)}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="mx-1   transform hover:text-red-500 hover:scale-110"
                        />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="col-start-1 row-end-7">
            <FormButton
              canClick={isValid}
              loading={createAdminMutation.isLoading}
              actionText={"면접위원 등록"}
            />
            {createAdminMutation?.data?.error && (
              <FormError errorMessage={createAdminMutation.data.error} />
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
