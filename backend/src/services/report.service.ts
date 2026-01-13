import prisma from '../utils/prisma';
import { ExecutionStatus, StepStatus } from '@prisma/client';

export interface ReportFilters {
  workflowId?: string;
  clientId?: string;
  startDate?: Date;
  endDate?: Date;
}

export const generateWorkflowReport = async (filters: ReportFilters = {}) => {
  const where: any = {};

  if (filters.workflowId) {
    where.workflowId = filters.workflowId;
  }

  if (filters.clientId) {
    where.clientId = filters.clientId;
  }

  if (filters.startDate || filters.endDate) {
    where.startedAt = {};
    if (filters.startDate) {
      where.startedAt.gte = filters.startDate;
    }
    if (filters.endDate) {
      where.startedAt.lte = filters.endDate;
    }
  }

  const executions = await prisma.workflowExecution.findMany({
    where,
    include: {
      workflow: {
        select: {
          id: true,
          name: true,
        },
      },
      client: {
        select: {
          id: true,
          name: true,
        },
      },
      logs: true,
    },
  });

  // Calculate metrics
  const totalExecutions = executions.length;
  const completedExecutions = executions.filter(
    e => e.status === ExecutionStatus.COMPLETED
  ).length;
  const failedExecutions = executions.filter(
    e => e.status === ExecutionStatus.FAILED
  ).length;
  const runningExecutions = executions.filter(
    e => e.status === ExecutionStatus.RUNNING
  ).length;

  const averageExecutionTime = executions
    .filter(e => e.completedAt)
    .reduce((acc, e) => {
      const duration = e.completedAt!.getTime() - e.startedAt.getTime();
      return acc + duration;
    }, 0) / completedExecutions || 0;

  // Group by workflow
  const workflowStats = executions.reduce((acc: any, exec) => {
    const workflowId = exec.workflowId;
    if (!acc[workflowId]) {
      acc[workflowId] = {
        workflowId,
        workflowName: exec.workflow.name,
        total: 0,
        completed: 0,
        failed: 0,
        running: 0,
      };
    }
    acc[workflowId].total++;
    if (exec.status === ExecutionStatus.COMPLETED) acc[workflowId].completed++;
    if (exec.status === ExecutionStatus.FAILED) acc[workflowId].failed++;
    if (exec.status === ExecutionStatus.RUNNING) acc[workflowId].running++;
    return acc;
  }, {});

  // Group by client
  const clientStats = executions.reduce((acc: any, exec) => {
    const clientId = exec.clientId;
    if (!acc[clientId]) {
      acc[clientId] = {
        clientId,
        clientName: exec.client.name,
        total: 0,
        completed: 0,
        failed: 0,
      };
    }
    acc[clientId].total++;
    if (exec.status === ExecutionStatus.COMPLETED) acc[clientId].completed++;
    if (exec.status === ExecutionStatus.FAILED) acc[clientId].failed++;
    return acc;
  }, {});

  // Step-level statistics
  const stepStats = executions.reduce((acc: any, exec) => {
    exec.logs.forEach((log: any) => {
      if (log.stepId) {
        const stepId = log.stepId;
        if (!acc[stepId]) {
          acc[stepId] = {
            stepId,
            stepName: log.step?.name || 'Unknown',
            total: 0,
            completed: 0,
            failed: 0,
            skipped: 0,
          };
        }
        acc[stepId].total++;
        if (log.status === StepStatus.COMPLETED) acc[stepId].completed++;
        if (log.status === StepStatus.FAILED) acc[stepId].failed++;
        if (log.status === StepStatus.SKIPPED) acc[stepId].skipped++;
      }
    });
    return acc;
  }, {});

  return {
    period: {
      startDate: filters.startDate || null,
      endDate: filters.endDate || null,
    },
    summary: {
      totalExecutions,
      completedExecutions,
      failedExecutions,
      runningExecutions,
      successRate: totalExecutions > 0 ? (completedExecutions / totalExecutions) * 100 : 0,
      averageExecutionTimeMs: averageExecutionTime,
    },
    byWorkflow: Object.values(workflowStats),
    byClient: Object.values(clientStats),
    byStep: Object.values(stepStats),
  };
};

export const getWorkflowReport = async (workflowId: string) => {
  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId },
  });

  if (!workflow) {
    throw new Error('Workflow not found');
  }

  return generateWorkflowReport({ workflowId });
};

export const saveReport = async (
  workflowId: string,
  executionId: string | null,
  reportType: string,
  metrics: any,
  periodStart: Date,
  periodEnd?: Date
) => {
  return prisma.workflowReport.create({
    data: {
      workflowId,
      executionId,
      reportType,
      metrics,
      periodStart,
      periodEnd,
    },
  });
};
