import express from 'express';
import { body } from 'express-validator';
import {
  getWorkflows,
  getWorkflow,
  create,
  update,
  remove,
  addStep,
  updateStepHandler,
  removeStep,
  addTransitionHandler,
  removeTransition,
} from '../controllers/workflow.controller';
import { simulate } from '../controllers/execution.controller';
import { authenticate } from '../middleware/auth.middleware';
import { paginate } from '../middleware/pagination.middleware';
import { validate } from '../middleware/validation.middleware';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/workflows:
 *   get:
 *     summary: Get all workflows
 *     tags: [Workflows]
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
 *         name: clientId
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, ACTIVE, INACTIVE, ARCHIVED]
 *     responses:
 *       200:
 *         description: List of workflows
 */
router.get('/', paginate, getWorkflows);

/**
 * @swagger
 * /api/workflows/{id}:
 *   get:
 *     summary: Get workflow by ID
 *     tags: [Workflows]
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
 *         description: Workflow details
 */
router.get('/:id', getWorkflow);

/**
 * @swagger
 * /api/workflows:
 *   post:
 *     summary: Create a new workflow
 *     tags: [Workflows]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - clientId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               clientId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [DRAFT, ACTIVE, INACTIVE, ARCHIVED]
 *     responses:
 *       201:
 *         description: Workflow created successfully
 */
router.post(
  '/',
  validate([
    body('name').trim().notEmpty(),
    body('clientId').notEmpty(),
  ]),
  create
);

/**
 * @swagger
 * /api/workflows/{id}:
 *   put:
 *     summary: Update workflow
 *     tags: [Workflows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Workflow updated successfully
 */
router.put('/:id', update);

/**
 * @swagger
 * /api/workflows/{id}:
 *   delete:
 *     summary: Delete workflow
 *     tags: [Workflows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Workflow deleted successfully
 */
router.delete('/:id', remove);

/**
 * @swagger
 * /api/workflows/{id}/simulate:
 *   post:
 *     summary: Simulate workflow execution
 *     tags: [Workflows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientId
 *             properties:
 *               clientId:
 *                 type: string
 *               inputData:
 *                 type: object
 *     responses:
 *       201:
 *         description: Workflow simulation completed
 */
router.post(
  '/:id/simulate',
  validate([
    body('clientId').notEmpty(),
  ]),
  simulate
);

// Step routes
router.post(
  '/:id/steps',
  validate([
    body('name').trim().notEmpty(),
    body('stepType').notEmpty(),
    body('order').isInt({ min: 0 }),
  ]),
  addStep
);

router.put('/:id/steps/:stepId', updateStepHandler);
router.delete('/:id/steps/:stepId', removeStep);

// Transition routes
router.post(
  '/:id/transitions',
  validate([
    body('fromStepId').notEmpty(),
    body('toStepId').notEmpty(),
  ]),
  addTransitionHandler
);

router.delete('/:id/transitions/:transitionId', removeTransition);

export default router;
