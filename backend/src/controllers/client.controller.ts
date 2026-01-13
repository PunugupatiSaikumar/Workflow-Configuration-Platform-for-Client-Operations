import { Response } from 'express';
import {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} from '../services/client.service';
import { PaginatedRequest } from '../middleware/pagination.middleware';
import { paginatedResponse } from '../middleware/pagination.middleware';

export const getClients = async (
  req: PaginatedRequest,
  res: Response
): Promise<void> => {
  try {
    const filters: any = {};
    if (req.query.isActive !== undefined) {
      filters.isActive = req.query.isActive === 'true';
    }

    const { clients, total } = await getAllClients(req.pagination!, filters);
    res.json(paginatedResponse(clients, total, req.pagination!));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getClient = async (req: PaginatedRequest, res: Response): Promise<void> => {
  try {
    const client = await getClientById(req.params.id);
    res.json(client);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const create = async (req: PaginatedRequest, res: Response): Promise<void> => {
  try {
    const client = await createClient(req.body);
    res.status(201).json(client);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const update = async (req: PaginatedRequest, res: Response): Promise<void> => {
  try {
    const client = await updateClient(req.params.id, req.body);
    res.json(client);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const remove = async (req: PaginatedRequest, res: Response): Promise<void> => {
  try {
    await deleteClient(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};
