import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Prospect } from "@/data/mockData";

export function downloadPDF(prospects: Prospect[], query: string): void {
  const doc = new jsPDF({ orientation: "landscape", format: "a4" });

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("ProspectAI Report", 14, 22);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  doc.text(`Query: ${query}`, 14, 30);
  doc.text(`${prospects.length} result(s) · Generated ${new Date().toLocaleString()}`, 14, 36);
  doc.setTextColor(0, 0, 0);

  autoTable(doc, {
    startY: 42,
    head: [["Company", "Industry", "Employees", "Location", "Contact", "Phone", "Website"]],
    body: prospects.map((p) => [
      p.company,
      p.industry,
      p.employees.toLocaleString(),
      p.location,
      p.contactName,
      p.contactPhone,
      p.website,
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [102, 135, 220] },
    theme: "grid",
    columnStyles: {
      0: { cellWidth: 36 },
      1: { cellWidth: 28 },
      2: { cellWidth: 22 },
      3: { cellWidth: 32 },
      4: { cellWidth: 36 },
      5: { cellWidth: 36 },
      6: { cellWidth: 50 },
    },
  });

  doc.save("prospectai-report.pdf");
}
