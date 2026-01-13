import { Response } from 'express';
import {
  getAllWorkflows,
  getWorkflowById,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  addStepToWorkflow,
  updateStep,
  deleteStep,
  addTransition,
  deleteTransition,
} from '../services/workflow.service';
import { PaginatedRequest } from '../middleware/pagination.middleware';
import { paginatedResponse } from '../middleware/pagination.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

export const getWorkflows = async (
  req: PaginatedRequest,
  res: Response
): Promise<void> => {
  try {
    const filters: any = {};
    if (req.query.clientId) filters.clientId = req.query.clientId;
    if (req.query.status) filters.status = req.query.status;

    const { workflows, total } = await getAllWorkflows(req.pagination!, filters);
    res.json(paginatedResponse(workflows, total, req.pagination!));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getWorkflow = async (
  req: PaginatedRequest,
  res: Response
): Promise<void> => {
  try {
    const workflow = await getWorkflowById(req.params.id);
    res.json(workflow);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const create = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const workflow = await createWorkflow({
      ...req.body,
      createdBy: req.user?.id,
    });
    res.status(201).json(workflow);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const update = async (req: PaginatedRequest, res: Response): Promise<void> => {
  try {
    const workflow = await updateWorkflow(req.params.id, req.body);
    res.json(workflow);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const remove = async (req: PaginatedRequest, res: Response): Promise<void> => {
  try {
    await deleteWorkflow(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const addStep = async (req: PaginatedRequest, res: Response): Promise<void> => {
  try {
    const step = await addStepToWorkflow(req.params.id, req.body);
    res.status(201).json(step);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateStepHandler = async (
  req: PaginatedRequest,
  res: Response
): Promise<void> => {
  try {
    const step = await updateStep(req.params.stepId, req.body);
    res.json(step);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const removeStep = async (
  req: PaginatedRequest,
  res: Response
): Promise<void> => {
  try {
    await deleteStep(req.params.stepId);
    res.status(204).send();
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const addTransitionHandler = async (
  req: PaginatedRequest,
  res: Response
): Promise<void> => {
  try {
    const transition = await addTransition(req.params.id, req.body);
    res.status(201).json(transition);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const removeTransition = async (
  req: PaginatedRequest,
  res: Response
): Promise<void> => {
  try {
    await deleteTransition(req.params.transitionId);
    res.status(204).send();
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};
