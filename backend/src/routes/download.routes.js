import express from "express";
import axios from "axios";
import JSZip from "jszip";

const router = express.Router();

router.post("/download-zip", async (req, res) => {
    try {
        const { imageUrls } = req.body; // Array of ImageKit URLs
        if (!imageUrls || imageUrls.length === 0) {
            return res.status(400).json({ error: "No images provided" });
        }

        const zip = new JSZip();

        // Fetch each image and add to ZIP
        for (let i = 0; i < imageUrls.length; i++) {
            const url = imageUrls[i];
            const response = await axios.get(url, { responseType: "arraybuffer" });

            // Save as file in ZIP
            zip.file(`image-${i + 1}.png`, response.data);
        }

        // Generate ZIP buffer
        const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

        // Set headers
        res.set({
            "Content-Type": "application/zip",
            "Content-Disposition": "attachment; filename=images.zip",
        });

        // Send ZIP file
        res.send(zipBuffer);

    } catch (error) {
        console.error("ZIP Download Error:", error);
        res.status(500).json({ error: "Failed to generate ZIP" });
    }
});

export default router;
