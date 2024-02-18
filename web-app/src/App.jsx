import { useState } from 'react';
import './App.css'
import axios from 'axios';

const App = () => {
  const [magnet, setMagnet] = useState('')
  const [videos, setVideos] = useState([])

  function handleMagnet(e) {
    setMagnet(e.target.value)
  }

  const fetchMetadata = async () => {
    if (magnet == "") {
      throw new Error("no magnet url found")
    }

    try {
      const res = await axios.get(`${import.meta.env.VITE_REMOTE_SERVER.toString()}/metadata?magnet=${magnet}`)

      setVideos(res.data)
    } catch (error) {
      console.error('Error fetching video:', error);
    }
  };

  const streamVideo = async (e) => {
    const path = e.target.id;
    if (path === "") {
      throw new Error("path not found");
    }

    const endpoint = `${import.meta.env.VITE_REMOTE_SERVER.toString()}/stream?magnet=${magnet}&filePath=${path}`

    const videoElement = document.createElement('video');
    videoElement.controls = true;
    videoElement.src = endpoint;
    videoElement.style.width = '60%';

    const videoContainer = document.getElementById('video-container');

    if (videoContainer) {
      videoContainer.innerHTML = '';
      videoContainer.appendChild(videoElement);
    }
  };

  return (
    <div key={1234} style={{ textAlign: 'center', marginTop: '20px' }} className='container'>
      <input type="text" placeholder='Please enter the magnet URI here' onChange={handleMagnet} />
      <button onClick={fetchMetadata} >Fetch Video</button>

      <div id="video-container"></div>
      <h1>Total Videos: {videos.length}</h1>
      {videos.map((v) => {
        return <>
          <p key={Math.random()} onClick={streamVideo} id={v.path} >{v.name} - {v.size} MB</p>
        </>
      })}
    </div>
  );
};

export default App;
