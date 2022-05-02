import { useRecoilValue } from 'recoil'
import { playlistAtomState } from '../atoms/playlistAtoms'
import Song from './Song'

function Songs() {
  const playlist = useRecoilValue(playlistAtomState)

  return (
    <div className="flex-col space-y-1 px-8 pb-28 text-white">
      {/* @ts-ignore */}
      {playlist?.tracks.items.map((track: any, index: any) => (
        <Song key={track.track.id} track={track} order={index} />
      ))}
    </div>
  )
}

export default Songs
