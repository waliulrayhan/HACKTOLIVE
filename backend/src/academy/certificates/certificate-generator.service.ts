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
  private readonly templatePath = path.join(
    process.cwd(),
    'uploads',
    'certificate-templates',
    'template.png',
  );

  constructor() {}

  generateCertificatePDF(data: CertificateData): PDFKit.PDFDocument {
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margin: 0,
    });

    // Add template background image - fill entire page
    if (fs.existsSync(this.templatePath)) {
      doc.image(this.templatePath, 0, 0, {
        width: doc.page.width,
        height: doc.page.height,
        fit: [doc.page.width, doc.page.height],
      });
    } else {
      // Fallback to simple background if template not found
      this.drawBackground(doc);
      this.drawBorder(doc);
      this.drawHeader(doc);
    }

    // Student name - elegant script font (positioned for "Full Name" area)
    doc
      .fontSize(50)
      .font('Times-Italic')
      .fillColor('#1d6f65')
      .text(data.studentName, 100, 250, {
        align: 'center',
        width: 642,
      });

    // Course completion text with course name integrated
    const courseText = `Has successfully completed the comprehensive ${data.duration}-hour course on`;
    doc
      .fontSize(13)
      .font('Helvetica')
      .fillColor('#1d6f65')
      .text(courseText, 100, 350, {
        align: 'center',
        width: 642,
      });

    // Course name in quotes (next line)
    doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .fillColor('#1d6f65')
      .text(`"${data.courseName}"`, 100, 365, {
        align: 'center',
        width: 642,
      });

    // Format date
    const dateStr = data.completionDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
        year: 'numeric',
      });

    // Date positioned at bottom center
    doc
      .fontSize(13)
      .font('Helvetica')
      .fillColor('#1d6f65')
      .text(dateStr, 100, 370, {
        align: 'center',
        width: 642,
      });

    // Certification Number - bottom left (under "Certification Number" label)
    doc
      .fontSize(10)
      .font('Helvetica')
      .fillColor('#1d6f65')
      .text(data.verificationCode, 200, 450, {
        align: 'center',
        width: 165,
      });

    // Instructor name - bottom right (under "Instructor" label)
    doc
      .fontSize(10)
      .font('Helvetica')
      .fillColor('#1d6f65')
      .text(data.instructorName, 200, 450, {
        align: 'center',
        width: 165,
      });

    // Finalize PDF
    doc.end();

    return doc;
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
      .text('HackToLive', 0, 60, {
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
}
