export const LOCALSTORAGE_TOKEN = "pt-interview-token";
export const LOCALSTORAGE_PAGINATION_COUNT = "pt-interview-pagination-count";

export const Jwt = () => localStorage.getItem(LOCALSTORAGE_TOKEN) || "";

export enum UserRole {
  Admin = "Admin", // 면접위원
  SuperAdmin = "SuperAdmin", // 관리자
  Tester = "Tester", // 지원자
}

export enum UserTestState {
  Done = "Done", // 검사 완료
  Except = "Except", // 예외
  InProgress = "InProgress", // 진행중
  Pending = "Pending", // 결시 또는 미접속
}
// 기본 게시물 페이지 번호
export const Page = 1;
// 기본 게시물 개수
export const PageSize = () => {
  const pagesize = localStorage.getItem(LOCALSTORAGE_PAGINATION_COUNT);
  return pagesize !== null ? +pagesize : 15;
};
