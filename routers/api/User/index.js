const express = require('express');
const router = express.Router();
const userController = require('./controller');
const { authorize, authenticate } = require('../../../middlewares/auth');
const uploadImage = require('../../../middlewares/uploadImg');

router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.get('/:id', userController.getDetailUser);
router.put('/personal/:id', userController.updatePersonalUser);
router.put('/password/:id', userController.updatePasswordUser);
router.delete(
    '/:id',
    authenticate,
    authorize(['cus', 'user']),
    userController.deleteUser
);
router.post('/login', userController.login);
router.post(
    '/upload-avatar/:id',
    uploadImage('avatar'),
    userController.uploadAvatar
);

module.exports = router;
