import React from "react";
import { useQuery } from "react-query";
import { apiMe } from "./api/axios";
import { IMeOutput } from "./api/type";
import { PageLoading } from "./component/page-loading";
import { LoginRouter } from "./router/login-router";
import { LogoutRouter } from "./router/logout-router";

function App() {
  const { isLoading, data, status } = useQuery<IMeOutput>("me", apiMe);

  if (isLoading) {
    return <PageLoading text={`Loading`} />;
  }

  return status === "success" && data ? <LoginRouter /> : <LogoutRouter />;
}

export default App;
