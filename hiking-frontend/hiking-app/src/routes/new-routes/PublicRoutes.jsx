import React, { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
import Layout from "../Layout";
import { LazyLoading } from "../../components/Loading/LazyLoading";
import ChatHelper from "../../components/ChatHelper/chathelper";

const SignUp = lazy(() => import("../../pages/signUp/SignUp"));
const Login = lazy(() => import("../../pages/login/Login"));
const Home = lazy(() => import("../../pages/home/Home"));
const AllTrails = lazy(() => import("../../components/AllTrails/AllTrails"));

const Trailspage = lazy(() => import("../../pages/Trails/Trailspage"));
const Contactus = lazy(() => import("../../pages/contactus/contactus"));
const AllEventsPage = lazy(() =>
  import("../../pages/Trails/Event/Events/EventsPage")
);

export default function publicRoutes() {
  return {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <Suspense
            fallback={
              <div>
                <LazyLoading />
              </div>
            }
          >
            <Home />
          </Suspense>
        ),
      },
      {
        path: "/login",
        element: (
          <Suspense
            fallback={
              <div>
                <LazyLoading />
              </div>
            }
          >
            <Login />
          </Suspense>
        ),
      },
      {
        path: "/sign-up",
        element: (
          <Suspense
            fallback={
              <div>
                <LazyLoading />
              </div>
            }
          >
            <SignUp />
          </Suspense>
        ),
      },

   
      {
        path: "/events",
        element: (
          <Suspense
            fallback={
              <div>
                <LazyLoading />
              </div>
            }
          >
            <AllEventsPage />
          </Suspense>
        ),
      },
      {
        path: "/trails/trail/:trailName",
        element: (
          <Suspense
            fallback={
              <div>
                <LazyLoading />
              </div>
            }
          >
            <Trailspage />
          </Suspense>
        ),
      },
      {
        path: "/ChatHelper",
        element: (
          <Suspense
            fallback={
              <div>
                <LazyLoading />
              </div>
            }
          >
            <ChatHelper/>
          </Suspense>
        ),
      },
      {
        path: "/contactus",
        element: (
          <Suspense
            fallback={
              <div>
                <LazyLoading />
              </div>
            }
          >
            <Contactus />
          </Suspense>
        ),
      },
      {
        path: "/all-trails",
        element: (
          <Suspense
            fallback={
              <div>
                <LazyLoading />
              </div>
            }
          >
            <AllTrails />
          </Suspense>
        ),
      },
      { path: "*", element: <Navigate to="/login" replace /> },
    ],
  };
}
