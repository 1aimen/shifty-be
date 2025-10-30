// src/utils/sheets.utils.ts
import fs from "fs";
import path from "path";
import { Workbook } from "exceljs";
import fastcsv from "fast-csv";

const REPORT_DIR = path.join(__dirname, "../../reports");
if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR);

export const SheetsUtils = {
  async exportCSV(data: any[], filename: string) {
    const filePath = path.join(REPORT_DIR, `${filename}.csv`);
    return new Promise<string>((resolve, reject) => {
      const ws = fs.createWriteStream(filePath);
      fastcsv
        .write(data, { headers: true })
        .pipe(ws)
        .on("finish", () => resolve(filePath))
        .on("error", (err) => reject(err));
    });
  },

  async exportExcel(data: any[], filename: string) {
    const workbook = new Workbook();
    const sheet = workbook.addWorksheet("Report");

    if (data.length > 0) {
      sheet.columns = Object.keys(data[0]).map((key) => ({ header: key, key }));
      data.forEach((row) => sheet.addRow(row));
    }

    const filePath = path.join(REPORT_DIR, `${filename}.xlsx`);
    await workbook.xlsx.writeFile(filePath);
    return filePath;
  },
};
