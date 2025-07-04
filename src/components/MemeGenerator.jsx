import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';

import React, { useEffect, useState } from "react";

const MemeGenerator = () => {
  const [memes, setMemes] = useState([]);
  const [randomMeme, setRandomMeme] = useState({});
  const [text, setText] = useState({ top: "", bottom: "" });
  const [history, setHistory] = useState([]);

  useEffect(() => {
  fetch("https://api.imgflip.com/get_memes")
    .then((res) => res.json())
    .then((data) => {
      setMemes(data.data.memes);
      console.log("Fetched memes:", data.data.memes); // ✅ Add this
    })
    .catch((err) => console.error("Error fetching memes:", err));
}, []);


  const generateMeme = () => {
  const randomIndex = Math.floor(Math.random() * memes.length);
  const meme = memes[randomIndex];
  console.log("Selected Meme URL:", meme?.url); // 👀 Add this line
  setRandomMeme(meme);

  setHistory((prev) => {
    const updated = [meme, ...prev];
    return updated.slice(0, 3); // limit to last 3
    });
}; 


  return (
  <div className="meme-container">
    <div className="controls">
      <input
        type="text"
        placeholder="Top Text"
        onChange={(e) => setText({ ...text, top: e.target.value })}
      />
      <input
        type="text"
        placeholder="Bottom Text"
        onChange={(e) => setText({ ...text, bottom: e.target.value })}
      />
      <button onClick={generateMeme}>Get a Meme</button>
    </div>

    {/* 👇 Add this below the controls div 👇 */}
    {randomMeme && randomMeme.url &&(
      <>
        <div className="meme">
          <img src={randomMeme.url} alt="Meme" />
          <h2 className="top-text">{text.top}</h2>
          <h2 className="bottom-text">{text.bottom}</h2>
        </div>
        <button onClick={downloadMeme} className="download-button">
          Download Meme
        </button>

      </>
    )}
    {history.length > 0 && (
  <div className="history">
    <h3>Recent Memes:</h3>
    <div className="history-list">
      {history.map((m, idx) => (
        <img
          key={idx}
          src={m.url}
          alt={`meme-${idx}`}
          style={{
            width: "100px",
            borderRadius: "8px",
            margin: "5px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        />
      ))}
    </div>
  </div>
)}

  </div>
);
};

export default MemeGenerator;


const downloadMeme = () => {
  const memeNode = document.querySelector(".meme");

  htmlToImage.toPng(memeNode)
    .then((dataUrl) => {
      download(dataUrl, "my-meme.png");
    })
    .catch((error) => {
      console.error("Download failed:", error);
    });
};



