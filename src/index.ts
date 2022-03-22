import { createWriteStream } from "fs";
import { toBase64, toTLV } from "./utils/fieldUtil";

export type EInvoiceFields = {
  sellerName: string;
  vatNumber: string;
  timestamp: string;
  total: string;
  vatTotal: string;
};

/**
 * Generates data string to generate qr from
 * Usage
 * ```js
 * const qrData = createQRData({
 *  sellerName: '',
 *  vatNumber: '',
 *  timestamp: '',
 *  total: '100.00',
 *  vatTotal: '15.00'
 * })
 * ```
 */

export function createQRData({
  sellerName,
  vatNumber,
  timestamp,
  total,
  vatTotal,
}: EInvoiceFields) {
  const fields = [
    [1, sellerName],
    [2, vatNumber],
    [3, timestamp],
    [4, total],
    [5, vatTotal],
  ];

  const qrData = fields.reduce(
    (qrDataStr, [tag, value]) =>
      qrDataStr + toTLV(tag as number, value as string),
    ""
  );

  return toBase64(qrData);
}

type QROptions = {
  format: "buffer" | "file" | "data-url" | "svg";
  filePath?: string;
};

export async function generateQR(
  payload: EInvoiceFields,
  options: QROptions = { format: "buffer" }
) {
  try {
    const qrData = createQRData(payload);
    const { default: qrcode } = await import("qrcode");
    if (options.format === "buffer") {
      return qrcode.toBuffer(qrData);
    }

    if (options.format === "file") {
      return qrcode.toFile(options.filePath || "./qr-data.png", qrData, {
        type: "png",
      });
    }

    if (options.format === "data-url") {
      return qrcode.toDataURL(qrData);
    }

    if (options.format === "svg") {
      return qrcode.toString(qrData, { type: "svg" });
    }
  } catch (error) {
    console.error(error);
  }
}
