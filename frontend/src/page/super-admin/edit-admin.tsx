import React, { useEffect, useState } from "react";
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
  IGroup,
  ISelectUserOutput,
} from "../../api/type";
import { PageLoading } from "../../component/page-loading";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faFileExcel,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

interface IEditAdminFromInput {
  name: string;
  password: string;
  groupName: string;
}

export const EditAdmin = () => {
  const param = useParams();
  const naviage = useNavigate();
  const [groupList, setGroupList] = useState<IGroup[]>([]);
  const { data: allGroupData, isLoading: allGroupIsLoading } =
    useQuery<IAllGroupOutput>("allGroup", apiAllGroup);

  const { data: selectAdminData, isLoading: selectAdminIsLoading } =
    useQuery<ISelectUserOutput>(["selectAdmin", param.adminId], () =>
      apiSelectUser(param?.adminId ? +param.adminId : -1)
    );

  const editAdminMutation = useMutation(apiEditUser, {
    onSuccess: (data: ICoreOutput) => {
      if (data.ok) {
        Swal.fire({
          icon: "success",
          title: "면접위원 수정 완료",
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
    reset,
  } = useForm<IEditAdminFromInput>({
    mode: "onChange",
  });

  const onSubmit = () => {
    if (!editAdminMutation.isLoading && selectAdminData?.result?.id) {
      const { name, password } = getValues();
      const groupIdList: number[] = [];
      if (groupList) {
        groupList.map((e) => groupIdList.push(e.id));
      }

      editAdminMutation.mutate({
        userId: selectAdminData?.result.id,
        name,
        password,
        groupIdList,
      });
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

  useEffect(() => {
    if (selectAdminData?.result?.group) {
      setGroupList(selectAdminData?.result?.group);
    }
  }, [selectAdminData?.result?.group]);

  if (
    !allGroupData ||
    allGroupIsLoading ||
    !selectAdminData ||
    selectAdminIsLoading
  ) {
    return <PageLoading text="Loading" />;
  }

  return (
    <div className="mt-5 max-w-3xl mx-auto rounded-2xl flex flex-col justify-center items-center p-10 ">
      <Helmet>
        <title>면접위원 수정</title>
      </Helmet>
      <h4 className="font-semibold text-2xl  text-center">면접위원 수정</h4>
      <div className="w-full font-bold text-left mb-2">
        <Link className="hover:underline " to={`/search-admin`}>
          면접위원 목록 <FontAwesomeIcon icon={faChevronRight} />
        </Link>
        <span> 수정</span>
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
            defaultValue={selectAdminData.result?.name}
            className="col-start-1 row-end-auto border border-gray-400 shadow-inner focus:ring-2 focus:ring-cyan-400 focus: outline-none   py-2 px-3 rounded-md "
          />
          <input
            {...register("password", {
              required: "비밀번호는 필수 입력값 입니다.",
            })}
            defaultValue={selectAdminData.result?.password}
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
            <div className="flex w-full justify-between">
              <label className="block  text-md text-gray-900 dark:text-gray-300">
                공고
              </label>
              <div className="flex ml-10">
                <div
                  className=" cursor-pointer   focus:outline-none text-green-600 text-sm py-1 px-2 rounded-md border border-green-600 hover:bg-green-50 w-max"
                  onClick={() => apiDownloadGroup("download-group.xlsx")}
                >
                  공고정보 <FontAwesomeIcon icon={faFileExcel} />
                </div>
              </div>
            </div>
          </div>
          <input
            {...register("groupName")}
            className="col-start-1 col-auto  border border-gray-400 shadow-inner focus:ring-2 focus:ring-cyan-400 focus: outline-none   py-2 px-3 rounded-md "
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
            className=" text-center col-start-2 row-end-auto w-20  focus:outline-none text-white py-2  transition-colors rounded-md bg-gray-800 hover:bg-gray-700"
          >
            등록
          </div>
          {groupList.length >= 1 && (
            <div className=" col-start-1 col-end-3 row-end-auto">
              <div className="my-2">공고 목록</div>
              <div className="grid grid-cols-1 bg-gray-200 p-2 rounded-md">
                <div className="flex flex-wrap ">
                  {groupList?.map((group) => (
                    <div
                      key={group.id}
                      className="p-2 m-1 bg-gray-600 text-gray-100 rounded-md"
                    >
                      {group.name + " "}
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
          <div className=" col-start-1 col-end-3 row-end-auto">
            <FormButton
              canClick={isValid}
              loading={editAdminMutation.isLoading}
              actionText={"면접위원 수정"}
            />
            {typeof editAdminMutation?.data?.error === "string" && (
              <FormError errorMessage={editAdminMutation.data.error} />
            )}
          </div>
        </>
      </form>
    </div>
  );
};
