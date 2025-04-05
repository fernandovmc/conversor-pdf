const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('uploads'));

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (_, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
}
);
const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
    const inputPath = path.join(__dirname, 'uploads', req.file.filename);
    const outputPath = inputPath.replace('.docx', '.pdf');
  
    exec(`libreoffice --headless --convert-to pdf "${inputPath}" --outdir uploads`, (error) => {
      if (error) {
        return res.status(500).json({ error: 'Erro ao converter arquivo.' });
      }
  
      const pdfFile = path.basename(outputPath);
      res.download(path.join(__dirname, 'uploads', pdfFile));
    });
  });
  
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));