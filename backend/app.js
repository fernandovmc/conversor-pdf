const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// Salva em memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
    // Cria caminho temporario
    const tempInputPath = path.join(__dirname, 'uploads', `${Date.now()}${path.extname(req.file.originalname)}`);
    const tempOutputPath = tempInputPath.replace('.docx', '.pdf');

    // Salvar no temporario
    fs.writeFileSync(tempInputPath, req.file.buffer);

    // Converter arquivo pelo LibreOffice
    exec(`libreoffice --headless --convert-to pdf "${tempInputPath}" --outdir uploads`, (error) => {
        if (error) {
            // Excluir o arquivo temporário em caso de erro
            fs.unlinkSync(tempInputPath);
            return res.status(500).json({ error: 'Erro ao converter arquivo.' });
        }

        const pdfFile = path.basename(tempOutputPath);
        const pdfFilePath = path.join(__dirname, 'uploads', pdfFile);

        // Enviar o arquivo PDF gerado como download
        res.download(pdfFilePath, (err) => {
            // Excluir arquivos temporarios
            fs.unlinkSync(tempInputPath);
            if (fs.existsSync(pdfFilePath)) {
                fs.unlinkSync(pdfFilePath);
            }
            if (err) {
                console.error('Erro ao enviar o arquivo:', err);
            }
        });
    });
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));