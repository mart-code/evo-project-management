import express from 'express';

import { createTask } from '../controllers/taskController.js';

const taskRouter = express.Router();

taskRouter.post('/', createTask);
taskRouter.put('/:id', createTask); // Placeholder for updateTask
taskRouter.delete('/delete', createTask); // Placeholder for deleteTask

export default taskRouter;