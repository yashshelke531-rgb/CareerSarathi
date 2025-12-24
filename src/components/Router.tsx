import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import HomePage from '@/components/pages/HomePage';
import ExplorePage from '@/components/pages/ExplorePage';
import CareerDetailPage from '@/components/pages/CareerDetailPage';
import GuidancePage from '@/components/pages/GuidancePage';
import SearchPage from '@/components/pages/SearchPage';
import SkillTestPage from '@/components/pages/SkillTestPage';
import CareerComparePage from '@/components/pages/CareerComparePage';
import AIMentorPage from '@/components/pages/AIMentorPage';
import ExamsPage from '@/components/pages/ExamsPage';
import ExamDetailPage from '@/components/pages/ExamDetailPage';

// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "explore",
        element: <ExplorePage />,
      },
      {
        path: "career/:id",
        element: <CareerDetailPage />,
      },
      {
        path: "guidance",
        element: <GuidancePage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "skill-test",
        element: <SkillTestPage />,
      },
      {
        path: "career-compare",
        element: <CareerComparePage />,
      },
      {
        path: "exams",
        element: <ExamsPage />,
      },
      {
        path: "exam/:id",
        element: <ExamDetailPage />,
      },
      {
        path: "ai-mentor",
        element: <AIMentorPage />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
