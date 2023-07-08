import express from "express";
import config from "config"
import usersRouter from "./components/users/users.router";

const app = express();
app.use(express.json());

// config/default.json
const PORT = config.get("server.port") ?? 3001;

app.use("/users", usersRouter)

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
})
