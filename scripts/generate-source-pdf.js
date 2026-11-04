import fs from 'fs';
import path from 'path';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

async function generateSourcePdf() {
  console.log('Generating Source Code PDF...');

  const indexPath = path.resolve('index.html');
  const packagePath = path.resolve('package.json');
  const metadataPath = path.resolve('metadata.json');

  const indexContent = fs.existsSync(indexPath) ? fs.readFileSync(indexPath, 'utf-8') : '';
  const packageContent = fs.existsSync(packagePath) ? fs.readFileSync(packagePath, 'utf-8') : '';
  const metadataContent = fs.existsSync(metadataPath) ? fs.readFileSync(metadataPath, 'utf-8') : '';

  const pdfDoc = await PDFDocument.create();

  const fontMono = await pdfDoc.embedFont(StandardFonts.Courier);
  const fontMonoBold = await pdfDoc.embedFont(StandardFonts.CourierBold);
  const fontSans = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSansBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const PAGE_WIDTH = 595.28; // A4
  const PAGE_HEIGHT = 841.89; // A4
  const MARGIN_LEFT = 36;
  const MARGIN_RIGHT = 36;
  const MARGIN_TOP = 45;
  const MARGIN_BOTTOM = 40;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

  // Colors
  const colorPrimary = rgb(79 / 255, 70 / 255, 229 / 255); // #4f46e5 Indigo
  const colorDark = rgb(17 / 255, 24 / 255, 39 / 255); // #111827
  const colorGray = rgb(107 / 255, 114 / 255, 128 / 255); // #6b7280
  const colorLineNum = rgb(156 / 255, 163 / 255, 175 / 255); // #9ca3af
  const colorBorder = rgb(229 / 255, 231 / 255, 235 / 255); // #e5e7eb
  const colorCardBg = rgb(249 / 255, 250 / 255, 251 / 255); // #f9fafb
  const colorCodeText = rgb(31 / 255, 41 / 255, 55 / 255); // #1f2937

  // ================= COVER / TITLE PAGE =================
  const coverPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  // Top accent bar
  coverPage.drawRectangle({
    x: 0,
    y: PAGE_HEIGHT - 8,
    width: PAGE_WIDTH,
    height: 8,
    color: colorPrimary,
  });

  // Title Box
  coverPage.drawRectangle({
    x: MARGIN_LEFT,
    y: PAGE_HEIGHT - 220,
    width: CONTENT_WIDTH,
    height: 160,
    color: colorCardBg,
    borderColor: colorBorder,
    borderWidth: 1,
  });

  coverPage.drawText('DYNAMIC QR CODE GENERATOR', {
    x: MARGIN_LEFT + 24,
    y: PAGE_HEIGHT - 110,
    size: 22,
    font: fontSansBold,
    color: colorPrimary,
  });

  coverPage.drawText('Complete Standalone Web Application & Source Code Specification', {
    x: MARGIN_LEFT + 24,
    y: PAGE_HEIGHT - 135,
    size: 11,
    font: fontSans,
    color: colorDark,
  });

  coverPage.drawText('Exported on: ' + new Date().toISOString().split('T')[0] + ' | Architecture: HTML5 + React + TailwindCSS + QRCode', {
    x: MARGIN_LEFT + 24,
    y: PAGE_HEIGHT - 165,
    size: 9,
    font: fontSans,
    color: colorGray,
  });

  // Metadata Card
  const metaY = PAGE_HEIGHT - 250;
  coverPage.drawText('Project Overview & Architecture', {
    x: MARGIN_LEFT,
    y: metaY,
    size: 14,
    font: fontSansBold,
    color: colorDark,
  });

  const bullets = [
    '• Application Name: Dynamic QR Code Generator with Admin Panel',
    '• Formats Supported: SVG (vector scalable) and PNG (raster image) downloads',
    '• Customization: Foreground & background color picker, embedded brand logo upload',
    '• Analytics & Tracking: Live transaction audit logging, IP / country tracking, license validation',
    '• Admin Panel: Secure access with passcode, transaction log management, setting configuration',
    '• Architecture: Zero-dependency runtime, self-contained standalone bundle',
    `• Main Source Code Size: ${indexContent.length.toLocaleString()} characters (${indexContent.split('\n').length} lines)`,
  ];

  let currentMetaY = metaY - 26;
  for (const b of bullets) {
    coverPage.drawText(b, {
      x: MARGIN_LEFT + 10,
      y: currentMetaY,
      size: 9.5,
      font: fontSans,
      color: colorDark,
      lineHeight: 14,
    });
    currentMetaY -= 20;
  }

  // Files Included Table
  const tableY = currentMetaY - 25;
  coverPage.drawText('Included Source Code Modules', {
    x: MARGIN_LEFT,
    y: tableY,
    size: 14,
    font: fontSansBold,
    color: colorDark,
  });

  coverPage.drawRectangle({
    x: MARGIN_LEFT,
    y: tableY - 140,
    width: CONTENT_WIDTH,
    height: 125,
    color: colorCardBg,
    borderColor: colorBorder,
    borderWidth: 1,
  });

  const fileEntries = [
    { name: '1. index.html', desc: 'Main standalone single-file React application (UI, QR engine, admin panel)', lines: `${indexContent.split('\n').length} lines` },
    { name: '2. package.json', desc: 'Project configuration, scripts and build definitions', lines: `${packageContent.split('\n').length} lines` },
    { name: '3. metadata.json', desc: 'Application platform metadata and capability declarations', lines: `${metadataContent.split('\n').length} lines` },
  ];

  let fileEntryY = tableY - 35;
  for (const entry of fileEntries) {
    coverPage.drawText(entry.name, {
      x: MARGIN_LEFT + 16,
      y: fileEntryY,
      size: 10,
      font: fontMonoBold,
      color: colorPrimary,
    });
    coverPage.drawText(entry.desc, {
      x: MARGIN_LEFT + 16,
      y: fileEntryY - 14,
      size: 8.5,
      font: fontSans,
      color: colorGray,
    });
    coverPage.drawText(entry.lines, {
      x: MARGIN_LEFT + CONTENT_WIDTH - 80,
      y: fileEntryY,
      size: 9,
      font: fontMono,
      color: colorDark,
    });
    fileEntryY -= 36;
  }

  // Footer on cover
  coverPage.drawText('Generated by Dynamic QR Code Studio • Confidential & Proprietary Source Code', {
    x: MARGIN_LEFT,
    y: MARGIN_BOTTOM,
    size: 8.5,
    font: fontSans,
    color: colorGray,
  });

  // ================= CODE PRINTER HELPER =================
  const FONT_SIZE = 7.5;
  const LINE_HEIGHT = 10;
  const LINES_PER_PAGE = Math.floor((PAGE_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM - 45) / LINE_HEIGHT);

  function printCodeSection(title, filename, content) {
    const rawLines = content.split('\n');
    const totalLines = rawLines.length;
    let lineIndex = 0;

    while (lineIndex < totalLines) {
      const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      const currentYTop = PAGE_HEIGHT - MARGIN_TOP;

      // Header Bar
      page.drawRectangle({
        x: MARGIN_LEFT,
        y: currentYTop - 24,
        width: CONTENT_WIDTH,
        height: 24,
        color: colorPrimary,
      });

      page.drawText(`${title} — ${filename}`, {
        x: MARGIN_LEFT + 10,
        y: currentYTop - 16,
        size: 9,
        font: fontSansBold,
        color: rgb(1, 1, 1),
      });

      page.drawText(`Lines ${lineIndex + 1} - ${Math.min(lineIndex + LINES_PER_PAGE, totalLines)} of ${totalLines}`, {
        x: MARGIN_LEFT + CONTENT_WIDTH - 150,
        y: currentYTop - 16,
        size: 8,
        font: fontSans,
        color: rgb(0.9, 0.9, 1),
      });

      // Code Box Outline
      const boxHeight = (LINES_PER_PAGE * LINE_HEIGHT) + 12;
      const boxY = currentYTop - 32 - boxHeight;
      page.drawRectangle({
        x: MARGIN_LEFT,
        y: boxY,
        width: CONTENT_WIDTH,
        height: boxHeight,
        color: rgb(0.98, 0.98, 0.99),
        borderColor: colorBorder,
        borderWidth: 0.8,
      });

      // Line numbers gutter
      page.drawRectangle({
        x: MARGIN_LEFT,
        y: boxY,
        width: 34,
        height: boxHeight,
        color: rgb(0.95, 0.95, 0.97),
        borderColor: colorBorder,
        borderWidth: 0.5,
      });

      let lineY = currentYTop - 42;
      const pageEndIndex = Math.min(lineIndex + LINES_PER_PAGE, totalLines);

      for (let i = lineIndex; i < pageEndIndex; i++) {
        const lineNum = (i + 1).toString().padStart(4, ' ');
        let codeLine = rawLines[i].replace(/\t/g, '  ');

        // truncate line if too long to fit
        const maxChars = 92;
        if (codeLine.length > maxChars) {
          codeLine = codeLine.substring(0, maxChars - 3) + '...';
        }

        // Draw Line Number
        page.drawText(lineNum, {
          x: MARGIN_LEFT + 4,
          y: lineY,
          size: FONT_SIZE - 0.5,
          font: fontMono,
          color: colorLineNum,
        });

        // Draw Code Line (clean escaping)
        try {
          page.drawText(codeLine, {
            x: MARGIN_LEFT + 40,
            y: lineY,
            size: FONT_SIZE,
            font: fontMono,
            color: colorCodeText,
          });
        } catch (e) {
          // If unsupported character, replace non-ascii
          const sanitized = codeLine.replace(/[^\x20-\x7E]/g, '?');
          page.drawText(sanitized, {
            x: MARGIN_LEFT + 40,
            y: lineY,
            size: FONT_SIZE,
            font: fontMono,
            color: colorCodeText,
          });
        }

        lineY -= LINE_HEIGHT;
      }

      // Page Footer
      page.drawText(`Dynamic QR Code Generator • Source Code Export • File: ${filename}`, {
        x: MARGIN_LEFT,
        y: MARGIN_BOTTOM - 15,
        size: 7.5,
        font: fontSans,
        color: colorGray,
      });

      const pageNumberStr = `Page ${pdfDoc.getPageCount()}`;
      page.drawText(pageNumberStr, {
        x: MARGIN_LEFT + CONTENT_WIDTH - 45,
        y: MARGIN_BOTTOM - 15,
        size: 7.5,
        font: fontSans,
        color: colorGray,
      });

      lineIndex += LINES_PER_PAGE;
    }
  }

  // Print Files
  printCodeSection('Core Application Source', 'index.html', indexContent);
  printCodeSection('Project Manifest', 'package.json', packageContent);
  printCodeSection('App Metadata', 'metadata.json', metadataContent);

  // Ensure public folder
  if (!fs.existsSync('public')) {
    fs.mkdirSync('public', { recursive: true });
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(path.resolve('public/source-code.pdf'), pdfBytes);
  console.log(`PDF successfully generated at public/source-code.pdf (${pdfBytes.length} bytes, ${pdfDoc.getPageCount()} pages)`);
}

generateSourcePdf().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
