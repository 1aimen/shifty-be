export interface ExportFile {
  id: string;
  storageKey: string;
  mimeType: string;
  size?: number;
  createdAt: Date;
  downloadUrl?: string;
}
