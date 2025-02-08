import Link from 'next/link'
import MainLayout from '@/layouts/MainLayout'
import StatementLinkCard from '@/components/statementLinkCard'

const Home = () => {
  return (
    <div className="min-w-full min-h-full flex justify-center items-center translate-y-2/5">
      <div className="grid grid-cols-2 gap-4 ">
        <section className="">
          <article className="mb-4">
            <h1>Eru Builder</h1>
            <p>
              Eru Builder is a tool that allows you to build your own Eru.
            </p>
          </article>
        </section>
        <section className="w-full flex flex-col gap-8 justify-center items-center">
          <StatementLinkCard title="Eru E1" description="Eru E1 is a tool that allows you to build your own Eru." link="/eru-e1" />
          <StatementLinkCard title="Eru T1" description="Eru T1 is a tool that allows you to build your own Eru." link="/eru-t1" />
        </section>
      </div>
    </div>
  )
}

export default Home
