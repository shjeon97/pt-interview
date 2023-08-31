import React from "react";
import { useQuery } from "react-query";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { apiMe } from "../api/axios";
import { AdminHeader } from "../component/admin-header";
import { PageLoading } from "../component/page-loading";
import { TeseterHeader } from "../component/tester-header";
import { UserRole, UserTestState } from "../constant";
import { NotFound } from "../page/404";
import { DetailGroup } from "../page/admin/detail-group";
import { Guide } from "../page/admin/guide";
import { SearchGroup } from "../page/admin/search-group";
import { CreateAdmin } from "../page/super-admin/create-admin";
import { UploadAdminList } from "../page/super-admin/upload-admin-list";
import { CreateGroup } from "../page/super-admin/create-group";
import { EditGroup } from "../page/super-admin/edit-group";
import { SearchAdmin } from "../page/super-admin/search-admin";
import { Orientation } from "../page/tester/orientation";
import { UploadGroupList } from "../page/super-admin/upload-group-list";
import { EditAdmin } from "../page/super-admin/edit-admin";
import { SearchTester } from "../page/super-admin/search-tester";
import { CreateTester } from "../page/super-admin/create-tester";
import { EditTester } from "../page/super-admin/edit-tester";
import { UploadTesterList } from "../page/super-admin/upload-tester-list";
import { SearchNorm } from "../page/super-admin/search-norm";
import { CreateNorm } from "../page/super-admin/create-norm";
import { EditNorm } from "../page/super-admin/edit-norm";
import { SearchOrientation } from "../page/super-admin/search-orientation";
import { CreateOrientation } from "../page/super-admin/create-orientation";
import { EditOrientation } from "../page/super-admin/edit-orientation";
import { SearchQuestion } from "../page/super-admin/search-question";
import { CreateQuestion } from "../page/super-admin/create-question";
import { EditQuestion } from "../page/super-admin/edit-question";
import { SearchGuide } from "../page/super-admin/search-guide";
import { CreateGuide } from "../page/super-admin/create-guide";
import { EditGuide } from "../page/super-admin/edit-guide";
import { Test } from "../page/tester/test";
import { Preview } from "../page/tester/preview";
import Swal from "sweetalert2";
import { EditSuperAdmin } from "../page/super-admin/edit-superadmin";

const adminRoute = [
  { path: "/search-group", component: <SearchGroup /> },
  { path: "/detail-group/:groupId", component: <DetailGroup /> },
  { path: "/guide", component: <Guide /> },
];

const superAdminRoute = [
  { path: "/edit-group/:groupId", component: <EditGroup /> },
  { path: "/edit-admin/:adminId", component: <EditAdmin /> },
  { path: "/edit-superadmin", component: <EditSuperAdmin /> },
  { path: "/edit-tester/:testerId", component: <EditTester /> },
  { path: "/edit-norm/:normId", component: <EditNorm /> },
  { path: "/edit-orientation", component: <EditOrientation /> },
  { path: "/edit-question", component: <EditQuestion /> },
  { path: "/edit-guide", component: <EditGuide /> },
  { path: "/create-group", component: <CreateGroup /> },
  { path: "/create-admin", component: <CreateAdmin /> },
  { path: "/create-tester", component: <CreateTester /> },
  { path: "/create-norm", component: <CreateNorm /> },
  { path: "/create-orientation", component: <CreateOrientation /> },
  { path: "/create-question", component: <CreateQuestion /> },
  { path: "/create-guide", component: <CreateGuide /> },
  { path: "/upload-admin-list", component: <UploadAdminList /> },
  { path: "/upload-group-list", component: <UploadGroupList /> },
  { path: "/upload-tester-list", component: <UploadTesterList /> },
  { path: "/search-admin", component: <SearchAdmin /> },
  { path: "/search-tester", component: <SearchTester /> },
  { path: "/search-norm", component: <SearchNorm /> },
  { path: "/search-orientation", component: <SearchOrientation /> },
  { path: "/search-question", component: <SearchQuestion /> },
  { path: "/search-guide", component: <SearchGuide /> },
];

export const LoginRouter = () => {
  const { isLoading, data } = useQuery("me", apiMe);
  if (isLoading) {
    return <PageLoading text={"Loading"} />;
  }

  return (
    <Router>
      <div
        className="min-w-min bg-gray-50 min-h-screen"
        // 지원자일 경우 우클릭 제어
        onContextMenu={(e) => {
          if (data.role === UserRole.Tester) {
            Swal.fire({
              icon: "error",
              title: "우클릭 사용 불가",
            });
            e.preventDefault();
          }
        }}
      >
        {/* 지원자,관리자 , 최고관리자 분기 처리 */}
        {data.role === UserRole.Tester ? (
          <TeseterHeader />
        ) : (
          <AdminHeader name={data.name} />
        )}
        <Routes>
          {/* 지원자  상태 : 미응시*/}
          {data.role === UserRole.Tester &&
            data.testState === UserTestState.Pending && (
              <Route path="/orientation" element={<Orientation />} />
            )}
          {/* 지원자  상태 : 진행중*/}
          {data.role === UserRole.Tester &&
            data.testState === UserTestState.InProgress && (
              <>
                <Route path="/test" element={<Test />} />
              </>
            )}

          {/* 지원자  상태 : 완료*/}
          {data.role === UserRole.Tester &&
            data.testState === UserTestState.Done && (
              <>
                <Route path="/preview" element={<Preview />} />
              </>
            )}

          {/* 관리자 , 최고관리자  */}
          {data.role !== UserRole.Tester &&
            adminRoute.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.component}
              />
            ))}
          {/* 최고관리자 */}
          {data.role !== UserRole.Tester &&
            superAdminRoute.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.component}
              />
            ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};
