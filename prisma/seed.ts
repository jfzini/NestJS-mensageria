import { PrismaClient, TaskPriority, TaskStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const PROJECT_COUNT = 5;
const TASKS_PER_PROJECT_MIN = 3;
const TASKS_PER_PROJECT_MAX = 8;

async function main() {
  const environment = process.env.NODE_ENV;

  // DO NOT RUN IN PRODUCTION. LIKE EVER.
  if (environment !== 'development') {
    throw new Error('Seed can only be run in development environment');
  }

  await prisma.task.deleteMany();
  await prisma.project.deleteMany();

  for (let i = 0; i < PROJECT_COUNT; i++) {
    const project = await prisma.project.create({
      data: {
        name: faker.company.name(),
        description: faker.company.catchPhrase(),
      },
    });

    const taskCount = faker.number.int({
      min: TASKS_PER_PROJECT_MIN,
      max: TASKS_PER_PROJECT_MAX,
    });

    const tasksData = Array.from({ length: taskCount }).map(() => ({
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
      dueDate: faker.date.soon({ days: 30 }),
      projectId: project.id,
    }));

    await prisma.task.createMany({
      data: tasksData,
    });
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
