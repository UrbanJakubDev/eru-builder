import Footer from '@/components/footer'
import Header from '@/components/header'
import { ReactNode } from 'react'
import Toast from '@/components/toas'
const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow w-full max-w-screen-2xl mx-auto justify-center items-center py-4">
          {children}
        </main>
        <Footer />
      </div>
      <Toast />
    </>
  )
}

export default MainLayout 