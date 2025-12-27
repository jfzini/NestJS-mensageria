import {
  PrismaClient,
  TaskPriority,
  TaskStatus,
  UserRole,
  ProjectCollaboratorRole,
  User,
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const USER_COUNT = 10;
const PROJECT_COUNT = 5;
const TASKS_PER_PROJECT_MIN = 3;
const TASKS_PER_PROJECT_MAX = 8;
const COMMENTS_PER_TASK_MAX = 5;

async function main() {
  const environment = process.env.NODE_ENV;

  // DO NOT RUN IN PRODUCTION. LIKE EVER.
  if (environment !== 'development') {
    throw new Error('Seed can only be run in development environment');
  }

  // Delete in correct order (due to foreign key constraints)
  await prisma.comment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.projectCollaborator.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const users: User[] = [];
  for (let i = 0; i < USER_COUNT; i++) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: hashedPassword,
        avatar: faker.image.avatar(),
        role: i === 0 ? UserRole.ADMIN : UserRole.USER,
      },
    });
    users.push(user);
  }

  console.log(`Created ${users.length} users`);

  // Create projects
  for (let i = 0; i < PROJECT_COUNT; i++) {
    const projectOwner = faker.helpers.arrayElement(users);
    const project = await prisma.project.create({
      data: {
        name: faker.company.name(),
        description: faker.company.catchPhrase(),
        createdById: projectOwner.id,
      },
    });

    // Add collaborators to project
    const collaboratorCount = faker.number.int({ min: 1, max: 4 });
    const selectedCollaborators = faker.helpers.arrayElements(
      users.filter((u) => u.id !== projectOwner.id),
      collaboratorCount,
    );

    for (const collaborator of selectedCollaborators) {
      await prisma.projectCollaborator.create({
        data: {
          projectId: project.id,
          userId: collaborator.id,
          role: faker.helpers.arrayElement([
            ProjectCollaboratorRole.VIEWER,
            ProjectCollaboratorRole.EDITOR,
          ]),
        },
      });
    }

    // Create tasks for the project
    const taskCount = faker.number.int({
      min: TASKS_PER_PROJECT_MIN,
      max: TASKS_PER_PROJECT_MAX,
    });

    for (let j = 0; j < taskCount; j++) {
      const assigneeId = faker.helpers.maybe(
        () => faker.helpers.arrayElement(users).id,
        { probability: 0.7 },
      );

      const task = await prisma.task.create({
        data: {
          title: faker.hacker.verb() + ' ' + faker.hacker.noun(),
          description: faker.lorem.sentences({ min: 1, max: 3 }),
          status: faker.helpers.arrayElement([
            TaskStatus.TODO,
            TaskStatus.IN_PROGRESS,
            TaskStatus.DONE,
          ]),
          priority: faker.helpers.arrayElement([
            TaskPriority.LOW,
            TaskPriority.MEDIUM,
            TaskPriority.HIGH,
          ]),
          dueDate: faker.helpers.maybe(() => faker.date.soon({ days: 30 }), {
            probability: 0.8,
          }),
          projectId: project.id,
          assigneeId,
        },
      });

      // Create comments for the task
      const commentCount = faker.number.int({ min: 0, max: COMMENTS_PER_TASK_MAX });
      for (let k = 0; k < commentCount; k++) {
        await prisma.comment.create({
          data: {
            content: faker.lorem.paragraph(),
            authorId: faker.helpers.arrayElement(users).id,
            taskId: task.id,
          },
        });
      }
    }
  }

  console.log('Faker seed successfully completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
