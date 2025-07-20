import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBinSurveyEntrySchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for photo uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all bin survey entries
  app.get("/api/entries", async (req, res) => {
    try {
      const entries = await storage.getAllBinSurveyEntries();
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch entries" });
    }
  });

  // Get unsynced entries (must come before :id route)
  app.get("/api/entries/unsynced", async (req, res) => {
    try {
      const entries = await storage.getUnsyncedEntries();
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch unsynced entries" });
    }
  });

  // Get single bin survey entry
  app.get("/api/entries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const entry = await storage.getBinSurveyEntry(id);
      
      if (!entry) {
        return res.status(404).json({ message: "Entry not found" });
      }
      
      res.json(entry);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch entry" });
    }
  });

  // Create new bin survey entry
  app.post("/api/entries", upload.single('photo'), async (req, res) => {
    try {
      const validatedData = insertBinSurveyEntrySchema.parse(req.body);
      
      // If photo was uploaded, save the file path
      if (req.file) {
        validatedData.photoUri = `/uploads/${req.file.filename}`;
      }
      
      const entry = await storage.createBinSurveyEntry(validatedData);
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create entry" });
    }
  });

  // Update bin survey entry
  app.patch("/api/entries/:id", upload.single('photo'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      // If photo was uploaded, save the file path
      if (req.file) {
        updateData.photoUri = `/uploads/${req.file.filename}`;
      }
      
      const entry = await storage.updateBinSurveyEntry(id, updateData);
      
      if (!entry) {
        return res.status(404).json({ message: "Entry not found" });
      }
      
      res.json(entry);
    } catch (error) {
      res.status(500).json({ message: "Failed to update entry" });
    }
  });

  // Delete bin survey entry
  app.delete("/api/entries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBinSurveyEntry(id);
      
      if (!success) {
        return res.status(404).json({ message: "Entry not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete entry" });
    }
  });

  // Mark entry as synced
  app.patch("/api/entries/:id/sync", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.markAsSynced(id);
      
      if (!success) {
        return res.status(404).json({ message: "Entry not found" });
      }
      
      res.json({ message: "Entry marked as synced" });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark entry as synced" });
    }
  });

  // Reset all entries for a specific street
  app.delete("/api/streets/:street/reset", async (req, res) => {
    try {
      const street = decodeURIComponent(req.params.street);
      const deletedCount = await storage.deleteEntriesByStreet(street);
      
      res.json({ 
        message: `Deleted ${deletedCount} entries for ${street}`,
        deletedCount 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to reset street data" });
    }
  });

  // Export entries as CSV
  app.get("/api/export/csv", async (req, res) => {
    try {
      const entries = await storage.getAllBinSurveyEntries();
      
      // Create CSV content
      const headers = ['ID', 'Date/Time', 'Street', 'Latitude', 'Longitude', 'Bin Types', 'Quantity', 'Comments', 'Synced'];
      const csvRows = [
        headers.join(','),
        ...entries.map(entry => [
          entry.id,
          entry.datetime.toISOString(),
          `"${entry.street}"`,
          entry.latitude,
          entry.longitude,
          `"${entry.binTypes.join(', ')}"`,
          entry.quantity,
          `"${entry.comments || ''}"`,
          entry.synced
        ].join(','))
      ];
      
      const csvContent = csvRows.join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="waste-bin-survey-${Date.now()}.csv"`);
      res.send(csvContent);
    } catch (error) {
      res.status(500).json({ message: "Failed to export CSV" });
    }
  });

  // Export entries as GeoJSON
  app.get("/api/export/geojson", async (req, res) => {
    try {
      const entries = await storage.getAllBinSurveyEntries();
      
      const geojson = {
        type: "FeatureCollection",
        features: entries.map(entry => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [entry.longitude, entry.latitude]
          },
          properties: {
            id: entry.id,
            datetime: entry.datetime.toISOString(),
            street: entry.street,
            binTypes: entry.binTypes,
            quantity: entry.quantity,
            comments: entry.comments,
            synced: entry.synced
          }
        }))
      };
      
      res.setHeader('Content-Type', 'application/geo+json');
      res.setHeader('Content-Disposition', `attachment; filename="waste-bin-survey-${Date.now()}.geojson"`);
      res.json(geojson);
    } catch (error) {
      res.status(500).json({ message: "Failed to export GeoJSON" });
    }
  });

  // Serve uploaded photos
  app.use('/uploads', express.static('uploads'));

  // Ensure uploads directory exists
  if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
  }

  const httpServer = createServer(app);
  return httpServer;
}
