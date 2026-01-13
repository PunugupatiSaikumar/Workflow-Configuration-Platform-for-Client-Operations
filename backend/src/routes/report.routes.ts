import express from 'express';
import {
  getReports,
  getWorkflowReports,
} from '../controllers/report.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Get workflow reports
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: workflowId
 *         schema:
 *           type: string
 *       - in: query
 *         name: clientId
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Workflow reports
 */
router.get('/', getReports);

/**
 * @swagger
 * /api/reports/{workflowId}:
 *   get:
 *     summary: Get workflow-specific reports
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workflowId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workflow reports
 */
router.get('/:workflowId', getWorkflowReports);

export default router;
