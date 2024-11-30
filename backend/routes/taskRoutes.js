const express = require('express');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');

const router = express.Router();

// Existing routes
router.post('/', createTask);
router.get('/', getTasks);
router.put('/:id', updateTask); // Update task
router.delete('/:id', deleteTask); // Delete task

module.exports = router;
