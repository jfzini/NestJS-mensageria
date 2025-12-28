import { Test, TestingModule } from '@nestjs/testing'
import { TaskPriority, TaskStatus } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { TasksService } from './tasks.service'

describe('TasksService', () => {
  let service: TasksService
  let prisma: PrismaService

  const mockPrismaService = {
    task: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile()

    service = module.get<TasksService>(TasksService)
    prisma = module.get<PrismaService>(PrismaService)

    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAllByProjectId', () => {
    it('should return all tasks for a project', async () => {
      const projectId = '123e4567-e89b-12d3-a456-426614174000'
      const mockTasks = [
        {
          id: 'task-1',
          title: 'Task 1',
          description: 'Description 1',
          status: TaskStatus.TODO,
          priority: TaskPriority.MEDIUM,
          dueDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          projectId,
          assigneeId: null,
        },
        {
          id: 'task-2',
          title: 'Task 2',
          description: 'Description 2',
          status: TaskStatus.IN_PROGRESS,
          priority: TaskPriority.HIGH,
          dueDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          projectId,
          assigneeId: null,
        },
      ]

      mockPrismaService.task.findMany.mockResolvedValue(mockTasks)

      const result = await service.findAllByProjectId(projectId)

      expect(result).toEqual(mockTasks)
      expect(prisma.task.findMany).toHaveBeenCalledTimes(1)
      expect(prisma.task.findMany).toHaveBeenCalledWith({ where: { projectId } })
    })

    it('should return empty array when project has no tasks', async () => {
      const projectId = '123e4567-e89b-12d3-a456-426614174000'
      mockPrismaService.task.findMany.mockResolvedValue([])

      const result = await service.findAllByProjectId(projectId)

      expect(result).toEqual([])
      expect(prisma.task.findMany).toHaveBeenCalledWith({ where: { projectId } })
    })
  })

  describe('findById', () => {
    it('should return a task by id and projectId', async () => {
      const taskId = 'task-123'
      const projectId = 'project-123'
      const mockTask = {
        id: taskId,
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        projectId,
        assigneeId: null,
      }

      mockPrismaService.task.findUnique.mockResolvedValue(mockTask)

      const result = await service.findById(taskId, projectId)

      expect(result).toEqual(mockTask)
      expect(prisma.task.findUnique).toHaveBeenCalledTimes(1)
      expect(prisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: taskId, projectId },
      })
    })

    it('should return null when task is not found', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(null)

      const result = await service.findById('non-existent-id', 'project-id')

      expect(result).toBeNull()
      expect(prisma.task.findUnique).toHaveBeenCalledTimes(1)
    })
  })

  describe('create', () => {
    it('should create a new task', async () => {
      const projectId = 'project-123'
      const createDto = {
        title: 'New Task',
        description: 'New Description',
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        dueDate: '2025-12-31T00:00:00.000Z',
      }

      const mockCreatedTask = {
        id: 'task-123',
        ...createDto,
        dueDate: new Date(createDto.dueDate),
        createdAt: new Date(),
        updatedAt: new Date(),
        projectId,
        assigneeId: null,
      }

      mockPrismaService.task.create.mockResolvedValue(mockCreatedTask)

      const result = await service.create(projectId, createDto)

      expect(result).toEqual(mockCreatedTask)
      expect(prisma.task.create).toHaveBeenCalledTimes(1)
      expect(prisma.task.create).toHaveBeenCalledWith({
        data: { ...createDto, projectId },
      })
    })

    it('should create task with default status and priority', async () => {
      const projectId = 'project-123'
      const createDto = {
        title: 'Task with Defaults',
      }

      const mockCreatedTask = {
        id: 'task-123',
        title: 'Task with Defaults',
        description: null,
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        projectId,
        assigneeId: null,
      }

      mockPrismaService.task.create.mockResolvedValue(mockCreatedTask)

      const result = await service.create(projectId, createDto)

      expect(result.status).toBe(TaskStatus.TODO)
      expect(result.priority).toBe(TaskPriority.MEDIUM)
    })
  })

  describe('update', () => {
    it('should update a task', async () => {
      const taskId = 'task-123'
      const projectId = 'project-123'
      const updateDto = {
        title: 'Updated Task',
        description: 'Updated Description',
        status: TaskStatus.DONE,
      }

      const mockUpdatedTask = {
        id: taskId,
        ...updateDto,
        priority: TaskPriority.MEDIUM,
        dueDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        projectId,
        assigneeId: null,
      }

      mockPrismaService.task.update.mockResolvedValue(mockUpdatedTask)

      const result = await service.update(taskId, projectId, updateDto)

      expect(result).toEqual(mockUpdatedTask)
      expect(prisma.task.update).toHaveBeenCalledTimes(1)
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: taskId, projectId },
        data: { ...updateDto, projectId },
      })
    })

    it('should update only specified fields', async () => {
      const taskId = 'task-123'
      const projectId = 'project-123'
      const updateDto = {
        title: 'Original Title',
        status: TaskStatus.IN_PROGRESS,
      }

      const mockUpdatedTask = {
        id: taskId,
        title: 'Original Title',
        description: 'Original Description',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.MEDIUM,
        dueDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        projectId,
        assigneeId: null,
      }

      mockPrismaService.task.update.mockResolvedValue(mockUpdatedTask)

      const result = await service.update(taskId, projectId, updateDto)

      expect(result.status).toBe(TaskStatus.IN_PROGRESS)
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: taskId, projectId },
        data: { ...updateDto, projectId },
      })
    })
  })

  describe('remove', () => {
    it('should delete a task', async () => {
      const taskId = 'task-123'
      const projectId = 'project-123'
      const mockDeletedTask = {
        id: taskId,
        title: 'Deleted Task',
        description: 'Deleted Description',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        projectId,
        assigneeId: null,
      }

      mockPrismaService.task.delete.mockResolvedValue(mockDeletedTask)

      const result = await service.remove(taskId, projectId)

      expect(result).toEqual(mockDeletedTask)
      expect(prisma.task.delete).toHaveBeenCalledTimes(1)
      expect(prisma.task.delete).toHaveBeenCalledWith({
        where: { id: taskId, projectId },
      })
    })

    it('should call prisma.task.delete with correct ids', async () => {
      const taskId = 'test-task-id'
      const projectId = 'test-project-id'
      mockPrismaService.task.delete.mockResolvedValue({})

      await service.remove(taskId, projectId)

      expect(prisma.task.delete).toHaveBeenCalledWith({
        where: { id: taskId, projectId },
      })
    })
  })
})
