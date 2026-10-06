import express from "express";
import cors from "cors";
const app = express();
app.use(cors(), express.json());
const messages = [];
let id = 1;
app.get("/messages", (req, res) => {
  const from = Number(req.query.from) || 0;
  res.json(messages.filter((m) => m.id > from));
});
app.post("/messages", (req, res) => {
  messages.push({ ...req.body, id: id++ });
  res.sendStatus(204);
});
app.listen(7070, () => console.log("Chat API: http://localhost:7070"));
