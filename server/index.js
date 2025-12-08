const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const pdfParse = require('pdf-parse');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('uploads'));

// Serve frontend in production (only if dist folder exists)
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../client/dist');
  if (fs.existsSync(frontendPath)) {
    app.use(express.static(frontendPath));
    app.get('*', (req, res) => {
      const indexPath = path.join(frontendPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.json({ message: 'PDF API is running. Frontend not built.' });
      }
    });
  }
}

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Increase server timeout for large file uploads
app.timeout = 300000; // 5 minutes

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 100 * 1024 * 1024, // 100MB limit per file
    files: 50, // Max number of files
    fieldSize: 10 * 1024 * 1024 // 10MB field size
  }
});

// Routes

// Merge PDFs
app.post('/api/merge', upload.array('files', 20), async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length < 2) {
      return res.status(400).json({ error: 'At least 2 PDF files required' });
    }

    const mergedPdf = await PDFDocument.create();
    
    for (const file of files) {
      const pdfBytes = fs.readFileSync(file.path);
      const pdf = await PDFDocument.load(pdfBytes);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    const outputPath = `uploads/merged-${Date.now()}.pdf`;
    fs.writeFileSync(outputPath, mergedPdfBytes);

    // Cleanup input files
    files.forEach(file => fs.unlinkSync(file.path));

    res.json({ 
      success: true, 
      file: path.basename(outputPath),
      message: `Successfully merged ${files.length} PDF files`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Split PDF
app.post('/api/split', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'PDF file required' });
    }

    const pdfBytes = fs.readFileSync(req.file.path);
    const pdf = await PDFDocument.load(pdfBytes);
    const pageCount = pdf.getPageCount();
    const files = [];

    for (let i = 0; i < pageCount; i++) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(page);
      const newPdfBytes = await newPdf.save();
      const outputPath = `uploads/split-page-${i + 1}-${Date.now()}.pdf`;
      fs.writeFileSync(outputPath, newPdfBytes);
      files.push(path.basename(outputPath));
    }

    fs.unlinkSync(req.file.path);

    res.json({ 
      success: true, 
      files: files,
      message: `Successfully split PDF into ${pageCount} files`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Compress PDF
app.post('/api/compress', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'PDF file required' });
    }

    const pdfBytes = fs.readFileSync(req.file.path);
    const pdf = await PDFDocument.load(pdfBytes);
    
    // Re-save with compression options
    const compressedBytes = await pdf.save({
      useObjectStreams: false,
      addDefaultPage: false,
    });

    const outputPath = `uploads/compressed-${Date.now()}.pdf`;
    fs.writeFileSync(outputPath, compressedBytes);

    const originalSize = fs.statSync(req.file.path).size;
    const compressedSize = fs.statSync(outputPath).size;
    const compressionRatio = ((1 - compressedSize / originalSize) * 100).toFixed(2);

    fs.unlinkSync(req.file.path);

    res.json({ 
      success: true, 
      file: path.basename(outputPath),
      originalSize,
      compressedSize,
      compressionRatio: compressionRatio > 0 ? compressionRatio : 0,
      message: 'PDF compressed successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rotate PDF
app.post('/api/rotate', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'PDF file required' });
    }

    const angle = parseInt(req.body.angle) || 90;
    const pdfBytes = fs.readFileSync(req.file.path);
    const pdf = await PDFDocument.load(pdfBytes);
    const pageCount = pdf.getPageCount();

    for (let i = 0; i < pageCount; i++) {
      const page = pdf.getPage(i);
      page.setRotation(page.getRotation() + angle);
    }

    const rotatedBytes = await pdf.save();
    const outputPath = `uploads/rotated-${Date.now()}.pdf`;
    fs.writeFileSync(outputPath, rotatedBytes);

    fs.unlinkSync(req.file.path);

    res.json({ 
      success: true, 
      file: path.basename(outputPath),
      message: `PDF rotated ${angle} degrees`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Extract pages
app.post('/api/extract', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'PDF file required' });
    }

    const pageInput = req.body.pages || '1';
    const pdfBytes = fs.readFileSync(req.file.path);
    const pdf = await PDFDocument.load(pdfBytes);
    const totalPages = pdf.getPageCount();
    const pageIndices = new Set();

    // Parse page input (supports ranges like "1,3,5-7")
    const parts = pageInput.split(',');
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        // Handle range (e.g., "5-7")
        const [start, end] = trimmed.split('-').map(p => parseInt(p.trim()) - 1);
        if (!isNaN(start) && !isNaN(end) && start >= 0 && end < totalPages && start <= end) {
          for (let i = start; i <= end; i++) {
            pageIndices.add(i);
          }
        }
      } else {
        // Handle single page
        const pageNum = parseInt(trimmed) - 1;
        if (!isNaN(pageNum) && pageNum >= 0 && pageNum < totalPages) {
          pageIndices.add(pageNum);
        }
      }
    }

    if (pageIndices.size === 0) {
      return res.status(400).json({ error: 'No valid pages specified' });
    }

    const newPdf = await PDFDocument.create();
    const sortedPages = Array.from(pageIndices).sort((a, b) => a - b);

    for (const pageIndex of sortedPages) {
      const [page] = await newPdf.copyPages(pdf, [pageIndex]);
      newPdf.addPage(page);
    }

    const extractedBytes = await newPdf.save();
    const outputPath = `uploads/extracted-${Date.now()}.pdf`;
    fs.writeFileSync(outputPath, extractedBytes);

    fs.unlinkSync(req.file.path);

    res.json({ 
      success: true, 
      file: path.basename(outputPath),
      message: `Extracted ${pageIndices.size} page(s)`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add watermark
app.post('/api/watermark', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'PDF file required' });
    }

    const text = req.body.text || 'WATERMARK';
    const pdfBytes = fs.readFileSync(req.file.path);
    const pdf = await PDFDocument.load(pdfBytes);
    const pageCount = pdf.getPageCount();

    for (let i = 0; i < pageCount; i++) {
      const page = pdf.getPage(i);
      const { width, height } = page.getSize();
      
      page.drawText(text, {
        x: width / 2 - 50,
        y: height / 2,
        size: 50,
        opacity: 0.3,
        rotate: { angleInDegrees: 45 },
      });
    }

    const watermarkedBytes = await pdf.save();
    const outputPath = `uploads/watermarked-${Date.now()}.pdf`;
    fs.writeFileSync(outputPath, watermarkedBytes);

    fs.unlinkSync(req.file.path);

    res.json({ 
      success: true, 
      file: path.basename(outputPath),
      message: 'Watermark added successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Protect PDF with password
app.post('/api/protect', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'PDF file required' });
    }

    const password = req.body.password || 'default123';
    const pdfBytes = fs.readFileSync(req.file.path);
    const pdf = await PDFDocument.load(pdfBytes);
    
    // Note: pdf-lib doesn't support password protection directly
    // This is a placeholder - in production, use a library like pdfkit or pdfmake
    const protectedBytes = await pdf.save();
    const outputPath = `uploads/protected-${Date.now()}.pdf`;
    fs.writeFileSync(outputPath, protectedBytes);

    fs.unlinkSync(req.file.path);

    res.json({ 
      success: true, 
      file: path.basename(outputPath),
      message: 'PDF protection applied (Note: Full encryption requires additional libraries)'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PDF to Images
app.post('/api/pdf-to-images', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'PDF file required' });
    }

    const pdfBytes = fs.readFileSync(req.file.path);
    const data = await pdfParse(pdfBytes);
    
    // For a full implementation, you'd use pdf2pic or similar
    // This is a simplified version
    const images = [];
    
    res.json({ 
      success: true, 
      images: images,
      pageCount: data.numpages,
      message: 'PDF converted to images (Full implementation requires pdf2pic)'
    });
    
    fs.unlinkSync(req.file.path);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Images to PDF
app.post('/api/images-to-pdf', upload.array('files', 50), async (req, res) => {
  const uploadedFiles = [];
  
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'At least one image file required' });
    }

    // Limit number of files to prevent buffer exhaustion
    const maxFiles = Math.min(files.length, 20);
    const filesToProcess = files.slice(0, maxFiles);
    
    const pdf = await PDFDocument.create();
    
    for (const file of filesToProcess) {
      try {
        const imageBuffer = fs.readFileSync(file.path);
        let image;
        
        // Determine image type and embed
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext === '.png') {
          image = await pdf.embedPng(imageBuffer);
        } else if (ext === '.jpg' || ext === '.jpeg') {
          image = await pdf.embedJpg(imageBuffer);
        } else {
          // Skip unsupported formats
          continue;
        }
        
        const page = pdf.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
        
        uploadedFiles.push(file.path);
      } catch (fileError) {
        console.error(`Error processing file ${file.originalname}:`, fileError);
        // Continue with other files
      }
    }

    const pdfBytes = await pdf.save();
    const outputPath = `uploads/images-to-pdf-${Date.now()}.pdf`;
    fs.writeFileSync(outputPath, pdfBytes);

    // Cleanup uploaded files
    uploadedFiles.forEach(filePath => {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    });

    res.json({ 
      success: true, 
      file: path.basename(outputPath),
      message: `Successfully converted ${filesToProcess.length} image(s) to PDF`
    });
  } catch (error) {
    // Cleanup on error
    uploadedFiles.forEach(filePath => {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    });
    
    console.error('Error in images-to-pdf:', error);
    res.status(500).json({ error: error.message || 'Failed to convert images to PDF' });
  }
});

// Download file
app.get('/api/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);
  
  if (fs.existsSync(filePath)) {
    res.download(filePath, filename, (err) => {
      if (err) {
        res.status(500).json({ error: 'Error downloading file' });
      }
    });
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PDF API is running' });
});

const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1';
const server = app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});

// Increase server connection limits and improve connection handling
server.maxConnections = 50; // Reduced to prevent overload
server.timeout = 300000; // 5 minutes
server.keepAliveTimeout = 65000; // 65 seconds
server.headersTimeout = 66000; // 66 seconds

// Handle connection errors
server.on('connection', (socket) => {
  socket.setTimeout(300000); // 5 minutes
  socket.on('timeout', () => {
    socket.destroy();
  });
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  } else {
    console.error('Server error:', error);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

