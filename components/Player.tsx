/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import {
  HeartIcon,
  ReplyIcon,
  VolumeUpIcon as VolumeDownIcon,
} from '@heroicons/react/outline'

import {
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  RewindIcon,
  VolumeUpIcon,
  SwitchHorizontalIcon,
} from '@heroicons/react/solid'
import { debounce } from 'lodash'

import { useSession } from 'next-auth/react'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom'
import useSongInfo from '../hooks/useSongInfo'
import useSpotify from '../hooks/useSpotify'

function Player() {
  const spotifyApi = useSpotify()
  const { data: session, status } = useSession()

  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState)

  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)

  const [volume, setVolume] = useState(50)

  const songInfo = useSongInfo()

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data: any) => {
        setCurrentTrackId(data.body?.item?.id)
        console.log(data.body?.item?.id)

        spotifyApi.getMyCurrentPlaybackState().then((data: any) => {
          setIsPlaying(data.body?.is_playing)
        })
      })
    }
  }

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data: any) => {
      if (data.body?.is_playing) {
        spotifyApi.pause()
        setIsPlaying(false)
      } else {
        spotifyApi.play()
        setIsPlaying(true)
      }
    })
  }

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      // fetch current track id
      fetchCurrentSong()
      setVolume(50)
    }
  }, [currentTrackId, spotifyApi])

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume)
    }
  }, [volume])

  const debouncedAdjustVolume = useCallback(
    debounce((volume: any) => {
      spotifyApi.setVolume(volume).catch((err: any) => {})
    }, 500),
    []
  )

  return (
    <div className="grid  h-24 grid-cols-3 bg-gradient-to-b from-black to-gray-900 px-2 text-xs text-white md:px-8 md:text-base">
      <div className="items-centers flex space-x-4">
        <img
          className="hidden h-10 w-10 md:inline"
          src={songInfo?.album.images?.[0]?.url}
          alt="Song track"
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>
      {/* Center */}
      <div className="flex items-center justify-between">
        <SwitchHorizontalIcon className="h-5 w-5 transform cursor-pointer duration-100 ease-out hover:scale-125" />
        <RewindIcon className="h-5 w-5 transform cursor-pointer duration-100 ease-out hover:scale-125" />
        {isPlaying ? (
          <PauseIcon
            onClick={handlePlayPause}
            className="h-10 w-10 transform cursor-pointer duration-100 ease-out hover:scale-125"
          />
        ) : (
          <PlayIcon
            onClick={handlePlayPause}
            className="h-10 w-10 transform cursor-pointer duration-100 ease-out hover:scale-125"
          />
        )}
        <FastForwardIcon className="h-5 w-5 transform cursor-pointer duration-100 ease-out hover:scale-125" />

        <ReplyIcon className="h-5 w-5 transform cursor-pointer duration-100 ease-out hover:scale-125" />
      </div>

      <div className="flex items-center justify-end space-x-3 pr-5 md:space-x-4">
        <VolumeDownIcon
          onClick={() => {
            setVolume(volume - 10)
          }}
          className="h-5 w-5 transform cursor-pointer duration-100 ease-out hover:scale-125"
        />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          className="w-14 md:w-28"
          onChange={(e: any) => setVolume(Number(e.target.value))}
        />
        <VolumeUpIcon
          onClick={() => {
            setVolume(volume + 10)
          }}
          className="h-5 w-5 transform cursor-pointer duration-100 ease-out hover:scale-125"
        />
      </div>
    </div>
  )
}

export default Player
