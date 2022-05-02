/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { ChevronDownIcon } from '@heroicons/react/outline'
import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'

import { shuffle } from 'lodash'
import { useRecoilState, useRecoilValue } from 'recoil'
import { playlistAtomState, playliststate } from '../atoms/playlistAtoms'
import useSpotify from '../hooks/useSpotify'
import Songs from './Songs'

function Center() {
  const { data: session } = useSession()
  const [color, setColor] = React.useState(null)
  const spotifyApi = useSpotify()
  const playlistId = useRecoilValue(playliststate)
  const [playlist, setPlaylist] = useRecoilState(playlistAtomState)

  const colors = [
    'from-indigo-500',
    'from-blue-500',
    'from-green-500',
    'from-yellow-500',
    'from-orange-500',
    'from-red-500',
    'from-purple-500',
    'from-pink-500',
    'from-teal-500',
    'from-gray-500',
    'from-green-500',
  ]

  useEffect(() => {
    //@ts-ignore
    setColor(shuffle(colors).pop())
  }, [playlistId])

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data: any) => {
        setPlaylist(data.body)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [spotifyApi, playlistId])

  return (
    <div className="h-screen flex-grow overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div
          className="first-letter: flex cursor-pointer items-center space-x-3 rounded-full bg-black p-1 pr-2
          text-white opacity-90 hover:opacity-80"
        >
          <img
            className="h-10 w-10 rounded-full  object-cover"
            // @ts-ignore
            src={session?.user.image}
            alt="Profile"
          />
          {/* @ts-ignore */}
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className="h-6 w-6" />
        </div>
      </header>

      <section
        className={`flex h-80 items-end space-x-7 bg-gradient-to-b ${color} to-black p-8 text-white`}
      >
        <img
          className="h-44 w-44 shadow-2xl"
          // @ts-ignore
          src={playlist?.images?.[0]?.url}
          alt="Album"
        />
        <div>
          <p>PLAYLIST</p>
          <h1 className="text-2xl font-bold md:text-3xl xl:text-5xl ">
            {/* @ts-ignore */}
            {playlist?.name}
          </h1>
        </div>
      </section>

      <div>
        <Songs />
      </div>
    </div>
  )
}

export default Center
