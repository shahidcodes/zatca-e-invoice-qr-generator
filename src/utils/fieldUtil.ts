import { Buffer } from "node:buffer";

export function toHex(value: number) {
  let hex = value.toString(16);
  if (hex.length % 2 > 0) {
    hex = "0" + hex;
  }
  return Buffer.from(hex, "hex").toString("utf-8");
}

export const byteLength = (value: string) => Buffer.byteLength(value);

export const toBase64 = (value: string) => {
  return Buffer.from(value).toString("base64");
};

export const toTLV = (tag: number, value: string) => {
  return toHex(tag) + toHex(byteLength(value)) + value;
};
