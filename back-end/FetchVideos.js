import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

export async function fetchYouTubeVideos(query) {
  const youtubeApiKey = process.env.YOUTUBE_API_KEY;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${youtubeApiKey}&maxResults=20`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.items) {
    return data.items.map((item) => ({
      type: "video",
      title: item.snippet.title,
      description: item.snippet.description,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails.default.url,
    }));
  } else {
    throw new Error("No videos found");
  }
}

// import fetch from "node-fetch";
// import dotenv from "dotenv";
// import express from "express";
// import bodyParser from "body-parser";
// import cors from "cors";

// dotenv.config();

// const app = express();
// const port = 3001;

// app.use(bodyParser.json());
// app.use(cors());

// async function fetchYouTubeVideos(query) {
//   const youtubeapiKey = process.env.YOUTUBE_API_KEY;
//   // const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${youtubeapiKey}`;

//   // const response = await fetch(url);
//   // const data = await response.json();
//   // const youtubeResponse = await fetch('https://www.googleapis.com/youtube/v3/search', {
//   //     params: {
//   //       key: youtubeapiKey,
//   //       part: 'snippet',
//   //       type: 'video',
//   //       q: 'mental health',
//   //       maxResults: 10,
//   //     },
//   //   });
//   //   const data = await youtubeResponse.json();
//   const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${youtubeapiKey}&maxResults=10`;

//   const response = await fetch(url);
//   const data = await response.json();

//   if (data.items) {
//     return data.items.map((item) => ({
//       type: "video",
//       title: item.snippet.title,
//       description: item.snippet.description,
//       url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
//       thumbnail: item.snippet.thumbnails.default.url,
//     }));
//   } else {
//     throw new Error("No videos found");
//   }
// }

// async function fetchNewsArticles(query) {
//   const newsApiKey = process.env.NEWS_API;
//   // const url = `https://newsapi.org/v2/everything?q=${query}&pageSize=10&apiKey=${newsApiKey}`;

//   // const response = await fetch(url);
//   // const data = await response.json();
//   // const newsResponse = await fetch("https://newsapi.org/v2/everything", {
//   //   params: {
//   //     apiKey: newsApiKey,
//   //     q: "mental health",
//   //     pageSize: 10,
//   //   },
//   // });
//   // const data = await newsResponse.json();
//   const url = `https://newsapi.org/v2/everything?q=${query}&pageSize=10&apiKey=${newsApiKey}`;

//   const response = await fetch(url);
//   const data = await response.json();

//   if (data.articles) {
//     return data.articles.map((article) => ({
//       type: "article",
//       title: article.title,
//       description: article.description,
//       url: article.url,
//       thumbnail: article.urlToImage,
//     }));
//   } else {
//     throw new Error("No articles found");
//   }
// }

// async function fetchMentalHealthContent() {
//   try {
//     const videos = await fetchYouTubeVideos("mental health");
//     const articles = await fetchNewsArticles("how to improve mental health");
//     return [...videos, ...articles];
//   } catch (error) {
//     console.error("Error fetching content:", error);
//   }
// }

// app.get("/api/blogs", async (req, res) => {
//   try {
//     const content = await fetchMentalHealthContent();
//     res.json(content);
//   } catch (error) {
//     res.status(500).send("Error fetching content");
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });
