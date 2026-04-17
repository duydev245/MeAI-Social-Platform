import React from 'react'

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div>AuthLayout</div>
      {children}
    </>
  )
}

export default AuthLayout
