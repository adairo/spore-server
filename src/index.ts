import express from "express";

const app = express();
app.use(express.json());

const PORT = 3000;

app.get("/ping", (_, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
})
