import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

export async function fetchNewsArticles(query) {
  const newsApiKey = process.env.NEWS_API;
  const url = `https://newsapi.org/v2/everything?q=${query}&pageSize=10&apiKey=${newsApiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.articles) {
    return data.articles.map((article) => ({
      type: "article",
      title: article.title,
      description: article.description,
      url: article.url,
      thumbnail: article.urlToImage,
    }));
  } else {
    throw new Error("No articles found");
  }
}
