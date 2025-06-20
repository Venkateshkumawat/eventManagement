const express= require('express');
const { submitQuery, getAllQueries } = require('../controllers/queryController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', submitQuery);
router.get('/', authMiddleware, getAllQueries); // Only admin can view all

module.exports = router;
