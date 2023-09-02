import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useRef } from "react";
import moment from "moment";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useParams } from "react-router-dom";
import { apiDetailGroup, apiEditTester, apiMe } from "../../api/axios";
import {
  ICoreOutput,
  IDetailGroupOutput,
  IDetailUser,
  IUser,
} from "../../api/type";
import { PageLoading } from "../../component/page-loading";
import { UserRole, UserTestState } from "../../constant";
import { useInterval } from "../../hook/useInterval";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { useOnClickOutside } from "../../hook/useOnClickOutside";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { FormButton } from "../../component/form-button";

interface IEditTesterFromInput {
  timeRemaining: number;
  testState: UserTestState;
}

const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      // extend the existing attributes…
      ...this.parent?.(),

      // and add a new one …
      backgroundColor: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-background-color"),
        renderHTML: (attributes) => {
          return {
            "data-background-color": attributes.backgroundColor,
            style: `background-color: ${attributes.backgroundColor}`,
          };
        },
      },
    };
  },
});

export const DetailGroup = () => {
  const param = useParams();
  const [groupId] = useState(param?.groupId ? +param.groupId : 0);
  const queryClient = useQueryClient();
  const [detailTester, setDetailTester] = useState<IDetailUser | null>(null);
  const [openMenuByTesterId, setOpenMenuByTesterId] = useState<number | null>(
    null
  );
  const { data } = useQuery<IUser>("me", apiMe);

  const {
    register,
    handleSubmit,
    formState: { isValid },
    getValues,
    reset,
  } = useForm<IEditTesterFromInput>({
    mode: "onChange",
  });

  const ref = useRef(null);
  const editTesterModelRef = useRef(null);
  const [isEditTesterModelOpen, setIsEditTesterModelOpen] = useState(false);

  useOnClickOutside(editTesterModelRef, () => {
    if (isEditTesterModelOpen) setIsEditTesterModelOpen(false);
  });

  useOnClickOutside(ref, () => {
    if (openMenuByTesterId) setOpenMenuByTesterId(null);
  });

  const onClickEditTestTimeButton = (tester: IDetailUser) => {
    setDetailTester(tester);
    setIsEditTesterModelOpen(!isEditTesterModelOpen);
  };

  const editTesterMutation = useMutation(apiEditTester, {
    onSuccess: (data: ICoreOutput) => {
      if (data.ok) {
        Swal.fire({
          icon: "success",
          title: "지원자 수정 완료",
          showConfirmButton: false,
          timer: 1300,
        });
      }
    },
  });

  const onSubmit = () => {
    if (!editTesterMutation.isLoading && detailTester) {
      const { timeRemaining, testState } = getValues();
      editTesterMutation.mutate({
        userId: detailTester.user.id,
        testState,
        timeRemaining,
      });
    }
  };

  const editor = useEditor({
    editable: false,
    extensions: [
      StarterKit,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      CustomTableCell,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none   ",
      },
    },
  });
  const { data: detailGroupData, isLoading: detailGroupIsLoading } =
    useQuery<IDetailGroupOutput>(
      ["detailGroup", groupId],
      () => apiDetailGroup(+groupId),
      {
        onSuccess: (data) => {
          if (data.ok) {
            if (detailUser) {
              const exists = data.result?.detailUserList?.filter(
                (e) => e.user.id === detailUser.user.id
              );
              if (exists) {
                if (exists[0].mark?.mark) {
                  editor?.commands.setContent(exists[0].mark?.mark);
                } else {
                  editor?.commands.setContent("");
                }
              }
            }
          }
        },
      }
    );

  useInterval(() => {
    queryClient.invalidateQueries(["detailGroup", groupId]);
  }, 10000);

  const [detailUser, setDetailUser] = useState<IDetailUser>();
  if (!detailGroupData || detailGroupIsLoading) {
    return <PageLoading text="공고 정보 가져오는 중" />;
  }

  const onClickChangeUserButton = (changeUser: IDetailUser) => {
    setDetailUser(changeUser);
    if (changeUser.mark?.mark) {
      editor?.commands.setContent(changeUser.mark?.mark);
    } else {
      editor?.commands.setContent("");
    }
  };

  return (
    <div className="max-w-screen mx-auto min-w-max">
      <Helmet>
        <title>PT 리뷰</title>
      </Helmet>
      <div className="grid grid-cols-12 gap-4 m-2">
        <div className=" col-span-4 min-h-full">
          <table className=" my-2 table-auto min-w-max  w-full bg-white shadow-md rounded select-none ">
            <thead className=" bg-blue-100">
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="p-2 text-left">No</th>
                <th className="p-2 text-left">이름</th>
                <th className="p-2 text-center">면접시간</th>
                <th className="p-2 text-center">과제시작시간</th>
                <th className="p-2 text-center">과제완료시간</th>
                <th className="p-2 text-center">출석여부</th>
                <th className="p-2 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 text-sm font-light">
              {detailGroupData.result?.detailUserList?.map(
                (detailUser, index: number) => (
                  <tr
                    key={detailUser.user.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="p-1 text-left">{index + 1}</td>
                    <td className="p-1 text-left hover:underline cursor-pointer">
                      <div
                        onClick={() => {
                          onClickChangeUserButton(detailUser);
                        }}
                      >
                        {detailUser.user.name}
                      </div>
                    </td>
                    <td className="p-1 text-center">
                      {detailUser.user.ptTime &&
                        detailUser.user.ptTime.toString().slice(0, 5)}
                    </td>
                    <td className="p-1 text-center">
                      {detailUser.mark?.startDate &&
                        moment(detailUser.mark.startDate).format(
                          "MMM Do hh:mm"
                        )}
                    </td>
                    <td className="p-1 text-center">
                      {detailUser?.user?.testState === UserTestState.Done &&
                        moment(detailUser?.mark?.endDate).format(
                          "MMM Do hh:mm"
                        )}
                    </td>
                    <td className="p-1 text-center">
                      {detailUser.user.isAttend ? "출석" : "결시"}
                    </td>
                    <td
                      onClick={() => {
                        setOpenMenuByTesterId(detailUser.user.id);
                      }}
                      className="p-2 text-center"
                    >
                      <FontAwesomeIcon
                        icon={faCog}
                        className="fa-lg mx-1 transform hover:text-purple-500 hover:scale-110"
                      />
                    </td>
                    {openMenuByTesterId === detailUser.user.id && (
                      <td className=" absolute mt-10 -ml-40 z-20  w-40 rounded-md shadow-xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none cursor-pointer">
                        <div className="py-1">
                          <div
                            onClick={() => {
                              reset({
                                testState: detailUser.user.testState,
                                timeRemaining: detailUser.mark?.timeRemaining,
                              });
                              onClickEditTestTimeButton(detailUser);
                            }}
                            className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            대상자 정보
                          </div>
                          <div ref={ref}></div>
                        </div>
                      </td>
                    )}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
        <div className="col-span-8 bg-white shadow-md rounded  m-2">
          <div className="flex p-2  justify-center items-center text-gray-800 ">
            <div className="flex-1 uppercase text-md leading-normal font-bold  ">
              PT 리뷰 - 지원자명 : [ {detailUser?.user.name} ]
            </div>
            <Link
              target={"_blank"}
              to={`/guide?normid=${detailGroupData.result?.group.normId}`}
              className="focus:outline-none text-gray-800 text-sm py-1.5 px-3 select-none border border-gray-800 hover:bg-gray-200"
            >
              면접위원 가이드북
            </Link>
          </div>
          <hr className=" w-full border-gray-300 " />
          <div
            style={{ maxHeight: "80vh" }}
            className=" max-h-screen overflow-auto"
          >
            <EditorContent className="min-w-min" editor={editor} />
          </div>
        </div>
      </div>
      {/* model list */}
      {isEditTesterModelOpen && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto select-none"
          ref={editTesterModelRef}
        >
          <div className=" items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center block p-0">
            <div
              onClick={() => {
                setIsEditTesterModelOpen(!isEditTesterModelOpen);
              }}
              className="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity"
              aria-hidden="true"
            ></div>
            <span
              className="inline-block align-middle h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block ring-2 ring-gray-400 bg-white rounded-sm text-left overflow-hidden shadow-xl transform transition-all my-8 align-middle max-w-lg w-full">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="bg-white pb-4">
                  <h4 className=" font-bold font-sans text-2xl  text-center py-4 bg-gray-100">
                    지원자 정보
                  </h4>
                  <hr className=" w-full border-gray-300 " />
                  <div className="flex justify-center items-center">
                    <div className="  p-2 mt-2 text-left grid grid-cols-2 gap-3 ">
                      <div className=" col-start-1 row-end-auto font-bold">
                        이름
                      </div>
                      <div className="col-start-2 row-end-auto font-bold">
                        인증키
                      </div>
                      <div className=" col-start-1 row-end-auto ">
                        {detailTester?.user?.name}
                      </div>
                      <div className="col-start-2 row-end-auto ">
                        {detailTester?.user?.password}
                      </div>
                      <div className=" col-start-1 row-end-auto font-bold ">
                        남은시간 (초)
                      </div>
                      <div className="col-start-2 row-end-auto font-bold">
                        검사 상태
                      </div>
                      <div className=" col-start-1 row-end-auto ">
                        <input
                          {...register("timeRemaining", {
                            required: "남은시간은 필수 입력값 입니다.",
                          })}
                          className="col-start-1 row-end-auto border border-gray-400 shadow-inner focus:ring-2 focus:ring-cyan-400 focus: outline-none   py-2 px-3 rounded-md "
                          defaultValue={detailTester?.mark?.timeRemaining}
                          type="number"
                        />
                      </div>
                      <select
                        {...register("testState", {
                          required: "검사상태는 필수 입력값 입니다.",
                        })}
                        className=" border border-gray-400 shadow-inner focus:ring-2 focus:ring-cyan-400 focus: outline-none   py-2 px-3 rounded-md  col-start-2 row-end-auto "
                        defaultValue={detailTester?.user?.testState}
                      >
                        <option key={UserTestState.Pending}>
                          {UserTestState.Pending}
                        </option>
                        <option key={UserTestState.InProgress}>
                          {UserTestState.InProgress}
                        </option>
                        <option key={UserTestState.Done}>
                          {UserTestState.Done}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-300 px-4 py-2  flex flex-row-reverse">
                  {detailTester &&
                    data &&
                    data.role === UserRole.SuperAdmin && (
                      <div className="w-20 ">
                        <FormButton
                          canClick={isValid}
                          loading={editTesterMutation.isLoading}
                          actionText={"변경"}
                        />
                      </div>
                    )}

                  <button
                    onClick={() => {
                      setIsEditTesterModelOpen(!isEditTesterModelOpen);
                    }}
                    type="button"
                    className="mr-3 bg-red-600 hover:bg-red-500 text-lg w-20 select-none font-medium focus:outline-none text-white py-3  transition-colors rounded-md "
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
