import poppler from "pdf-poppler";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const Jimp = require("jimp");
const QrCode = require("qrcode-reader");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Extracts the unique ID from a QR code in the document.
 * @param {string} filePath - Path to the PDF file.
 * @returns {Promise<string>} - Extracted unique ID from the QR code.
 */
const extractUserIdFromQR = async (filePath) => {
  const outputDir = path.join(__dirname, "temp");
  let imagePath, processedImagePath;
  try {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const options = {
      format: "jpeg",
      out_dir: outputDir,
      out_prefix: "page",
      page: 1,
    };

    await poppler.convert(filePath, options);
    imagePath = path.join(outputDir, "page-1.jpg");

    const image = await Jimp.read(imagePath);

    const croppedImage = image.crop(
      0,
      0,
      image.bitmap.width / 3,
      image.bitmap.height / 3
    );
    croppedImage.greyscale().contrast(1).resize(500, 500);

    processedImagePath = path.join(outputDir, "processed-page-1.jpg");
    await croppedImage.writeAsync(processedImagePath);

    const processedJimpImage = await Jimp.read(processedImagePath);

    return await new Promise((resolve, reject) => {
      const qr = new QrCode();
      qr.callback = function (err, value) {
        if (err || !value) {
          reject(new Error("Failed to read QR code"));
        } else {
          resolve(value.result);
        }
      };
      qr.decode(processedJimpImage.bitmap);
    });
  } catch (error) {
    // Instead of logging and throwing, just throw to let parent handle
    throw error;
  } finally {
    // Clean up temp directory, but don't throw if fails
    try {
      if (fs.existsSync(outputDir)) {
        fs.rmSync(outputDir, { recursive: true, force: true });
      }
    } catch (cleanupErr) {
      // Optionally log cleanup error, but don't throw
    }
  }
};

export default extractUserIdFromQR;