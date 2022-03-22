import * as fs from "node:fs";
import { EInvoiceFields, generateQR } from "../src";

const testData: EInvoiceFields = {
  sellerName: "Shahid",
  vatNumber: "12345678910111",
  timestamp: "2022-01-02 10:30",
  total: "100.00",
  vatTotal: "15.00",
};
const filePath = "./file.png";

test("should generate buffer qr code", async () => {
  const qrBuffer = await generateQR(testData, { format: "buffer" });
  expect(Buffer.isBuffer(qrBuffer)).toBe(true);
});

test("should generate data-url qr code", async () => {
  const qrDataURL = await generateQR(testData, { format: "data-url" });
  expect(String(qrDataURL).startsWith("data:image/png;base64,"));
});

test("should generate svg qr code", async () => {
  const svgData = await generateQR(testData, { format: "svg" });
  expect(String(svgData).includes("<svg")).toBeTruthy();
});

test("should generate qr code file", async () => {
  await generateQR(testData, {
    format: "file",
    filePath,
  });
  expect(fs.existsSync(filePath)).toBeTruthy();
  fs.rmSync(filePath);
});
