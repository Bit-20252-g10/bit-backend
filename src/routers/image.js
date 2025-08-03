import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const imageRouter = Router();

// Configurar multer para subida de archivos
// cb- callback funcion que pasa por otra función y se ejecuta en el momento que sea necesario
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    // Crear directorio si no existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generar nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  },
  fileFilter: function (req, file, cb) {
    // Solo permitir imágenes
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  }
});

// Endpoint para subir imagen
imageRouter.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        allOK: false,
        message: 'No se proporcionó ningún archivo',
        data: null
      });
    }

    // URL de la imagen subida
    const imageUrl = `http://localhost:4000/uploads/${req.file.filename}`;

    res.status(200).json({
      allOK: true,
      message: 'Imagen subida exitosamente',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        url: imageUrl,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({
      allOK: false,
      message: 'Error al subir la imagen',
      data: error.message
    });
  }
});

// Endpoint específico para imágenes de juegos
imageRouter.post('/game-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        allOK: false,
        message: 'No se proporcionó ningún archivo',
        data: null
      });
    }

    // URL de la imagen subida
    const imageUrl = `http://localhost:4000/uploads/${req.file.filename}`;

    res.status(200).json({
      allOK: true,
      message: 'Imagen de juego subida exitosamente',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        url: imageUrl,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('Error uploading game image:', error);
    res.status(500).json({
      allOK: false,
      message: 'Error al subir la imagen del juego',
      data: error.message
    });
  }
});

// Endpoint para servir imágenes
imageRouter.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join('uploads', filename);
  
  if (fs.existsSync(filepath)) {
    res.sendFile(path.resolve(filepath));
  } else {
    res.status(404).json({
      allOK: false,
      message: 'Imagen no encontrada',
      data: null
    });
  }
});

export default imageRouter; 