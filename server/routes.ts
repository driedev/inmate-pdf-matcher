import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from 'multer';
import { storage } from "./storage";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";
import { scrapeInmates } from "./scraper";
import { extractTextFromPDF, extractNamesFromText, matchNames } from "./matcher";
import { detectDocumentType } from "./openai";
import { sendAlertEmail } from "./email";

// Setup multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .pdf format allowed!'));
    }
  }
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.inmates.list.path, async (req, res) => {
    try {
      const inmates = await storage.getInmates();
      res.json(inmates);
    } catch (e) {
      res.status(500).json({ message: "Internal error" });
    }
  });

  app.get(api.inmates.scrape.path, async (req, res) => {
    try {
      const inmates = await scrapeInmates();
      await storage.saveInmates(inmates);
      res.json({ success: true, count: inmates.length });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Failed to scrape" });
    }
  });

  app.post(api.pdf.upload.path, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No PDF file uploaded" });
      }

      // 1. Extract text
      const text = await extractTextFromPDF(req.file.buffer);

      // 2. Detect doc type
      const docTypeInfo = await detectDocumentType(text);
      const needsReview = docTypeInfo.confidence < 0.7;

      // 3. Extract names
      const extractedNames = extractNamesFromText(text);

      // 4. Match names against roster
      const roster = await storage.getInmates();
      const matches = matchNames(extractedNames, roster);

      const response = {
        documentType: docTypeInfo.type,
        typeConfidence: docTypeInfo.confidence,
        needsReview,
        extractedText: text,
        matches
      };

      // 5. Send email if matches found
      if (matches.some(m => m.isMatch)) {
         await sendAlertEmail(response);
      }

      res.json(response);
    } catch (e: any) {
      console.error("Upload error:", e);
      if (e.message === 'Only .pdf format allowed!') {
        return res.status(400).json({ message: e.message });
      }
      res.status(500).json({ message: "Failed to process PDF" });
    }
  });

  return httpServer;
}
