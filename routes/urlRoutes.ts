import express from "express";
import { getVisitCount, redirectUrl, shortenUrl } from "../controllers/urlController";

const router = express.Router();

router.post("/shorten", shortenUrl);  // Create short URL
router.get("/:shortUrl", redirectUrl); // Redirect using short URL
router.get("/:shortUrl/visits", getVisitCount); // Get visit count for short URL

export default router;
