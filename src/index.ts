import express from "express";
import config from "config";
import usersRouter from "./components/users/users.router";
import cors, { CorsOptions } from "cors";

const corsOptions: CorsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

// config/default.json
const PORT = config.get("server.port") ?? 3001;

app.use("/users", usersRouter);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
