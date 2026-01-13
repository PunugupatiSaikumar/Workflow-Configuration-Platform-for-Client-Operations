import { Response } from 'express';
import {
  getAllExecutions,
  getExecutionById,
  createExecution,
  simulateWorkflow,
} from '../services/execution.service';
import { PaginatedRequest } from '../middleware/pagination.middleware';
import { paginatedResponse } from '../middleware/pagination.middleware';

export const getExecutions = async (
  req: PaginatedRequest,
  res: Response
): Promise<void> => {
  try {
    const filters: any = {};
    if (req.query.workflowId) filters.workflowId = req.query.workflowId;
    if (req.query.clientId) filters.clientId = req.query.clientId;
    if (req.query.status) filters.status = req.query.status;

    const { executions, total } = await getAllExecutions(req.pagination!, filters);
    res.json(paginatedResponse(executions, total, req.pagination!));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getExecution = async (
  req: PaginatedRequest,
  res: Response
): Promise<void> => {
  try {
    const execution = await getExecutionById(req.params.id);
    res.json(execution);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const create = async (req: PaginatedRequest, res: Response): Promise<void> => {
  try {
    const execution = await createExecution(req.body);
    res.status(201).json(execution);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const simulate = async (req: PaginatedRequest, res: Response): Promise<void> => {
  try {
    const execution = await simulateWorkflow({
      workflowId: req.params.id,
      ...req.body,
    });
    res.status(201).json(execution);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getExecutionLogs = async (
  req: PaginatedRequest,
  res: Response
): Promise<void> => {
  try {
    const execution = await getExecutionById(req.params.id);
    res.json({ logs: execution.logs });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};
