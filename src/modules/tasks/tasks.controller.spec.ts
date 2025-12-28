import { Test, TestingModule } from '@nestjs/testing'
import { TaskPriority, TaskStatus } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { TasksController } from './tasks.controller'
import { TasksService } from './tasks.service'

describe('TasksController', () => {
  let controller: TasksController
  let service: TasksService

  const mockTasksService = {
    findAllByProjectId: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  }

  const mockPrismaService = {
    project: { findUnique: jest.fn() },
    task: { findUnique: jest.fn() },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile()

    controller = module.get<TasksController>(TasksController)
    service = module.get<TasksService>(TasksService)

    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
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
          dueDate: '2025-12-31T00:00:00.000Z',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      mockTasksService.findAllByProjectId.mockResolvedValue(mockTasks)

      const result = await controller.findAllByProjectId(projectId)

      expect(result).toEqual(mockTasks)
      expect(service.findAllByProjectId).toHaveBeenCalledTimes(1)
      expect(service.findAllByProjectId).toHaveBeenCalledWith(projectId)
    })

    it('should call service with correct projectId', async () => {
      const projectId = 'test-project-id'
      mockTasksService.findAllByProjectId.mockResolvedValue([])

      await controller.findAllByProjectId(projectId)

      expect(service.findAllByProjectId).toHaveBeenCalledWith(projectId)
    })
  })

  describe('findById', () => {
    it('should return a task by id', async () => {
      const taskId = 'task-123'
      const projectId = 'project-123'
      const mockTask = {
        id: taskId,
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: '2025-12-31T00:00:00.000Z',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockTasksService.findById.mockResolvedValue(mockTask)

      const result = await controller.findById(taskId, projectId)

      expect(result).toEqual(mockTask)
      expect(service.findById).toHaveBeenCalledTimes(1)
      expect(service.findById).toHaveBeenCalledWith(taskId, projectId)
    })

    it('should call service with correct taskId and projectId', async () => {
      const taskId = 'test-task-id'
      const projectId = 'test-project-id'
      mockTasksService.findById.mockResolvedValue(null)

      await controller.findById(taskId, projectId)

      expect(service.findById).toHaveBeenCalledWith(taskId, projectId)
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
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockTasksService.create.mockResolvedValue(mockCreatedTask)

      const result = await controller.create(projectId, createDto)

      expect(result).toEqual(mockCreatedTask)
      expect(service.create).toHaveBeenCalledTimes(1)
      expect(service.create).toHaveBeenCalledWith(projectId, createDto)
    })

    it('should pass projectId and DTO to the service', async () => {
      const projectId = 'test-project-id'
      const createDto = {
        title: 'Test Task',
      }

      mockTasksService.create.mockResolvedValue({})

      await controller.create(projectId, createDto)

      expect(service.create).toHaveBeenCalledWith(projectId, createDto)
    })
  })

  describe('update', () => {
    it('should update a task', async () => {
      const taskId = 'task-123'
      const projectId = 'project-123'
      const updateDto = {
        title: 'Updated Task',
        status: TaskStatus.DONE,
      }

      const mockUpdatedTask = {
        id: taskId,
        ...updateDto,
        description: 'Description',
        priority: TaskPriority.MEDIUM,
        dueDate: '2025-12-31T00:00:00.000Z',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockTasksService.update.mockResolvedValue(mockUpdatedTask)

      const result = await controller.update(taskId, projectId, updateDto)

      expect(result).toEqual(mockUpdatedTask)
      expect(service.update).toHaveBeenCalledTimes(1)
      expect(service.update).toHaveBeenCalledWith(taskId, projectId, updateDto)
    })

    it('should call service with correct parameters', async () => {
      const taskId = 'test-task-id'
      const projectId = 'test-project-id'
      const updateDto = { title: 'Test Task', status: TaskStatus.IN_PROGRESS }

      mockTasksService.update.mockResolvedValue({})

      await controller.update(taskId, projectId, updateDto)

      expect(service.update).toHaveBeenCalledWith(taskId, projectId, updateDto)
    })
  })

  describe('delete', () => {
    it('should delete a task', async () => {
      const taskId = 'task-123'
      const projectId = 'project-123'
      const mockDeletedTask = {
        id: taskId,
        title: 'Deleted Task',
        description: 'Deleted Description',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: '2025-12-31T00:00:00.000Z',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockTasksService.remove.mockResolvedValue(mockDeletedTask)

      const result = await controller.delete(taskId, projectId)

      expect(result).toEqual(mockDeletedTask)
      expect(service.remove).toHaveBeenCalledTimes(1)
      expect(service.remove).toHaveBeenCalledWith(taskId, projectId)
    })

    it('should call service with correct taskId and projectId', async () => {
      const taskId = 'test-task-id'
      const projectId = 'test-project-id'
      mockTasksService.remove.mockResolvedValue({})

      await controller.delete(taskId, projectId)

      expect(service.remove).toHaveBeenCalledWith(taskId, projectId)
    })
  })
})
