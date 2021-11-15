const express = require('express');
const router = express.Router();
const redis = require('../redis');

router.get('/', async (req, res) => {
  const addedTodosAmount = (await redis.getAsync(redis.ADDED_TODOS_KEY)) || 0;
  res.status(200).send({ added_todos: Number(addedTodosAmount) });
});

module.exports = router;
