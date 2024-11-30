const Task = require('../models/Task');

// Create a Task
const createTask = async (req, res) => {
    const { title, description, dueDate, priority } = req.body;

    // Ensure the user is authenticated (req.user will be set by the authMiddleware)
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    // Validate required fields
    if (!title || !priority) {
        return res.status(400).json({ message: 'Title and priority are required' });
    }

    try {
        // Create and save the task
        const task = await Task.create({
            title,
            description,
            dueDate,
            priority,
            createdBy: req.user._id, // This will be the user ID from the JWT token
        });

        // Respond with the created task
        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error.message);
        res.status(500).json({ message: 'Server Error: Unable to create task' });
    }
};

// Get all Tasks for the authenticated user
const getTasks = async (req, res) => {
    try {
        // Ensure the user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Fetch tasks created by the authenticated user
        const tasks = await Task.find({ createdBy: req.user._id });
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error.message);
        res.status(500).json({ message: 'Server Error: Unable to fetch tasks' });
    }
};

// Update a task
// Update a task
const updateTask = async (req, res) => {
    const { title, description, dueDate, priority } = req.body;

    try {
        // Validate task ID
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid task ID' });
        }

        // Find the task by ID
        const task = await Task.findById(req.params.id);

        // If task is not found
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Ensure the user is authorized to update the task
        if (task.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this task' });
        }

        // Update task fields (only update fields that were provided)
        task.title = title || task.title;
        task.description = description || task.description;
        task.dueDate = dueDate || task.dueDate;
        task.priority = priority || task.priority;

        // Save the updated task
        const updatedTask = await task.save();
        res.json(updatedTask); // Send back the updated task

    } catch (error) {
        console.error('Error updating task:', error.message);
        res.status(500).json({ message: 'Server Error: Unable to update task' });
    }
};



// Delete a Task
// Delete a task
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this task' });
        }

        // Use deleteOne to delete the document
        await task.deleteOne();
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error.message);
        res.status(500).json({ message: 'Server error, unable to delete task' });
    }
};




module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
};
