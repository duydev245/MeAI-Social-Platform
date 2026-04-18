import AuthLayout from '@/layouts/auth.layout'
import ResetPassword from '@/modules/auth/ResetPassword'
import SignIn from '@/modules/auth/SignIn'
import SignUp from '@/modules/auth/SignUp'
import Forbidden from '@/modules/others/Forbidden'
import NotFound from '@/modules/others/NotFound'
import { PATH } from '@/routes/path'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useRoutes } from 'react-router'
import type { RootState } from '@/redux/store'
import PostFeed from '@/modules/user/PostFeed'

const RejectedAuthRouter = () => {
  const storedUser = useSelector((state: RootState) => state.currentUser.currentUser)

  if (!storedUser) {
    return <Outlet />
  }

  return <Navigate to={PATH.HOME} replace />
}

const useCustomRoutes = () => {
  const routes = useRoutes([
    // Auth routes
    {
      path: PATH.AUTH,
      element: <RejectedAuthRouter />,
      children: [
        {
          index: true,
          element: <Navigate to={PATH.LOGIN} replace />
        },
        {
          path: PATH.LOGIN,
          element: (
            <AuthLayout>
              <SignIn />
            </AuthLayout>
          )
        },
        {
          path: PATH.SIGN_UP,
          element: (
            <AuthLayout>
              <SignUp />
            </AuthLayout>
          )
        },
        {
          path: PATH.FORGOT_PASSWORD,
          element: (
            <AuthLayout>
              <ResetPassword />
            </AuthLayout>
          )
        }
      ]
    },
    // Protected routes (add auth check here if needed)
    {
      path: PATH.HOME,
      element: <PostFeed />
    },
    // Other routes
    {
      path: PATH.FORBIDDEN,
      element: <Forbidden />
    },
    {
      path: '*',
      element: <NotFound />
    }
  ])

  return routes
}

export default useCustomRoutes
