// src/dto/attendance.dto.ts

export interface ClockRequestDTO {
  userId: string; // Usually from JWT
  timestamp?: string; // Optional, defaults to now

  // Optional methods
  gps?: { latitude: number; longitude: number };
  nfcTagId?: string; // ID scanned from NFC
  qrCode?: string; // QR code scanned
}
