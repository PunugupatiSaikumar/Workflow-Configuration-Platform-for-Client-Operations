import prisma from '../utils/prisma';
import { PaginationParams } from '../middleware/pagination.middleware';
import { WorkflowStatus } from '@prisma/client';

export interface CreateWorkflowData {
  name: string;
  description?: string;
  clientId: string;
  status?: WorkflowStatus;
  createdBy?: string;
}

export interface UpdateWorkflowData {
  name?: string;
  description?: string;
  status?: WorkflowStatus;
}

export interface CreateStepData {
  name: string;
  description?: string;
  stepType: string;
  order: number;
  config?: any;
  isRequired?: boolean;
}

export interface CreateTransitionData {
  fromStepId: string;
  toStepId: string;
  condition?: any;
  isDefault?: boolean;
}

export const getAllWorkflows = async (
  pagination: PaginationParams,
  filters?: { clientId?: string; status?: WorkflowStatus }
) => {
  const where: any = {};
  
  if (filters?.clientId) {
    where.clientId = filters.clientId;
  }
  
  if (filters?.status) {
    where.status = filters.status;
  }

  const [workflows, total] = await Promise.all([
    prisma.workflow.findMany({
      where,
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: { createdAt: 'desc' },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            steps: true,
            transitions: true,
            executions: true,
          },
        },
      },
    }),
    prisma.workflow.count({ where }),
  ]);

  return { workflows, total };
};

export const getWorkflowById = async (id: string) => {
  const workflow = await prisma.workflow.findUnique({
    where: { id },
    include: {
      client: true,
      steps: {
        orderBy: { order: 'asc' },
      },
      transitions: {
        include: {
          fromStep: true,
          toStep: true,
        },
      },
      _count: {
        select: {
          executions: true,
        },
      },
    },
  });

  if (!workflow) {
    throw new Error('Workflow not found');
  }

  return workflow;
};

export const createWorkflow = async (data: CreateWorkflowData) => {
  // Verify client exists
  const client = await prisma.client.findUnique({
    where: { id: data.clientId },
  });

  if (!client) {
    throw new Error('Client not found');
  }

  return prisma.workflow.create({
    data: {
      name: data.name,
      description: data.description,
      clientId: data.clientId,
      status: data.status || WorkflowStatus.DRAFT,
      createdBy: data.createdBy,
    },
    include: {
      client: true,
    },
  });
};

export const updateWorkflow = async (id: string, data: UpdateWorkflowData) => {
  const workflow = await prisma.workflow.findUnique({ where: { id } });

  if (!workflow) {
    throw new Error('Workflow not found');
  }

  return prisma.workflow.update({
    where: { id },
    data: {
      ...data,
      version: workflow.version + 1,
    },
    include: {
      client: true,
    },
  });
};

export const deleteWorkflow = async (id: string) => {
  const workflow = await prisma.workflow.findUnique({ where: { id } });

  if (!workflow) {
    throw new Error('Workflow not found');
  }

  return prisma.workflow.delete({
    where: { id },
  });
};

export const addStepToWorkflow = async (
  workflowId: string,
  stepData: CreateStepData
) => {
  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId },
  });

  if (!workflow) {
    throw new Error('Workflow not found');
  }

  return prisma.workflowStep.create({
    data: {
      ...stepData,
      workflowId,
      config: stepData.config || {},
    },
  });
};

export const updateStep = async (
  stepId: string,
  stepData: Partial<CreateStepData>
) => {
  const step = await prisma.workflowStep.findUnique({
    where: { id: stepId },
  });

  if (!step) {
    throw new Error('Step not found');
  }

  return prisma.workflowStep.update({
    where: { id: stepId },
    data: stepData,
  });
};

export const deleteStep = async (stepId: string) => {
  const step = await prisma.workflowStep.findUnique({
    where: { id: stepId },
  });

  if (!step) {
    throw new Error('Step not found');
  }

  return prisma.workflowStep.delete({
    where: { id: stepId },
  });
};

export const addTransition = async (
  workflowId: string,
  transitionData: CreateTransitionData
) => {
  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId },
  });

  if (!workflow) {
    throw new Error('Workflow not found');
  }

  // Verify steps exist and belong to the workflow
  const [fromStep, toStep] = await Promise.all([
    prisma.workflowStep.findFirst({
      where: {
        id: transitionData.fromStepId,
        workflowId,
      },
    }),
    prisma.workflowStep.findFirst({
      where: {
        id: transitionData.toStepId,
        workflowId,
      },
    }),
  ]);

  if (!fromStep || !toStep) {
    throw new Error('One or both steps not found or do not belong to this workflow');
  }

  return prisma.workflowTransition.create({
    data: {
      workflowId,
      fromStepId: transitionData.fromStepId,
      toStepId: transitionData.toStepId,
      condition: transitionData.condition || {},
      isDefault: transitionData.isDefault || false,
    },
    include: {
      fromStep: true,
      toStep: true,
    },
  });
};

export const deleteTransition = async (transitionId: string) => {
  const transition = await prisma.workflowTransition.findUnique({
    where: { id: transitionId },
  });

  if (!transition) {
    throw new Error('Transition not found');
  }

  return prisma.workflowTransition.delete({
    where: { id: transitionId },
  });
};
