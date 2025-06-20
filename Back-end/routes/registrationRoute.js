const express = require('express');
const router = express.Router();
const { registerForEvent, getAllRegistrations, cancelRegistration} = require('../controllers/RegistrationController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, registerForEvent);
router.get('/me', authMiddleware, getAllRegistrations);
router.delete('/:id', authMiddleware, cancelRegistration);


module.exports = router;
