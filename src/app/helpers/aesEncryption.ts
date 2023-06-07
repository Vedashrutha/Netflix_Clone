import { AES, enc } from 'crypto-js';

var secretKey="iN7el%97r15"

export function encryptData(data: string): string {
  return AES.encrypt(data, secretKey).toString();
}

export function decryptData(encryptedData: string): string {
  const bytes = AES.decrypt(encryptedData, secretKey);
  return bytes.toString(enc.Utf8);
}