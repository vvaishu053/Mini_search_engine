const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// In-memory storage for articles
let articles = [];
let nextId = 1;

// Add Article Endpoint
app.post("/articles", (req, res) => {
  const { title, content, tags } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required." });
  }
  const article = {
    id: nextId++,
    title,
    content,
    tags: tags || []

  };
  articles.push(article);
  res.status(201).json(article);
});

// Search Articles Endpoint
app.get("/articles/search", (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required." });
  }

  const keywords = query.toLowerCase().split(" ");
  const results = articles.filter(article => {
    const text = (article.title + " " + article.content).toLowerCase();
    return keywords.some(keyword => text.includes(keyword));
  });

  res.json(results);
});

// Get Article by ID Endpoint
app.get("/articles/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const article = articles.find(a => a.id === id);

  if (!article) {
    return res.status(404).json({ error: "Article not found." });
  }
  res.json(article);
});

// Start the server
const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
