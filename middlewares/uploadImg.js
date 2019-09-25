const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

aws.config.update({
    secretAccessKey: '03+7CZOVKk10Y83a+NJQcp36jHkZV34j5yIvBfnx',
    accessKeyId: 'AKIAJ742DQH6M5J5SWEA',
    region: 'us-east-2',
    signatureVersion: 'v4'
});

// Access Key ID:
// AKIAJ742DQH6M5J5SWEA
// Secret Access Key:
// 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

const uploadImage = type => {
    const upload = multer({
        storage: multerS3({
            s3: new aws.S3(),
            bucket: 'xedike-upload',
            acl: 'public-read',
            metadata: function(req, file, cb) {
                cb(undefined, { fieldName: 'META_DATA' });
            },
            key: function(req, file, cb) {
                if (file.mimetype === 'application/octet-stream') type = '.jpg';
                cb(null, type + '/' +  Date.now() + '-' + file.originalname);
            }
        })
    });
    return upload.single(type);
};

// const uploadImage = type => {
//     const storage = multer.diskStorage({
//         destination: function(req, file, cb) {
//             cb(null, `./uploads/${type}s`);
//         },
//         filename: function(req, file, cb) {
//             cb(null, Date.now() + '-' + file.originalname);
//         }
//     });
//     const upload = multer({ storage: storage });

//     return upload.single(type);
// };

module.exports = uploadImage;
