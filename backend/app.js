const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = 3000;

const upload = multer({ storage: multer.memoryStorage() });

const cloudCOnvertApiKey = process.env.CLOUDCONVERT_API_KEY;

app.use(cors({
  origin: true
}));

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo foi enviado.' });

  try {
    const createJobRes = await axios.post('https://api.cloudconvert.com/v2/jobs', {
      tasks: {
        'upload-file': {
          operation: 'import/upload'
        },
        'convert-file': {
          operation: 'convert',
          input: 'upload-file',
          input_format: 'docx',
          output_format: 'pdf'
        },
        'export-file': {
          operation: 'export/url',
          input: 'convert-file'
        }
      }
    }, {
      headers: {
        Authorization: `Bearer ${cloudCOnvertApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const uploadTask = createJobRes.data.data.tasks.find(task => task.name === 'upload-file');
    const uploadUrl = uploadTask.result.form.url;
    const uploadParams = uploadTask.result.form.parameters;

    const form = new FormData();
    for (const [key, value] of Object.entries(uploadParams)) {
      form.append(key, value);
    }
    form.append('file', req.file.buffer, req.file.originalname);

    await axios.post(uploadUrl, form, {
      headers: form.getHeaders()
    });

    let jobId = createJobRes.data.data.id;
    let exportTask;

    while (true) {
      const jobStatus = await axios.get(`https://api.cloudconvert.com/v2/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${process.env.CLOUDCONVERT_API_KEY}`
        }
      });

      const status = jobStatus.data.data.status;
      if (status === 'finished') {
        exportTask = jobStatus.data.data.tasks.find(task => task.name === 'export-file');
        break;
      } else if (status === 'error') {
        return res.status(500).json({ error: 'Erro na conversão do arquivo.' });
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    const fileUrl = exportTask.result.files[0].url;
    const pdfRes = await axios.get(fileUrl, { responseType: 'arraybuffer' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="documento.pdf"');
    res.send(pdfRes.data);
  } catch (err) {
    console.error('Erro durante a conversão:', err?.response?.data || err.message);
    res.status(500).json({ error: 'Erro ao converter arquivo.' });
  }
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
