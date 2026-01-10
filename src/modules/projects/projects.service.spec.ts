import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from 'src/prisma.service'
import { ProjectsService } from './projects.service'

describe('ProjectsService', () => {
  let service: ProjectsService
  let prisma: PrismaService

  const mockPrismaService = {
    project: {
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
        ProjectsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile()

    service = module.get<ProjectsService>(ProjectsService)
    prisma = module.get<PrismaService>(PrismaService)

    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    it('should return an array of projects', async () => {
      const mockProjects = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Project 1',
          description: 'Description 1',
          createdAt: new Date(),
          updatedAt: new Date(),
          createdById: '12cdba13-c2c0-4349-9b90-afe7ddbce580',
        },
        {
          id: '223e4567-e89b-12d3-a456-426614174001',
          name: 'Project 2',
          description: 'Description 2',
          createdAt: new Date(),
          updatedAt: new Date(),
          createdById: '12cdba13-c2c0-4349-9b90-afe7ddbce580',
        },
      ]

      mockPrismaService.project.findMany.mockResolvedValue(mockProjects)

      const result = await service.findAll()

      expect(result).toEqual(mockProjects)
      expect(prisma.project.findMany).toHaveBeenCalledTimes(1)
      expect(prisma.project.findMany).toHaveBeenCalledWith()
    })

    it('should return an empty array when no projects exist', async () => {
      mockPrismaService.project.findMany.mockResolvedValue([])

      const result = await service.findAll()

      expect(result).toEqual([])
      expect(prisma.project.findMany).toHaveBeenCalledTimes(1)
    })
  })

  describe('findById', () => {
    it('should return a project with tasks when found', async () => {
      const mockProject = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Project 1',
        description: 'Description 1',
        createdAt: new Date(),
        updatedAt: new Date(),
        tasks: [
          {
            id: 'task-123',
            title: 'Task 1',
            description: 'Task description',
            status: 'TODO',
            priority: 'MEDIUM',
            dueDate: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
            assigneeId: null,
          },
        ],
      }

      mockPrismaService.project.findUnique.mockResolvedValue(mockProject)

      const result = await service.findById('123e4567-e89b-12d3-a456-426614174000')

      expect(result).toEqual(mockProject)
      expect(prisma.project.findUnique).toHaveBeenCalledTimes(1)
      expect(prisma.project.findUnique).toHaveBeenCalledWith({
        where: { id: '123e4567-e89b-12d3-a456-426614174000' },
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          tasks: {
            omit: {
              projectId: true,
            },
          },
        },
      })
    })

    it('should return null when project is not found', async () => {
      mockPrismaService.project.findUnique.mockResolvedValue(null)

      const result = await service.findById('non-existent-id')

      expect(result).toBeNull()
      expect(prisma.project.findUnique).toHaveBeenCalledTimes(1)
    })
  })

  describe('create', () => {
    it('should create a new project', async () => {
      const createDto = {
        name: 'New Project',
        description: 'New Description',
      }

      const mockCreatedProject = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdById: '12cdba13-c2c0-4349-9b90-afe7ddbce580',
      }

      mockPrismaService.project.create.mockResolvedValue(mockCreatedProject)

      const result = await service.create(createDto)

      expect(result).toEqual(mockCreatedProject)
      expect(prisma.project.create).toHaveBeenCalledTimes(1)
      expect(prisma.project.create).toHaveBeenCalledWith({
        data: {
          ...createDto,
          createdById: '12cdba13-c2c0-4349-9b90-afe7ddbce580',
        },
      })
    })

    it('should create a project with hardcoded createdById', async () => {
      const createDto = {
        name: 'Test Project',
      }

      const mockCreatedProject = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Project',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdById: '12cdba13-c2c0-4349-9b90-afe7ddbce580',
      }

      mockPrismaService.project.create.mockResolvedValue(mockCreatedProject)

      const result = await service.create(createDto)

      expect(result.createdById).toBe('12cdba13-c2c0-4349-9b90-afe7ddbce580')
      expect(prisma.project.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          createdById: '12cdba13-c2c0-4349-9b90-afe7ddbce580',
        }),
      })
    })
  })

  describe('update', () => {
    it('should update a project', async () => {
      const updateDto = {
        name: 'Updated Project',
        description: 'Updated Description',
      }

      const mockUpdatedProject = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        ...updateDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdById: '12cdba13-c2c0-4349-9b90-afe7ddbce580',
      }

      mockPrismaService.project.update.mockResolvedValue(mockUpdatedProject)

      const result = await service.update('123e4567-e89b-12d3-a456-426614174000', updateDto)

      expect(result).toEqual(mockUpdatedProject)
      expect(prisma.project.update).toHaveBeenCalledTimes(1)
      expect(prisma.project.update).toHaveBeenCalledWith({
        where: { id: '123e4567-e89b-12d3-a456-426614174000' },
        data: updateDto,
      })
    })

    it('should update only provided fields', async () => {
      const updateDto = {
        name: 'Updated Name Only',
      }

      const mockUpdatedProject = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Updated Name Only',
        description: 'Original Description',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdById: '12cdba13-c2c0-4349-9b90-afe7ddbce580',
      }

      mockPrismaService.project.update.mockResolvedValue(mockUpdatedProject)

      const result = await service.update('123e4567-e89b-12d3-a456-426614174000', updateDto)

      expect(result.name).toBe('Updated Name Only')
      expect(prisma.project.update).toHaveBeenCalledWith({
        where: { id: '123e4567-e89b-12d3-a456-426614174000' },
        data: updateDto,
      })
    })
  })

  describe('remove', () => {
    it('should delete a project', async () => {
      const mockDeletedProject = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Deleted Project',
        description: 'Deleted Description',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdById: '12cdba13-c2c0-4349-9b90-afe7ddbce580',
      }

      mockPrismaService.project.delete.mockResolvedValue(mockDeletedProject)

      const result = await service.remove('123e4567-e89b-12d3-a456-426614174000')

      expect(result).toEqual(mockDeletedProject)
      expect(prisma.project.delete).toHaveBeenCalledTimes(1)
      expect(prisma.project.delete).toHaveBeenCalledWith({
        where: { id: '123e4567-e89b-12d3-a456-426614174000' },
      })
    })

    it('should call prisma.project.delete with correct id', async () => {
      const testId = 'test-uuid-123'
      mockPrismaService.project.delete.mockResolvedValue({})

      await service.remove(testId)

      expect(prisma.project.delete).toHaveBeenCalledWith({
        where: { id: testId },
      })
    })
  })
})
