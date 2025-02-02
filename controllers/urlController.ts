import type { Request, Response } from "express";
import { ulid } from "ulid";
import { createHash } from "crypto";
import QRCode from "qrcode";
import Url from "../models/Url";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Function to generate a short, secure ULID-based ID (8-10 chars)
const generateShortId = (length = 8): string => {
    return createHash("sha256").update(ulid()).digest("hex").substring(0, length);
};

// POST: Shorten a URL
export const shortenUrl = async (req: Request, res: Response): Promise<void> => {
    try {
        const { originalUrl } = req.body;
        if (!originalUrl) {
            res.status(400).json({ message: "Original URL is required" });
            return;
        }

        // Check if the URL already exists in the DB
        let existingUrl = await Url.findOne({ originalUrl });
        if (existingUrl) {
            res.status(200).json(existingUrl);
            return;
        }

        // Generate a unique short URL (8-10 characters)
        const shortUrl = generateShortId(8);
        const fullShortUrl = `${process.env.BASE_URL}/api/url/${shortUrl}`;

        // Generate QR Code for the short URL
        const qrCodeDataUrl = await QRCode.toDataURL(fullShortUrl);

        // Save to database
        const newUrl = await Url.create({ originalUrl, shortUrl });

        res.status(201).json({ ...newUrl.toObject(), qrCode: qrCodeDataUrl });
    } catch (error) {
        console.error("Error shortening URL:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// GET: Redirect to original URL
export const redirectUrl = async (req: Request, res: Response): Promise<void> => {
    try {
        const { shortUrl } = req.params;

        // Find the URL in the database
        const urlEntry = await Url.findOne({ shortUrl });
        if (!urlEntry) {
            res.status(404).json({ message: "Short URL not found" });
            return;
        }

        // Increment click count
        urlEntry.clicks += 1;
        await urlEntry.save();

        // Redirect to the original URL
        res.redirect(urlEntry.originalUrl);
    } catch (error) {
        console.error("Error redirecting URL:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// GET: Get visit count for a short URL
export const getVisitCount = async (req: Request, res: Response): Promise<void> => {
    try {
        const { shortUrl } = req.params;

        // Find the URL in the database
        const urlEntry = await Url.findOne({ shortUrl });
        if (!urlEntry) {
            res.status(404).json({ message: "Short URL not found" });
            return;
        }

        // Return the visit count
        res.status(200).json({ shortUrl, visitCount: urlEntry.clicks });
    } catch (error) {
        console.error("Error fetching visit count:", error);
        res.status(500).json({ message: "Server Error" });
    }
};