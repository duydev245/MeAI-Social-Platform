import React from 'react'

function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div>UserLayout</div>
      {children}
    </>
  )
}

export default UserLayout
