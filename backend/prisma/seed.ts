import { PrismaClient, UserRole, WorkflowStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Admin User',
      role: UserRole.ADMIN,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      name: 'Regular User',
      role: UserRole.USER,
    },
  });

  console.log('Created users:', { admin: admin.email, user: user.email });

  // Create clients
  const client1 = await prisma.client.upsert({
    where: { id: 'client-1' },
    update: {},
    create: {
      id: 'client-1',
      name: 'Acme Corporation',
      email: 'contact@acme.com',
      phone: '+1-555-0100',
      address: '123 Business St, New York, NY 10001',
      company: 'Acme Corporation',
      notes: 'Major enterprise client',
      isActive: true,
    },
  });

  const client2 = await prisma.client.upsert({
    where: { id: 'client-2' },
    update: {},
    create: {
      id: 'client-2',
      name: 'TechStart Inc',
      email: 'hello@techstart.com',
      phone: '+1-555-0200',
      address: '456 Innovation Ave, San Francisco, CA 94102',
      company: 'TechStart Inc',
      notes: 'Startup client',
      isActive: true,
    },
  });

  const client3 = await prisma.client.upsert({
    where: { id: 'client-3' },
    update: {},
    create: {
      id: 'client-3',
      name: 'Global Services Ltd',
      email: 'info@globalservices.com',
      phone: '+1-555-0300',
      address: '789 Global Blvd, Chicago, IL 60601',
      company: 'Global Services Ltd',
      isActive: true,
    },
  });

  console.log('Created clients:', client1.name, client2.name, client3.name);

  // Create workflows
  const workflow1 = await prisma.workflow.create({
    data: {
      name: 'Client Onboarding Process',
      description: 'Complete onboarding workflow for new clients',
      clientId: client1.id,
      status: WorkflowStatus.ACTIVE,
      createdBy: admin.id,
      steps: {
        create: [
          {
            name: 'Initial Contact',
            description: 'First contact with client',
            stepType: 'notification',
            order: 0,
            config: {
              notificationType: 'email',
              template: 'welcome_email',
            },
            isRequired: true,
          },
          {
            name: 'Document Collection',
            description: 'Collect required documents',
            stepType: 'data_entry',
            order: 1,
            config: {
              requiredDocuments: ['id', 'contract', 'tax_form'],
            },
            isRequired: true,
          },
          {
            name: 'Manager Approval',
            description: 'Requires manager approval',
            stepType: 'approval',
            order: 2,
            config: {
              approverRole: 'manager',
              timeout: 48,
            },
            isRequired: true,
          },
          {
            name: 'Account Setup',
            description: 'Set up client account',
            stepType: 'custom',
            order: 3,
            config: {
              action: 'create_account',
            },
            isRequired: true,
          },
          {
            name: 'Welcome Email',
            description: 'Send welcome email',
            stepType: 'notification',
            order: 4,
            config: {
              notificationType: 'email',
              template: 'account_ready',
            },
            isRequired: false,
          },
        ],
      },
    },
    include: {
      steps: true,
    },
  });

  // Add transitions for workflow1
  const steps1 = workflow1.steps;
  await prisma.workflowTransition.createMany({
    data: [
      {
        workflowId: workflow1.id,
        fromStepId: steps1[0].id,
        toStepId: steps1[1].id,
        isDefault: true,
      },
      {
        workflowId: workflow1.id,
        fromStepId: steps1[1].id,
        toStepId: steps1[2].id,
        condition: {
          field: 'documentsComplete',
          operator: 'equals',
          value: true,
        },
      },
      {
        workflowId: workflow1.id,
        fromStepId: steps1[2].id,
        toStepId: steps1[3].id,
        condition: {
          field: 'approved',
          operator: 'equals',
          value: true,
        },
      },
      {
        workflowId: workflow1.id,
        fromStepId: steps1[3].id,
        toStepId: steps1[4].id,
        isDefault: true,
      },
    ],
  });

  const workflow2 = await prisma.workflow.create({
    data: {
      name: 'Support Ticket Resolution',
      description: 'Workflow for resolving support tickets',
      clientId: client2.id,
      status: WorkflowStatus.ACTIVE,
      createdBy: admin.id,
      steps: {
        create: [
          {
            name: 'Ticket Created',
            description: 'Support ticket is created',
            stepType: 'notification',
            order: 0,
            config: {
              notificationType: 'email',
            },
            isRequired: true,
          },
          {
            name: 'Initial Review',
            description: 'Review ticket details',
            stepType: 'data_entry',
            order: 1,
            config: {},
            isRequired: true,
          },
          {
            name: 'Assign to Team',
            description: 'Assign ticket to appropriate team',
            stepType: 'custom',
            order: 2,
            config: {
              action: 'assign',
            },
            isRequired: true,
          },
          {
            name: 'Resolution',
            description: 'Resolve the ticket',
            stepType: 'data_entry',
            order: 3,
            config: {},
            isRequired: true,
          },
          {
            name: 'Client Confirmation',
            description: 'Get client confirmation',
            stepType: 'approval',
            order: 4,
            config: {},
            isRequired: false,
          },
        ],
      },
    },
    include: {
      steps: true,
    },
  });

  // Add transitions for workflow2
  const steps2 = workflow2.steps;
  await prisma.workflowTransition.createMany({
    data: [
      {
        workflowId: workflow2.id,
        fromStepId: steps2[0].id,
        toStepId: steps2[1].id,
        isDefault: true,
      },
      {
        workflowId: workflow2.id,
        fromStepId: steps2[1].id,
        toStepId: steps2[2].id,
        isDefault: true,
      },
      {
        workflowId: workflow2.id,
        fromStepId: steps2[2].id,
        toStepId: steps2[3].id,
        isDefault: true,
      },
      {
        workflowId: workflow2.id,
        fromStepId: steps2[3].id,
        toStepId: steps2[4].id,
        condition: {
          field: 'requiresConfirmation',
          operator: 'equals',
          value: true,
        },
      },
    ],
  });

  const workflow3 = await prisma.workflow.create({
    data: {
      name: 'Invoice Processing',
      description: 'Process and approve invoices',
      clientId: client3.id,
      status: WorkflowStatus.DRAFT,
      createdBy: user.id,
      steps: {
        create: [
          {
            name: 'Invoice Submission',
            description: 'Invoice is submitted',
            stepType: 'data_entry',
            order: 0,
            config: {},
            isRequired: true,
          },
          {
            name: 'Validation',
            description: 'Validate invoice details',
            stepType: 'custom',
            order: 1,
            config: {
              validationRules: ['amount', 'date', 'vendor'],
            },
            isRequired: true,
          },
          {
            name: 'Finance Approval',
            description: 'Finance team approval',
            stepType: 'approval',
            order: 2,
            config: {
              approverRole: 'finance',
            },
            isRequired: true,
          },
          {
            name: 'Payment Processing',
            description: 'Process payment',
            stepType: 'custom',
            order: 3,
            config: {
              action: 'process_payment',
            },
            isRequired: true,
          },
        ],
      },
    },
    include: {
      steps: true,
    },
  });

  // Add transitions for workflow3
  const steps3 = workflow3.steps;
  await prisma.workflowTransition.createMany({
    data: [
      {
        workflowId: workflow3.id,
        fromStepId: steps3[0].id,
        toStepId: steps3[1].id,
        isDefault: true,
      },
      {
        workflowId: workflow3.id,
        fromStepId: steps3[1].id,
        toStepId: steps3[2].id,
        condition: {
          field: 'isValid',
          operator: 'equals',
          value: true,
        },
      },
      {
        workflowId: workflow3.id,
        fromStepId: steps3[2].id,
        toStepId: steps3[3].id,
        condition: {
          field: 'approved',
          operator: 'equals',
          value: true,
        },
      },
    ],
  });

  console.log('Created workflows:', workflow1.name, workflow2.name, workflow3.name);
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
