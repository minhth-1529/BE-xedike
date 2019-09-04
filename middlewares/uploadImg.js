const multer = require('multer');

const uploadImage = type => {
    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, `./uploads/${type}s`);
        },
        filename: function(req, file, cb) {
            cb(null, file.originalname + '-' + Date.now());
        }
    });
    const upload = multer({ storage: storage });

    return upload.single(type);
};

module.exports = uploadImage;