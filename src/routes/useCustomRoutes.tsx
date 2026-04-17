import AuthLayout from '@/layouts/auth.layout'
import ResetPassword from '@/modules/auth/ResetPassword'
import SignIn from '@/modules/auth/SignIn'
import SignUp from '@/modules/auth/SignUp'
import Forbidden from '@/modules/others/Forbidden'
import NotFound from '@/modules/others/NotFound'
import type { IRoleState } from '@/redux/type'
import { PATH } from '@/routes/path'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useRoutes } from 'react-router'

const RejectedAuthRouter = () => {
  const storedRole: string = useSelector((state: { role: IRoleState }) => state.role.currentRole)

  if (!storedRole) {
    return <Outlet />
  }

  return <Navigate to={PATH.HOME} replace />
}

// const ProtectedRouter = ({ roles }: { roles: string[] }) => {
//   const storedRole: string[] = useSelector((state: { role: IRoleState }) => state.role.currentRole)

//   if (!storedRole) {
//     return <Navigate to={PATH.LOGIN} replace />
//   }

//   if (storedRole && storedRole.some((role) => roles.includes(role))) {
//     return <Outlet />
//   }

//   return <Navigate to={PATH.FORBIDDEN} replace />
// }

const useCustomRoutes = () => {
  const routes = useRoutes([
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
    {
      path: PATH.HOME,
      element: <div>Home</div>
    },
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
