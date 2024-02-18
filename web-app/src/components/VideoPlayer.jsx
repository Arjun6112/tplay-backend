import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import './style.css'

import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';

const VideoPlayer = (videoUrl) => {
  return (
    <MediaPlayer
      title="Sprite Fight"
      src={videoUrl}
      className='player'
    >
      <MediaProvider />
      <DefaultVideoLayout thumbnails="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/storyboard.vtt" icons={defaultLayoutIcons} />
    </MediaPlayer>
  )
}

export default VideoPlayer