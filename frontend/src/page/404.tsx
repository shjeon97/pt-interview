import React from "react";
import { Helmet } from "react-helmet-async";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { LOCALSTORAGE_TOKEN } from "../constant";

export const NotFound = () => {
  const queryClient = useQueryClient();

  const logout = () => {
    localStorage.removeItem(LOCALSTORAGE_TOKEN);
    queryClient.invalidateQueries("me");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <Helmet>
        <title>Not Found</title>
      </Helmet>
      <h2 className="font-semibold text-2xl mb-3">Page Not Found.</h2>
      <h4 className="font-medium text-base mb-5">
        해당 페이지를 찾을 수 없습니다.
      </h4>
      <div
        className="hover:underline text-red-500"
        onClick={() => window.history.go(-1)}
      >
        뒤로가기 &rarr;
      </div>
      <Link
        onClick={logout}
        className="hover:underline text-red-500"
        to="/tester-login"
      >
        지원자 로그인 페이지 &rarr;
      </Link>
      <Link
        onClick={logout}
        className="hover:underline text-red-500"
        to="/admin-login"
      >
        관리자 로그인 페이지 &rarr;
      </Link>
    </div>
  );
};
