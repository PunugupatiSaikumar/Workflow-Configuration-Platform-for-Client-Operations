import express from 'express';
import { body } from 'express-validator';
import {
  getExecutions,
  getExecution,
  create,
  simulate,
  getExecutionLogs,
} from '../controllers/execution.controller';
import { authenticate } from '../middleware/auth.middleware';
import { paginate } from '../middleware/pagination.middleware';
import { validate } from '../middleware/validation.middleware';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/executions:
 *   get:
 *     summary: Get all executions
 *     tags: [Executions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: workflowId
 *         schema:
 *           type: string
 *       - in: query
 *         name: clientId
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, RUNNING, COMPLETED, FAILED, CANCELLED]
 *     responses:
 *       200:
 *         description: List of executions
 */
router.get('/', paginate, getExecutions);

/**
 * @swagger
 * /api/executions/{id}:
 *   get:
 *     summary: Get execution by ID
 *     tags: [Executions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Execution details
 */
router.get('/:id', getExecution);

/**
 * @swagger
 * /api/executions/{id}/logs:
 *   get:
 *     summary: Get execution logs
 *     tags: [Executions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Execution logs
 */
router.get('/:id/logs', getExecutionLogs);

/**
 * @swagger
 * /api/executions:
 *   post:
 *     summary: Create a new execution
 *     tags: [Executions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - workflowId
 *               - clientId
 *             properties:
 *               workflowId:
 *                 type: string
 *               clientId:
 *                 type: string
 *               metadata:
 *                 type: object
 *     responses:
 *       201:
 *         description: Execution created successfully
 */
router.post(
  '/',
  validate([
    body('workflowId').notEmpty(),
    body('clientId').notEmpty(),
  ]),
  create
);

export default router;
