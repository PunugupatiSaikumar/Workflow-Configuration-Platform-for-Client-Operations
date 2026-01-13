import prisma from '../utils/prisma';
import { PaginationParams } from '../middleware/pagination.middleware';

export interface CreateClientData {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
  notes?: string;
  isActive?: boolean;
}

export interface UpdateClientData extends Partial<CreateClientData> {}

export const getAllClients = async (pagination: PaginationParams, filters?: { isActive?: boolean }) => {
  const where: any = {};
  
  if (filters?.isActive !== undefined) {
    where.isActive = filters.isActive;
  }

  const [clients, total] = await Promise.all([
    prisma.client.findMany({
      where,
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            workflows: true,
            executions: true,
          },
        },
      },
    }),
    prisma.client.count({ where }),
  ]);

  return { clients, total };
};

export const getClientById = async (id: string) => {
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      workflows: {
        select: {
          id: true,
          name: true,
          status: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          workflows: true,
          executions: true,
        },
      },
    },
  });

  if (!client) {
    throw new Error('Client not found');
  }

  return client;
};

export const createClient = async (data: CreateClientData) => {
  return prisma.client.create({
    data,
  });
};

export const updateClient = async (id: string, data: UpdateClientData) => {
  const client = await prisma.client.findUnique({ where: { id } });

  if (!client) {
    throw new Error('Client not found');
  }

  return prisma.client.update({
    where: { id },
    data,
  });
};

export const deleteClient = async (id: string) => {
  const client = await prisma.client.findUnique({ where: { id } });

  if (!client) {
    throw new Error('Client not found');
  }

  return prisma.client.delete({
    where: { id },
  });
};
