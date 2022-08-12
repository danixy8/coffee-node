const { Router } = require('express');
const { usersGet, userPost, userPut, userDelete } = require('../controllers/users.controller');

const router = Router();

router.get('/', usersGet);

router.post('/', userPost);

router.put('/:id', userPut);

router.delete('/', userDelete);

module.exports = router;