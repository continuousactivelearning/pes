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
  try {
    const outputDir = path.join(__dirname, "temp");
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
    const imagePath = path.join(outputDir, "page-1.jpg");

    const image = await Jimp.read(imagePath);

    const croppedImage = image.crop(
      0,
      0,
      image.bitmap.width / 3,
      image.bitmap.height / 3
    );
    croppedImage.greyscale().contrast(1).resize(500, 500);

    const processedImagePath = path.join(outputDir, "processed-page-1.jpg");
    await croppedImage.writeAsync(processedImagePath);

    const processedJimpImage = await Jimp.read(processedImagePath);

    return new Promise((resolve, reject) => {
      const qr = new QrCode();
      qr.callback = function (err, value) {
        if (err || !value) {
          console.error("Failed to decode QR code:", err);
          reject(new Error("Failed to read QR code"));
        } else {
          // console.log('QR code decoded successfully:', value.result);
          resolve(value.result);
        }
      };
      qr.decode(processedJimpImage.bitmap);
    });
  } catch (error) {
    console.error("Error extracting unique ID from QR:", error);
    throw new Error("Failed to extract unique ID from QR code");
  } finally {
    // Clean up temporary files
    const tempDir = path.join(__dirname, "temp");
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
};

export default extractUserIdFromQR;
