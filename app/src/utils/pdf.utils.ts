// src/utils/pdf.utils.ts
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const REPORT_DIR = path.join(__dirname, "../../reports");
if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR);

export const PdfUtils = {
  async exportPDF(data: any[], filename: string) {
    const filePath = path.join(REPORT_DIR, `${filename}.pdf`);
    const doc = new PDFDocument({ margin: 30 });
    const ws = fs.createWriteStream(filePath);
    doc.pipe(ws);

    doc.fontSize(18).text("Report", { align: "center" });
    doc.moveDown();

    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      doc.fontSize(12).text(headers.join(" | "));
      doc.moveDown(0.5);

      data.forEach((row) => {
        const rowText = headers.map((h) => row[h]).join(" | ");
        doc.text(rowText);
      });
    } else {
      doc.text("No data available");
    }

    doc.end();
    return new Promise<string>((resolve) =>
      ws.on("finish", () => resolve(filePath))
    );
  },
};
