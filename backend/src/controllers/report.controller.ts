import { Response } from 'express';
import {
  generateWorkflowReport,
  getWorkflowReport,
} from '../services/report.service';
import { PaginatedRequest } from '../middleware/pagination.middleware';

export const getReports = async (
  req: PaginatedRequest,
  res: Response
): Promise<void> => {
  try {
    const filters: any = {};
    if (req.query.workflowId) filters.workflowId = req.query.workflowId;
    if (req.query.clientId) filters.clientId = req.query.clientId;
    if (req.query.startDate) filters.startDate = new Date(req.query.startDate as string);
    if (req.query.endDate) filters.endDate = new Date(req.query.endDate as string);

    const report = await generateWorkflowReport(filters);
    res.json(report);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getWorkflowReports = async (
  req: PaginatedRequest,
  res: Response
): Promise<void> => {
  try {
    const report = await getWorkflowReport(req.params.workflowId);
    res.json(report);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};
