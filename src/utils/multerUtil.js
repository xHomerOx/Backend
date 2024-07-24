import multer from 'multer';

const storage = multer.diskStorage({
    destination: (_req, file, cb) => {
      if (file.fieldname === 'profileImage') {
        cb(null, 'public/img/profiles');
      } else if (file.fieldname === 'productImage') {
        cb(null, 'public/img/products');
      } else if (file.fieldname === 'docs') {
        cb(null, 'public/img/documents');
      }
    },
    filename: (_req, file, cb) => {
      cb(null, file.originalname);
    }
});
  
const fileFilter = (req, file, cb) => {
    const allowedImageTypes = ['image/jpeg', 'image/png'];
    const allowedDocumentTypes = ['application/pdf', 'text/plain'];
    
    if (file.fieldname === 'profileImage' || file.fieldname === 'productImage') {
        if (allowedImageTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only PNG and JPEG are allowed for profileImage and productImage.'));
        }
    } else if (file.fieldname === 'docs') {
        if (allowedDocumentTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and text files are allowed for documents.'));
        }
    } else {
        cb(new Error('Campo de archivo no reconocido.'));
    }
};

export const uploader = multer({
    storage, fileFilter
}).fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'productImage', maxCount: 1 },
    { name: 'docs', maxCount: 3 }
]);