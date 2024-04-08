import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, 'public/img');
    },
    filename: function (_req, file, cb) {
        cb(null, file.originalname);
    }
});

export const uploader = multer({storage});