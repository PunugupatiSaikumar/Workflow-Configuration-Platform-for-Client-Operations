import prisma from '../utils/prisma';
import { PaginationParams } from '../middleware/pagination.middleware';
import { ExecutionStatus, StepStatus } from '@prisma/client';

export interface CreateExecutionData {
  workflowId: string;
  clientId: string;
  metadata?: any;
}

export interface SimulateExecutionData {
  workflowId: string;
  clientId: string;
  inputData?: any;
}

const evaluateCondition = (condition: any, context: any): boolean => {
  if (!condition || Object.keys(condition).length === 0) {
    return true; // No condition means always true
  }

  // Simple condition evaluation
  // Supports: { field: "value", operator: "equals" }
  // Can be extended for more complex logic
  if (condition.field && condition.operator && condition.value !== undefined) {
    const fieldValue = context[condition.field];
    
    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      case 'notEquals':
        return fieldValue !== condition.value;
      case 'greaterThan':
        return fieldValue > condition.value;
      case 'lessThan':
        return fieldValue < condition.value;
      case 'contains':
        return String(fieldValue).includes(String(condition.value));
      default:
        return true;
    }
  }

  return true;
};

const executeStep = async (
  step: any,
  executionId: string,
  context: any
): Promise<{ status: StepStatus; message?: string; data?: any; error?: string }> => {
  try {
    // Simulate step execution based on step type
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing time

    switch (step.stepType) {
      case 'approval':
        return {
          status: StepStatus.COMPLETED,
          message: `Approval step "${step.name}" completed`,
          data: { approved: true },
        };
      
      case 'notification':
        return {
          status: StepStatus.COMPLETED,
          message: `Notification sent for step "${step.name}"`,
          data: { notified: true },
        };
      
      case 'data_entry':
        return {
          status: StepStatus.COMPLETED,
          message: `Data entry step "${step.name}" completed`,
          data: context.inputData || {},
        };
      
      case 'custom':
        return {
          status: StepStatus.COMPLETED,
          message: `Custom step "${step.name}" executed`,
          data: step.config || {},
        };
      
      default:
        return {
          status: StepStatus.COMPLETED,
          message: `Step "${step.name}" executed`,
        };
    }
  } catch (error: any) {
    return {
      status: StepStatus.FAILED,
      error: error.message || 'Step execution failed',
    };
  }
};

export const getAllExecutions = async (
  pagination: PaginationParams,
  filters?: { workflowId?: string; clientId?: string; status?: ExecutionStatus }
) => {
  const where: any = {};
  
  if (filters?.workflowId) {
    where.workflowId = filters.workflowId;
  }
  
  if (filters?.clientId) {
    where.clientId = filters.clientId;
  }
  
  if (filters?.status) {
    where.status = filters.status;
  }

  const [executions, total] = await Promise.all([
    prisma.workflowExecution.findMany({
      where,
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: { startedAt: 'desc' },
      include: {
        workflow: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            logs: true,
          },
        },
      },
    }),
    prisma.workflowExecution.count({ where }),
  ]);

  return { executions, total };
};

export const getExecutionById = async (id: string) => {
  const execution = await prisma.workflowExecution.findUnique({
    where: { id },
    include: {
      workflow: {
        include: {
          steps: {
            orderBy: { order: 'asc' },
          },
          transitions: true,
        },
      },
      client: true,
      logs: {
        orderBy: { startedAt: 'asc' },
        include: {
          step: true,
        },
      },
    },
  });

  if (!execution) {
    throw new Error('Execution not found');
  }

  return execution;
};

export const createExecution = async (data: CreateExecutionData) => {
  // Verify workflow and client exist
  const [workflow, client] = await Promise.all([
    prisma.workflow.findUnique({ where: { id: data.workflowId } }),
    prisma.client.findUnique({ where: { id: data.clientId } }),
  ]);

  if (!workflow) {
    throw new Error('Workflow not found');
  }

  if (!client) {
    throw new Error('Client not found');
  }

  return prisma.workflowExecution.create({
    data: {
      workflowId: data.workflowId,
      clientId: data.clientId,
      status: ExecutionStatus.PENDING,
      metadata: data.metadata || {},
    },
    include: {
      workflow: true,
      client: true,
    },
  });
};

export const simulateWorkflow = async (data: SimulateExecutionData) => {
  // Get workflow with steps and transitions
  const workflow = await prisma.workflow.findUnique({
    where: { id: data.workflowId },
    include: {
      steps: {
        orderBy: { order: 'asc' },
      },
      transitions: {
        include: {
          fromStep: true,
          toStep: true,
        },
      },
    },
  });

  if (!workflow) {
    throw new Error('Workflow not found');
  }

  const client = await prisma.client.findUnique({
    where: { id: data.clientId },
  });

  if (!client) {
    throw new Error('Client not found');
  }

  // Create execution record
  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId: data.workflowId,
      clientId: data.clientId,
      status: ExecutionStatus.RUNNING,
      metadata: { simulation: true, inputData: data.inputData || {} },
    },
  });

  const context = {
    ...data.inputData,
    workflowId: data.workflowId,
    clientId: data.clientId,
    executionId: execution.id,
  };

  try {
    // Find starting step (first step or step with no incoming transitions)
    const startingStep = workflow.steps.find(
      step => !workflow.transitions.some(t => t.toStepId === step.id)
    ) || workflow.steps[0];

    if (!startingStep) {
      throw new Error('Workflow has no steps');
    }

    let currentStep: typeof workflow.steps[0] | null = startingStep;
    const executedSteps = new Set<string>();

    // Execute workflow steps
    while (currentStep && !executedSteps.has(currentStep.id)) {
      executedSteps.add(currentStep.id);

      // Execute step
      const stepResult = await executeStep(currentStep, execution.id, context);

      // Create execution log
      await prisma.executionLog.create({
        data: {
          executionId: execution.id,
          stepId: currentStep.id,
          status: stepResult.status,
          message: stepResult.message,
          data: stepResult.data,
          error: stepResult.error,
          completedAt: stepResult.status !== StepStatus.RUNNING ? new Date() : undefined,
        },
      });

      // Update context with step result
      if (stepResult.data) {
        Object.assign(context, stepResult.data);
      }

      // If step failed, stop execution
      if (stepResult.status === StepStatus.FAILED) {
        await prisma.workflowExecution.update({
          where: { id: execution.id },
          data: {
            status: ExecutionStatus.FAILED,
            completedAt: new Date(),
          },
        });
        break;
      }

      // Find next step based on transitions
      if (!currentStep) break;
      
      const transitions = workflow.transitions.filter(
        t => t.fromStepId === currentStep!.id
      );

      let nextStep: typeof workflow.steps[0] | null = null;

      if (transitions.length > 0) {
        // Evaluate conditions to find matching transition
        for (const transition of transitions) {
          if (transition.isDefault || evaluateCondition(transition.condition, context)) {
            const foundStep = workflow.steps.find(s => s.id === transition.toStepId);
            if (foundStep) {
              nextStep = foundStep;
              break;
            }
          }
        }
      }

      currentStep = nextStep;
    }

    // Mark execution as completed
    await prisma.workflowExecution.update({
      where: { id: execution.id },
      data: {
        status: ExecutionStatus.COMPLETED,
        completedAt: new Date(),
      },
    });

    // Return execution with logs
    return getExecutionById(execution.id);
  } catch (error: any) {
    // Mark execution as failed
    await prisma.workflowExecution.update({
      where: { id: execution.id },
      data: {
        status: ExecutionStatus.FAILED,
        completedAt: new Date(),
      },
    });

    await prisma.executionLog.create({
      data: {
        executionId: execution.id,
        status: StepStatus.FAILED,
        error: error.message || 'Workflow execution failed',
      },
    });

    throw error;
  }
};
