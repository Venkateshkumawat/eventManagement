const asyncHandler = require('express-async-handler');
const Query = require('../models/queryModel');

// @desc    Submit a query or update request

 const submitQuery = asyncHandler(async (req, res) => {
  const { email, query } = req.body;

  if (!email || !query) {
    res.status(400);
    throw new Error('Both email and query are required');
  }

  const newQuery = await Query.create({ email, query });

  res.status(201).json({
    message: 'Query submitted successfully',
    query: newQuery,
  });
});

// @desc    Get all queries (admin only)
// @route   GET /api/queries
// @access  Admin
 const getAllQueries = asyncHandler(async (req, res) => {
  const queries = await Query.find().sort({ createdAt: -1 });
  res.status(200).json(queries);
});

module.exports = {
  submitQuery,
  getAllQueries,
};
