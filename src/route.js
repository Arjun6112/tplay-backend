import express from "express";
import { createNewChannel } from "./controller/channel.js";
import authorization from "./middleware/auth.js";
import {
  generateShortLink,
  getMetadata,
  handleStreaming,
  searchTorrents,
  handleShortService,
  handleShortStats,
} from "./controller/torrent.js";
import { registerNewUser, login } from "./controller/user.js";

const router = express.Router();

router.get("/health", (res) => {
  res.sendStatus(200);
});

router.post("/user/register", registerNewUser);
router.post("/user/login", login);

router.get("/metadata", getMetadata);
router.get("/stream", handleStreaming);
router.get("/search", searchTorrents);

router.get("/generate/short", generateShortLink);
router.get("/short/:uid", handleShortService);
router.get("/short/stats/:uid", handleShortStats);

router.post("/channel/create", authorization, createNewChannel);

export default router;
