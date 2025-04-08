const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { execFile } = require('child_process');

const app = express();
const PORT = 3000;
const uploadDir = path.join(__dirname, 'uploads');

// Garantir que o diretório 'uploads' exista
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const allowedOrigins = ['https://conversorpdf.com.br', 'https://www.conversorpdf.com.br'];

app.use(cors({
  origin: allowedOrigins,
}));

// Define a rota GET para a raiz
app.get('/', (req, res) => {
    res.send('API do Conversor PDF está funcionando. Use o endpoint POST /upload para enviar arquivos.');
});

// Salva em memória
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
    // Verificar se um arquivo foi enviado
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo foi enviado.' });
    }

    // Verificar a extensão do arquivo
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    if (fileExtension !== '.docx') {
        return res.status(400).json({ error: 'Apenas arquivos .docx são suportados.' });
    }

    // Criar caminho temporário
    const tempInputPath = path.join(uploadDir, `${Date.now()}${fileExtension}`);
    const tempOutputPath = tempInputPath.replace('.docx', '.pdf');

    // Salvar no temporário
    fs.writeFileSync(tempInputPath, req.file.buffer);

    // Converter arquivo pelo LibreOffice
    execFile('libreoffice', ['--headless', '--convert-to', 'pdf', tempInputPath, '--outdir', uploadDir], (error) => {
        if (error) {
            // Excluir o arquivo temporário em caso de erro
            fs.unlinkSync(tempInputPath);
            return res.status(500).json({ error: 'Erro ao converter arquivo.' });
        }

        const pdfFile = path.basename(tempOutputPath);
        const pdfFilePath = path.join(uploadDir, pdfFile);

        // Enviar o arquivo PDF gerado como download
        res.download(pdfFilePath, (err) => {
            // Excluir arquivos temporários
            fs.unlinkSync(tempInputPath);
            if (fs.existsSync(pdfFilePath)) {
                fs.unlinkSync(pdfFilePath);
            }
            if (err) {
                console.error('Erro ao enviar o arquivo:', err);
                return res.status(500).json({ error: 'Erro ao enviar o arquivo.' });
            }
        });
    });
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));