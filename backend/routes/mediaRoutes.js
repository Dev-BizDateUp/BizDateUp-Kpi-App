const express = require('express');
const router = express.Router();
const supabase = require('../supabase'); // Adjust the path as necessary
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

router.post('/upload', upload.single('image'), async (req, res) => {
    // Handle file upload logic here
    const file = req.file;
    const { data, error } = await supabase.storage
        .from('images')
        .upload(file.originalname, file.buffer, {
            contentType: file.mimetype,
            upsert: true,
        });
    // For example, you can use multer to handle file uploads

    res.status(200).json({ message: 'File uploaded successfully' });
}
);