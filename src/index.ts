import path from "path";
import authRouter from "./routes/auth/index";
import houseRouter from "./routes/house/index";
import { config } from "dotenv";
config({ path: path.resolve(__dirname, "../.env") });
import { WebSocketServer, WebSocket } from "ws";
import cors from "cors";
const PORT = 8080;

import express from "express";
import { Server } from "http";
import { JwtPayload, verify } from "jsonwebtoken";
import { Env } from "./config";
import { signupUser } from "./interfaces/signupUser";
import { checkUserHouse } from "./db/house";
import { postMessage } from "./db/message/postMessage";
import cookieParser from "cookie-parser";

type payloadType = Pick<signupUser, "id" | "email" | "firstname" | "lastname">;
class CustomWebSocket extends WebSocket {
  user?: payloadType;
}
const Connections = new Map();
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/house", houseRouter);

const server = app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));

async function start(server: Server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws: CustomWebSocket, req) => {
    let token;
    req.headers.cookie?.split(";").forEach((cookie) => {
      const [name, value] = cookie.trim().split("=");
      if (name === "token") token = value;
    });
    if (!token) {
      ws.close(401, "unauthorized connection");
      return;
    }
    const validToken = verify(token, Env.JWT_SECRET) as JwtPayload;
    if (!validToken) {
      ws.close(401, "unauthorized connection");
      return;
    }
    ws.user = {
      id: validToken.id,
      email: validToken.email,
      firstname: validToken.firstname,
      lastname: validToken.lastname,
    };

    ws.on("message", async (message) => {
      const { type, houseId, text } = JSON.parse(message.toString("utf-8"));
      switch (type) {
        case "join":
          if (!ws.user?.id) {
            ws.close(401, "unauthorized connection");
            return;
          }

          const validRequest = await checkUserHouse(ws.user?.id, houseId);
          if (!validRequest) {
            ws.close(400, "House-User mismatch");
            return;
          }
          if (!Connections.has(houseId)) {
            Connections.set(houseId, new Set());
          }
          Connections.get(houseId).add(ws);
          break;
        case "message":
          if (!Connections.get(houseId).has(ws)) {
            ws.close(401, "unauthorized connection");
            return;
          }
          if (!ws.user?.id) {
            ws.close(401, "unauthorized connection");
            return;
          }
          const message = await postMessage(ws.user?.id, houseId, text);
          const clients: Set<WebSocket> = Connections.get(houseId);

          clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(message));
            }
          });
      }
    });

    ws.on("close", () => {
      Connections.forEach((room: Set<WebSocket>) => {
        room.delete(ws);
      });
      console.log(`Client disconnected: ${JSON.stringify(ws.user)}`);
    });
  });
}

start(server)
  .then(() => console.log("started server!"))
  .catch(console.error);