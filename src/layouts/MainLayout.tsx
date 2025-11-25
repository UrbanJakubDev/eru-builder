import Footer from '@/components/footer'
import Header from '@/components/header'
import { ReactNode } from 'react'
import Toast from '@/components/toas'
const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex flex-col w-full max-w-screen-2xl mx-auto items-center py-8 px-4">
          {children}
        </main>
        <Footer />
      </div>
      <Toast />
    </>
  )
}

export default MainLayout 