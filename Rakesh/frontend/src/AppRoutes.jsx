import {createBrowserRouter,Navigate} from "react-router"
import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register"
import ForgotPassword from "./features/auth/pages/ForgotPassword"
import Feed from "./features/posts/pages/Feed"
import CreatePost from "./features/posts/pages/CreatePost"
import People from "./features/follow/pages/People"
import FollowRequests from "./features/follow/pages/FollowRequests"
import Profile from "./features/auth/pages/Profile"
import ProtectedRoute from "./features/shared/components/ProtectedRoute"
import PublicRoute from "./features/shared/components/PublicRoute"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/login" />
    },
    {
        element: <PublicRoute />,
        children: [
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/register",
                element: <Register />
            },
            {
                path: "/forgot-password",
                element: <ForgotPassword />
            }
        ]
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "/feed",
                element: <Feed />
            },
            {
                path: "/create-post",
                element: <CreatePost />
            },
            {
                path: "/people",                  
                element: <People />
            },
            {
                path: "/follow-requests",         
                element: <FollowRequests />
            },
            { 
                path: "/profile", 
                element: <Profile />
            }
        ]
    }
])