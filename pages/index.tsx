import { getSession } from 'next-auth/react'
import Center from '../components/Center'
import Player from '../components/Player'
import Sidebar from '../components/Sidebar'

export default function Home() {
  return (
    <div className="h-screen overflow-hidden bg-black">
      <main className="flex ">
        <Sidebar />
        <Center />
      </main>
      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  )
}

export async function getStaticProps(context: any) {
  const session = await getSession(context)
  return {
    props: {
      session,
    },
  }
}
