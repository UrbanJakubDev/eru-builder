import { ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  )
}

export default MainLayout 