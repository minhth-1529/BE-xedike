const express = require('express');
const router = express.Router();
const userController = require('./controller');
const { author, authen } = require('../../../middlewares/author');
const uploadImage = require('../../../middlewares/uploadImg');

router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.get('/:id', userController.getDetailUser);
router.put('/:id', userController.updateUser);
router.delete(
    '/:id',
    authen,
    author(['cus', 'user']),
    userController.deleteUser
);
router.post('/login', userController.login);
router.post(
    '/upload-avatar/:id',
    uploadImage('avatar'),
    userController.uploadAvatar
);

module.exports = router;
