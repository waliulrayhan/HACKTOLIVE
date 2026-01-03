import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

interface CertificateData {
  studentName: string;
  courseName: string;
  instructorName: string;
  completionDate: Date;
  verificationCode: string;
  duration: number; // in hours
}

@Injectable()
export class CertificateGeneratorService {
  private readonly certificatesDir = path.join(
    process.cwd(),
    'uploads',
    'certificates',
  );

  constructor() {
    // Ensure certificates directory exists
    if (!fs.existsSync(this.certificatesDir)) {
      fs.mkdirSync(this.certificatesDir, { recursive: true });
    }
  }

  async generateCertificate(
    data: CertificateData,
    certificateId: string,
  ): Promise<string> {
    const fileName = `${certificateId}.pdf`;
    const filePath = path.join(this.certificatesDir, fileName);

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          layout: 'landscape',
          margin: 0,
        });

        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        // Background - elegant gradient effect
        this.drawBackground(doc);

        // Border decoration
        this.drawBorder(doc);

        // Header section
        this.drawHeader(doc);

        // Certificate of Achievement text
        doc
          .fontSize(24)
          .font('Helvetica-Bold')
          .fillColor('#1a1a1a')
          .text('CERTIFICATE OF COMPLETION', 0, 150, {
            align: 'center',
            width: doc.page.width,
          });

        // Decorative line under title
        doc
          .moveTo(250, 185)
          .lineTo(doc.page.width - 250, 185)
          .lineWidth(2)
          .strokeColor('#6366f1')
          .stroke();

        // "This is to certify that" text
        doc
          .fontSize(14)
          .font('Helvetica')
          .fillColor('#666')
          .text('This is to certify that', 0, 220, {
            align: 'center',
            width: doc.page.width,
          });

        // Student name - highlighted
        doc
          .fontSize(36)
          .font('Helvetica-Bold')
          .fillColor('#1a1a1a')
          .text(data.studentName, 0, 250, {
            align: 'center',
            width: doc.page.width,
          });

        // Decorative underline for name
        const nameWidth = doc.widthOfString(data.studentName);
        const nameX = (doc.page.width - nameWidth) / 2;
        doc
          .moveTo(nameX, 295)
          .lineTo(nameX + nameWidth, 295)
          .lineWidth(1.5)
          .strokeColor('#6366f1')
          .stroke();

        // "has successfully completed" text
        doc
          .fontSize(14)
          .font('Helvetica')
          .fillColor('#666')
          .text('has successfully completed the course', 0, 320, {
            align: 'center',
            width: doc.page.width,
          });

        // Course name - highlighted
        doc
          .fontSize(24)
          .font('Helvetica-Bold')
          .fillColor('#6366f1')
          .text(data.courseName, 0, 350, {
            align: 'center',
            width: doc.page.width,
          });

        // Duration info
        doc
          .fontSize(12)
          .font('Helvetica')
          .fillColor('#888')
          .text(`Course Duration: ${data.duration} hours`, 0, 390, {
            align: 'center',
            width: doc.page.width,
          });

        // Footer section with signatures
        this.drawFooter(doc, data);

        // Verification code section
        this.drawVerificationCode(doc, data.verificationCode);

        // Decorative elements
        this.drawDecorativeElements(doc);

        // Finalize PDF
        doc.end();

        writeStream.on('finish', () => {
          resolve(`/certificates/${fileName}`);
        });

        writeStream.on('error', (error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  private drawBackground(doc: PDFKit.PDFDocument) {
    // Light gradient background effect using rectangles
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#ffffff');

    // Top accent
    doc
      .rect(0, 0, doc.page.width, 120)
      .fillOpacity(0.03)
      .fill('#6366f1')
      .fillOpacity(1);

    // Bottom accent
    doc
      .rect(0, doc.page.height - 120, doc.page.width, 120)
      .fillOpacity(0.03)
      .fill('#6366f1')
      .fillOpacity(1);
  }

  private drawBorder(doc: PDFKit.PDFDocument) {
    const margin = 30;
    const borderWidth = 3;

    // Outer border
    doc
      .rect(margin, margin, doc.page.width - margin * 2, doc.page.height - margin * 2)
      .lineWidth(borderWidth)
      .strokeColor('#6366f1')
      .stroke();

    // Inner border
    doc
      .rect(
        margin + 8,
        margin + 8,
        doc.page.width - (margin + 8) * 2,
        doc.page.height - (margin + 8) * 2,
      )
      .lineWidth(1)
      .strokeColor('#d1d5db')
      .stroke();
  }

  private drawHeader(doc: PDFKit.PDFDocument) {
    // Logo/Brand area
    doc
      .fontSize(28)
      .font('Helvetica-Bold')
      .fillColor('#6366f1')
      .text('HACKTOLIVE', 0, 60, {
        align: 'center',
        width: doc.page.width,
      });

    doc
      .fontSize(12)
      .font('Helvetica')
      .fillColor('#888')
      .text('Academy', 0, 95, {
        align: 'center',
        width: doc.page.width,
      });
  }

  private drawFooter(doc: PDFKit.PDFDocument, data: CertificateData) {
    const footerY = doc.page.height - 140;
    const leftX = 150;
    const rightX = doc.page.width - 250;

    // Format date
    const dateStr = data.completionDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Left side - Date
    doc
      .fontSize(10)
      .font('Helvetica')
      .fillColor('#888')
      .text('Date of Completion', leftX, footerY, {
        align: 'center',
        width: 200,
      });

    doc
      .moveTo(leftX + 30, footerY + 20)
      .lineTo(leftX + 170, footerY + 20)
      .lineWidth(1)
      .strokeColor('#333')
      .stroke();

    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .fillColor('#333')
      .text(dateStr, leftX, footerY + 25, {
        align: 'center',
        width: 200,
      });

    // Right side - Instructor
    doc
      .fontSize(10)
      .font('Helvetica')
      .fillColor('#888')
      .text('Instructor', rightX, footerY, {
        align: 'center',
        width: 200,
      });

    doc
      .moveTo(rightX + 30, footerY + 20)
      .lineTo(rightX + 170, footerY + 20)
      .lineWidth(1)
      .strokeColor('#333')
      .stroke();

    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .fillColor('#333')
      .text(data.instructorName, rightX, footerY + 25, {
        align: 'center',
        width: 200,
      });
  }

  private drawVerificationCode(doc: PDFKit.PDFDocument, code: string) {
    const verifyY = doc.page.height - 60;

    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor('#999')
      .text('Verification Code:', 0, verifyY, {
        align: 'center',
        width: doc.page.width,
      });

    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor('#666')
      .text(code, 0, verifyY + 15, {
        align: 'center',
        width: doc.page.width,
      });
  }

  private drawDecorativeElements(doc: PDFKit.PDFDocument) {
    // Top left corner decoration
    this.drawCornerDecoration(doc, 60, 140, 'topLeft');

    // Top right corner decoration
    this.drawCornerDecoration(doc, doc.page.width - 60, 140, 'topRight');

    // Bottom left corner decoration
    this.drawCornerDecoration(
      doc,
      60,
      doc.page.height - 160,
      'bottomLeft',
    );

    // Bottom right corner decoration
    this.drawCornerDecoration(
      doc,
      doc.page.width - 60,
      doc.page.height - 160,
      'bottomRight',
    );
  }

  private drawCornerDecoration(
    doc: PDFKit.PDFDocument,
    x: number,
    y: number,
    position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight',
  ) {
    const size = 15;

    doc.save();
    doc.fillColor('#6366f1').fillOpacity(0.15);

    switch (position) {
      case 'topLeft':
        doc.circle(x, y, size).fill();
        doc.circle(x - 10, y + 15, size * 0.6).fill();
        doc.circle(x + 15, y + 10, size * 0.6).fill();
        break;
      case 'topRight':
        doc.circle(x, y, size).fill();
        doc.circle(x + 10, y + 15, size * 0.6).fill();
        doc.circle(x - 15, y + 10, size * 0.6).fill();
        break;
      case 'bottomLeft':
        doc.circle(x, y, size).fill();
        doc.circle(x - 10, y - 15, size * 0.6).fill();
        doc.circle(x + 15, y - 10, size * 0.6).fill();
        break;
      case 'bottomRight':
        doc.circle(x, y, size).fill();
        doc.circle(x + 10, y - 15, size * 0.6).fill();
        doc.circle(x - 15, y - 10, size * 0.6).fill();
        break;
    }

    doc.restore();
    doc.fillOpacity(1);
  }

  async deleteCertificate(certificateId: string): Promise<void> {
    const fileName = `${certificateId}.pdf`;
    const filePath = path.join(this.certificatesDir, fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  getCertificatePath(certificateId: string): string {
    const fileName = `${certificateId}.pdf`;
    return path.join(this.certificatesDir, fileName);
  }
}
