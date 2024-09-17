import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { BookingPerson } from '../entities/bookingPerson.entity';
import moment from 'moment';

export async function createCombinedPDF(
  participants: BookingPerson[]
): Promise<Buffer> {
  try {
    const pdfDoc = await PDFDocument.create();
    const indemnityPdfPath = path.join(
      __dirname,
      '../assets/indemnity agreement_Akagera NP_Rwanda.pdf'
    );
    const indemnityPdfBytes = await fs.readFile(indemnityPdfPath);
    const indemnityPdf = await PDFDocument.load(indemnityPdfBytes);

    const copiedPages = await pdfDoc.copyPages(
      indemnityPdf,
      indemnityPdf.getPageIndices()
    );
    copiedPages.forEach((page) => pdfDoc.addPage(page));

    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Add title
    page.drawText('Participants', {
      x: 50,
      y: height - 50,
      size: 15,
      font: boldFont,
    });

    // Define table structure
    const tableTop = height - 65;
    const tableLeft = 50;
    const tableRight = width - 50;
    const tableWidth = tableRight - tableLeft;
    const headers = ['Full Names', 'Date', 'I agree'];
    const colWidths = headers.map(() => tableWidth / headers.length);
    const rowHeight = 25;
    const fontSize = 9;
    const textPadding = 5;

    // Draw table headers
    headers.forEach((header, index) => {
      const x =
        tableLeft + colWidths.slice(0, index).reduce((a, b) => a + b, 0);
      page.drawRectangle({
        x,
        y: tableTop - rowHeight,
        width: colWidths[index],
        height: rowHeight,
        color: rgb(0.9, 0.9, 0.9),
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });
      page.drawText(header, {
        x: x + textPadding,
        y: tableTop - rowHeight / 2 - fontSize / 2,
        size: fontSize,
        font: boldFont,
      });
    });

    // Draw table rows
    participants.forEach((participant, index) => {
      const y = tableTop - (index + 2) * rowHeight;

      headers.forEach((_, colIndex) => {
        const x =
          tableLeft + colWidths.slice(0, colIndex).reduce((a, b) => a + b, 0);
        page.drawRectangle({
          x,
          y,
          width: colWidths[colIndex],
          height: rowHeight,
          borderColor: rgb(0, 0, 0),
          borderWidth: 1,
        });
      });

      // Draw participant data
      page.drawText(participant.name, {
        x: tableLeft + textPadding,
        y: y + rowHeight / 2 - fontSize / 2,
        size: fontSize,
        font,
      });
      page.drawText(moment(participant?.updatedAt).format('YYYY-MM-DD'), {
        x: tableLeft + colWidths[0] + textPadding,
        y: y + rowHeight / 2 - fontSize / 2,
        size: fontSize,
        font,
      });

      // Draw checkbox in the third column, centered horizontally
      const checkBoxField = pdfDoc
        .getForm()
        .createCheckBox(`checkbox_${index}`);
      checkBoxField.addToPage(page, {
        x: tableLeft + colWidths[0] + colWidths[1] + 10,
        y: y + rowHeight / 2 - 10 / 2,
        width: 10,
        height: 10,
      });
      if (participant?.booking?.consent) {
        checkBoxField.check();
      }
      checkBoxField.enableReadOnly();
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  } catch (error) {
    throw error;
  }
}
