import multer from 'multer';

let counter = 1;

const storage = multer.diskStorage({
    destination: (_req, file, cb) => {
        if (file.fieldname === 'profileImage') {
            cb(null, 'public/uploads/profiles');
        } else if (file.fieldname === 'productImage') {
            cb(null, 'public/uploads/profiles');
        } else if (file.fieldname === 'idDocument') {
            cb(null, 'public/uploads/documents');
        } else if (file.fieldname === 'addressDocument') {
            cb(null, 'public/uploads/documents');
        } else if (file.fieldname === 'statementDocument') {
            cb(null, 'public/uploads/documents');
        }
    },
    filename: (_req, file, cb) => {
        const extension = file.originalname.split('.').pop();
        const newFilename = `${file.fieldname}_${counter}.${extension}`;
        counter++;
        cb(null, newFilename);
    }
});

const fileFilter = (_req, file, cb) => {
    const allowedImageTypes = ['image/jpeg', 'image/png'];
    const allowedDocumentTypes = ['application/pdf', 'text/plain'];
    
    if (file.fieldname === 'profileImage' || file.fieldname === 'productImage') {
        if (allowedImageTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only PNG and JPEG are allowed for profileImage and productImage.'));
        }
    } else if (file.fieldname === 'idDocument' || file.fieldname === 'addressDocument' || file.fieldname === 'statementDocument') {
        if (allowedDocumentTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and text files are allowed for documents.'));
        }
    }
};

export const uploader = multer({
    storage,
    fileFilter
}).fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'productImage', maxCount: 1 },
    { name: 'idDocument', maxCount: 1 },
    { name: 'addressDocument', maxCount: 1 },
    { name: 'statementDocument', maxCount: 1 }
]);