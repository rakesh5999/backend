import { RouterProvider } from "react-router"
import { router } from "./AppRoutes"
import "./features/shared/style.scss"
import { AuthProvider } from "./features/auth/auth.context"
import { PostContextProvider } from "./features/posts/post.context"
import { FollowContextProvider } from "./features/follow/follow.context"
import { useAuth } from "./features/auth/hooks/useAuth"  // ← add

// ← add this small component
function AppContent() {
    useAuth()  // this runs getme on every page load — restores logged in user
    return <RouterProvider router={router} />
}

function App() {
    return (
        <AuthProvider>
            <PostContextProvider>
                <FollowContextProvider>
                    <AppContent />  {/* ← replace RouterProvider with this */}
                </FollowContextProvider>
            </PostContextProvider>
        </AuthProvider>
    )
}

export default App