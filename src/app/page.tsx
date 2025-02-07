import Link from 'next/link'
import MainLayout from '@/layouts/MainLayout'

const Home = () => {
  return (
    <MainLayout>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <Link href="/eru-e1">Eru E1</Link>
        <Link href="/eru-t1">Eru T1</Link>
      </div>
    </MainLayout>
  )
}

export default Home
