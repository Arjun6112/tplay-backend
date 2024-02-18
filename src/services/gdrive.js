import axios from "axios";

export async function downloadFromGoogleDrive(url, res) {
  const fileId = extractFileIdFromUrl(url);

  try {
    const metadata = await axios.get(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=name,size,mimeType&key=${process.env.API_KEY}`);
    const response = await axios({
      url: `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${process.env.API_KEY}`,
      method: "GET",
      responseType: "stream",
    });

    response.data.pipe(res);

    const total_length = response.headers["content-length"];
    let current_length = 0;
    let previous_progress = 0;

    response.data.on("data", (chunk) => {
      current_length += chunk.length;
      let progress = (total_length - current_length) / 1000000;
      progress = progress.toFixed(0);
      if (progress !== previous_progress) {
        console.log(`${progress}mb left`);
      }
      previous_progress = progress;
    });
  } catch (error) {
    console.log(error);
  }
}

function extractFileIdFromUrl(url) {
  const match = url.match(/\/file\/d\/([^/]+)/);
  if (match && match[1]) {
    return match[1];
  } else {
    console.error("Invalid Google Drive URL");
    return null;
  }
};
