import axios from "axios";
import { Jwt, UserRole, UserTestState } from "../constant";
import {
  ICreateGroupInput,
  IEditGroupInput,
  ILoginInput,
  ICoreInput as ICoreSelectInput,
  ICreateUser,
  IGroup,
  IEditUserInput,
  ISearchUserInput,
  ICreateTesterInput,
  ICreateUserInput,
  ICreateNormInput,
  IEditNormInput,
  ISearchCoreInput as ICoreSearchInput,
  ICoreCreateInput,
  IUpdateMarkInput,
  ISearchInput,
  IEditTesterInput,
} from "./type";

axios.defaults.baseURL = "http://localhost:4000/";
// axios.defaults.baseURL = "https://ptinvtest.insahr.co.kr/";

export const apiMe = async () => {
  return axios
    .get("api/user/me", {
      headers: {
        "x-jwt": Jwt(),
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiStartTest = async () => {
  return axios
    .patch("api/user/start-test", null, {
      headers: {
        "x-jwt": Jwt(),
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiLogin = async ({ name, password, role }: ILoginInput) => {
  return axios
    .post("api/user/login", {
      name,
      password,
      role,
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiSearchGroup = async ({
  pagesize,
  page,
  searchType,
  searchValue,
}: ISearchInput) => {
  return axios
    .get(
      `${
        searchType && searchValue
          ? `api/group/search?pagesize=${pagesize}&page=${page}&searchType=${searchType}&searchValue=${searchValue}`
          : `api/group/search?pagesize=${pagesize}&page=${page}`
      }`,
      {
        headers: {
          "x-jwt": Jwt(),
        },
      }
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiDeleteGroup = async (id: number) => {
  return axios
    .delete(`api/group/${id}`, {
      headers: {
        "x-jwt": Jwt(),
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiDeleteUser = async (id: number) => {
  return axios
    .delete(`api/user/${id}`, {
      headers: {
        "x-jwt": Jwt(),
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiDeleteNorm = async (id: number) => {
  return axios
    .delete(`api/norm/${id}`, {
      headers: {
        "x-jwt": Jwt(),
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiDeleteOrientaion = async ({
  normId,
  page,
}: ICoreSelectInput) => {
  return axios
    .delete(`api/orientation?normId=${normId}&page=${page}`, {
      headers: {
        "x-jwt": Jwt(),
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiDeleteQuestion = async ({ normId, page }: ICoreSelectInput) => {
  return axios
    .delete(`api/question?normId=${normId}&page=${page}`, {
      headers: {
        "x-jwt": Jwt(),
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiDeleteGuide = async ({ normId, page }: ICoreSelectInput) => {
  return axios
    .delete(`api/guide?normId=${normId}&page=${page}`, {
      headers: {
        "x-jwt": Jwt(),
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiSelectGroup = async (id: number) => {
  return axios
    .get(`api/group/${id}`, {
      headers: {
        "x-jwt": Jwt(),
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiSelectUser = async (id: number) => {
  return axios
    .get(`api/user/${id}`, {
      headers: {
        "x-jwt": Jwt(),
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiSelectNorm = async (id: number) => {
  return axios
    .get(`api/norm/${id}`, {
      headers: {
        "x-jwt": Jwt(),
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiEditGroup = async ({
  groupId,
  name,
  normId,
  startDate,
  startTime,
  endDate,
  endTime,
}: IEditGroupInput) => {
  return axios
    .patch(
      `api/group`,
      {
        groupId: +groupId,
        name,
        normId: +normId,
        startDate: startDate + " " + startTime,
        endDate: endDate + " " + endTime,
      },
      {
        headers: {
          "x-jwt": Jwt(),
        },
      }
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiEditUser = async (editUserInput: IEditUserInput) => {
  return axios
    .patch(
      `api/user`,
      {
        ...editUserInput,
      },
      {
        headers: {
          "x-jwt": Jwt(),
        },
      }
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiEditTester = async (editTesterInput: IEditTesterInput) => {
  return axios
    .patch(
      `api/user/edit-tester`,
      {
        ...editTesterInput,
      },
      {
        headers: {
          "x-jwt": Jwt(),
        },
      }
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiEditNorm = async (editNormInput: IEditNormInput) => {
  return axios
    .patch(
      `api/norm`,
      {
        ...editNormInput,
      },
      {
        headers: {
          "x-jwt": Jwt(),
        },
      }
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiCreateGroup = async ({
  name,
  normId,
  startDate,
  startTime,
  endDate,
  endTime,
}: ICreateGroupInput) => {
  return axios
    .post(
      `api/group`,
      {
        name,
        normId: +normId,
        startDate: startDate + " " + startTime,
        endDate: endDate + " " + endTime,
      },
      {
        headers: {
          "x-jwt": Jwt(),
        },
      }
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiCreateAdmin = async ({
  name,
  password,
  groupIdList,
}: ICreateUser) => {
  return axios
    .post(
      `api/user`,
      {
        role: UserRole.Admin,
        name,
        password,
        testState: UserTestState.Except,
        groupIdList,
      },
      {
        headers: {
          "x-jwt": Jwt(),
        },
      }
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiCreateTester = async ({
  name,
  password,
  groupIdList,
  ptTime,
}: ICreateTesterInput) => {
  return axios
    .post(
      `api/user`,
      {
        role: UserRole.Tester,
        name,
        password,
        ptTime,
        testState: UserTestState.Pending,
        groupIdList,
      },
      {
        headers: {
          "x-jwt": Jwt(),
        },
      }
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiCreateNorm = async ({ name, timeLimit }: ICreateNormInput) => {
  return axios
    .post(
      `api/norm`,
      {
        name,
        timeLimit: +timeLimit,
      },
      {
        headers: {
          "x-jwt": Jwt(),
        },
      }
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiCreateOrientation = async ({
  normId,
  page,
  file,
}: ICoreCreateInput) => {
  const formData = new FormData();

  formData.append("normId", normId + "");
  formData.append("page", page + "");
  formData.append("file", file);

  return axios
    .post(
      `api/orientation`,

      formData,

      {
        headers: {
          "x-jwt": Jwt(),
          "Content-Type": "multipart/form-data",
        },
      }
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiCreateQuestion = async ({
  normId,
  page,
  file,
}: ICoreCreateInput) => {
  const formData = new FormData();

  formData.append("normId", normId + "");
  formData.append("page", page + "");
  formData.append("file", file);

  return axios
    .post(
      `api/question`,

      formData,

      {
        headers: {
          "x-jwt": Jwt(),
          "Content-Type": "multipart/form-data",
        },
      }
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiCreateGuide = async ({
  normId,
  page,
  file,
}: ICoreCreateInput) => {
  const formData = new FormData();

  formData.append("normId", normId + "");
  formData.append("page", page + "");
  formData.append("file", file);

  return axios
    .post(
      `api/guide`,

      formData,

      {
        headers: {
          "x-jwt": Jwt(),
          "Content-Type": "multipart/form-data",
        },
      }
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiEditOrientation = async ({
  normId,
  page,
  file,
}: ICoreCreateInput) => {
  const formData = new FormData();

  formData.append("normId", normId + "");
  formData.append("page", page + "");
  formData.append("file", file);

  return axios
    .patch(`api/orientation`, formData, {
      headers: {
        "x-jwt": Jwt(),
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiEditQuestion = async ({
  normId,
  page,
  file,
}: ICoreCreateInput) => {
  const formData = new FormData();

  formData.append("normId", normId + "");
  formData.append("page", page + "");
  formData.append("file", file);

  return axios
    .patch(`api/question`, formData, {
      headers: {
        "x-jwt": Jwt(),
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiEditGuide = async ({
  normId,
  page,
  file,
}: ICoreCreateInput) => {
  const formData = new FormData();

  formData.append("normId", normId + "");
  formData.append("page", page + "");
  formData.append("file", file);

  return axios
    .patch(`api/guide`, formData, {
      headers: {
        "x-jwt": Jwt(),
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiUpdateMark = async ({
  mark,
  memo,
  timeRemaining,
}: IUpdateMarkInput) => {
  return axios
    .patch(
      `api/mark/update`,
      {
        mark: mark,
        memo: memo,
        timeRemaining: timeRemaining,
      },
      {
        headers: {
          "x-jwt": Jwt(),
        },
      }
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiEndTest = async () => {
  return axios
    .patch(`api/user/end-test`, null, {
      headers: {
        "x-jwt": Jwt(),
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiUploadUserList = async ({
  userList,
  role,
}: ICreateUserInput) => {
  return axios
    .post(
      `api/user/upload`,
      {
        userList,
        role,
      },
      {
        headers: {
          "x-jwt": Jwt(),
        },
      }
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiUploadGroupList = async (groupList: IGroup[]) => {
  return axios
    .post(
      `api/group/upload`,
      {
        groupList,
      },
      {
        headers: {
          "x-jwt": Jwt(),
        },
      }
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiAllNorm = async () => {
  return axios
    .get(`api/norm/all`, {
      headers: {
        "x-jwt": Jwt(),
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiAllGroup = async () => {
  return axios
    .get(`api/group/all`, {
      headers: {
        "x-jwt": Jwt(),
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiSelectOrientation = async ({
  normId,
  page,
}: ICoreSelectInput) => {
  return axios
    .get(`api/orientation?normId=${normId}&page=${page}`, {
      headers: {
        "x-jwt": Jwt(),
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiSelectQuestion = async ({ normId, page }: ICoreSelectInput) => {
  return axios
    .get(`api/question?normId=${normId}&page=${page}`, {
      headers: {
        "x-jwt": Jwt(),
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiSelectGuide = async ({ normId, page }: ICoreSelectInput) => {
  return axios
    .get(`api/guide?normId=${normId}&page=${page}`, {
      headers: {
        "x-jwt": Jwt(),
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiSelectMark = async () => {
  return axios
    .get(`api/mark`, {
      headers: {
        "x-jwt": Jwt(),
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiDetailGroup = async (groupId: number) => {
  return axios
    .get(`api/group/detail/${groupId}`, {
      headers: {
        "x-jwt": Jwt(),
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiFindGuideListRelatedToRorm = async (normId: number) => {
  return axios
    .get(`api/guide/${normId}`, {
      headers: {
        "x-jwt": Jwt(),
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiSearchUser = async ({
  pagesize,
  page,
  searchType,
  searchValue,
  role,
}: ISearchUserInput) => {
  return axios
    .get(
      `${
        searchType && searchValue
          ? `api/user/search?pagesize=${pagesize}&page=${page}&searchType=${searchType}&searchValue=${searchValue}&role=${role}`
          : `api/user/search?pagesize=${pagesize}&page=${page}&role=${role}`
      }`,
      {
        headers: {
          "x-jwt": Jwt(),
        },
      }
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiSearchNorm = async ({
  pagesize,
  page,
  searchType,
  searchValue,
}: ISearchInput) => {
  return axios
    .get(
      `${
        searchType && searchValue
          ? `api/norm/search?pagesize=${pagesize}&page=${page}&searchType=${searchType}&searchValue=${searchValue}`
          : `api/norm/search?pagesize=${pagesize}&page=${page}`
      }`,
      {
        headers: {
          "x-jwt": Jwt(),
        },
      }
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiSearchOrientation = async ({
  pagesize,
  page,
  normId,
}: ICoreSearchInput) => {
  return axios
    .get(
      `api/orientation/search?pagesize=${pagesize}&page=${page}&normid=${normId}`,
      {
        headers: {
          "x-jwt": Jwt(),
        },
      }
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiSearchQuestion = async ({
  pagesize,
  page,
  normId,
}: ICoreSearchInput) => {
  return axios
    .get(
      `api/question/search?pagesize=${pagesize}&page=${page}&normid=${normId}`,
      {
        headers: {
          "x-jwt": Jwt(),
        },
      }
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiSearchGuide = async ({
  pagesize,
  page,
  normId,
}: ICoreSearchInput) => {
  return axios
    .get(
      `api/guide/search?pagesize=${pagesize}&page=${page}&normid=${normId}`,
      {
        headers: {
          "x-jwt": Jwt(),
        },
      }
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiDownloadTamplate = async (name: string) => {
  return axios
    .get(`api/download/template?name=${name}`, {
      headers: {
        "x-jwt": Jwt(),
      },
      responseType: "blob",
    })
    .then((res) => {
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: res.headers["content-type"] })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", name);
      document.body.appendChild(link);
      link.click();
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiDownloadGroup = async (name: string) => {
  return axios
    .get(`api/group/download`, {
      headers: {
        "x-jwt": Jwt(),
      },
      responseType: "blob",
    })
    .then((res) => {
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: res.headers["content-type"] })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", name);
      document.body.appendChild(link);
      link.click();
    })
    .catch((error) => {
      console.log(error);
    });
};

export const apiDownloadNorm = async (name: string) => {
  return axios
    .get(`api/norm/download`, {
      headers: {
        "x-jwt": Jwt(),
      },
      responseType: "blob",
    })
    .then((res) => {
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: res.headers["content-type"] })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", name);
      document.body.appendChild(link);
      link.click();
    })
    .catch((error) => {
      console.log(error);
    });
};
