import React, { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
import { LazyLoading } from "../../components/Loading/LazyLoading";
import Layout from "../Layout";
import { ProtectedRoutes } from "../ProtectedRoutes";

const HikingBuddy = lazy(() => import("../../pages/hikingBuddy/HikingBuddy"));
const UserProfile = lazy(() => import("../../pages/userProfile/UserProfile"));
const Reminder = lazy(() => import("../../pages/Reminder/Reminder"));
const UserTrailStats = lazy(() =>
  import("../../pages/userTrailStats/UserTrailStats")
);
const PastTrails = lazy(() => import("../../components/pastTrails/PastTrails"));
const Form = lazy(() => import("../../pages/userTrailStats/Form"));
const PastTrailItem = lazy(() =>
  import("../../components/pastTrails/PastTrailItem")
);
const GearPage = lazy(() => import("../../pages/gear/Gear"));
const CartPage = lazy(() => import("../../pages/cart/Cart"));
const OrdersPage = lazy(() => import("../../pages/orders/Orders"));
const ChatInterface = lazy(() =>
  import("../../components/ChatInterface/chatInterface")
);
const BlogForm = lazy(() => import("../../pages/blogPosts/BlogForm"));
const SingleBlogPost = lazy(() =>
  import("../../pages/blogPosts/SingleBlogPost")
);
const BlogPosts = lazy(() => import("../../pages/blogPosts/BlogPosts"));

const TrailEvents = lazy(() =>
  import("../../pages/Trails/Event/EventFromTrail/IncomingEventsPage")
);

export default function privateRoutes() {
  return {
    element: <Layout />,
    children: [
      {
        path: "/hiking-buddy",
        element: (
          <Suspense
            fallback={
              <div>
                <LazyLoading />
              </div>
            }
          >
            <HikingBuddy />
          </Suspense>
        ),
      },
      {
        path: "/profile",
        element: (
          <Suspense
            fallback={
              <div>
                <LazyLoading />
              </div>
            }
          >
            <UserProfile />
          </Suspense>
        ),
      },
      {
        path: "/reminder",
        element: (
          <Suspense
            fallback={
              <div>
                <LazyLoading />
              </div>
            }
          >
            <Reminder />
          </Suspense>
        ),
      },
      {
        path: "/gear",
        element: (
          <Suspense
            fallback={
              <div>
                <LazyLoading />
              </div>
            }
          >
            <GearPage />
          </Suspense>
        ),
      },
      {
        path: "/cart",
        element: (
          <Suspense
            fallback={
              <div>
                <LazyLoading />
              </div>
            }
          >
            <CartPage />
          </Suspense>
        ),
      },
      {
        path: "/orders",
        element: (
          <Suspense
            fallback={
              <div>
                <LazyLoading />
              </div>
            }
          >
            <OrdersPage />
          </Suspense>
        ),
      },
      {
        path: "/chatinterface",
        element: (
          <Suspense
            fallback={
              <div>
                <LazyLoading />
              </div>
            }
          >
            <ChatInterface />
          </Suspense>
        ),
      },
      {
        path: "/user-stats",
        element: (
          <ProtectedRoutes>
            <Suspense
              fallback={
                <div>
                  <LazyLoading />
                </div>
              }
            >
              <UserTrailStats />
            </Suspense>
          </ProtectedRoutes>
        ),
        children: [
          {
            index: true,
            path: "past-trails",
            element: (
              <Suspense
                fallback={
                  <div>
                    <LazyLoading />
                  </div>
                }
              >
                <PastTrails />
              </Suspense>
            ),
          },
          {
            path: "form",
            element: (
              <Suspense
                fallback={
                  <div>
                    {" "}
                    <LazyLoading />
                  </div>
                }
              >
                <Form />
              </Suspense>
            ),
          },
          {
            path: "past-trails/:id",
            element: (
              <Suspense
                fallback={
                  <div>
                    {" "}
                    <LazyLoading />
                  </div>
                }
              >
                <PastTrailItem />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "/blog-posts",
        element: (
          <Suspense
            fallback={
              <div>
                {" "}
                <LazyLoading />
              </div>
            }
          >
            <BlogPosts />
          </Suspense>
        ),
      },
      {
        path: "/blog-posts/:id",
        element: (
          <Suspense
            fallback={
              <div>
                {" "}
                <LazyLoading />
              </div>
            }
          >
            <SingleBlogPost />
          </Suspense>
        ),
      },
      {
        path: "/blog-form",
        element: (
          <Suspense
            fallback={
              <div>
                {" "}
                <LazyLoading />
              </div>
            }
          >
            <BlogForm />
          </Suspense>
        ),
      },
      {
        path: "/incoming-events/:trailId",
        element: (
          <Suspense
            fallback={
              <div>
                <LazyLoading />
              </div>
            }
          >
            <TrailEvents />
          </Suspense>
        ),
      },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  };
}
