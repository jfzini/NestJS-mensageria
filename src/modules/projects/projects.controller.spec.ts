import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from 'src/prisma.service'
import { ProjectsController } from './projects.controller'
import { ProjectsService } from './projects.service'

describe('ProjectsController', () => {
  let controller: ProjectsController
  let service: ProjectsService

  const mockProjectsService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  }

  const mockPrismaService = {
    project: { findUnique: jest.fn() },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: mockProjectsService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile()

    controller = module.get<ProjectsController>(ProjectsController)
    service = module.get<ProjectsService>(ProjectsService)

    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
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
        },
      ]

      mockProjectsService.findAll.mockResolvedValue(mockProjects)

      const result = await controller.findAll()

      expect(result).toEqual(mockProjects)
      expect(service.findAll).toHaveBeenCalledTimes(1)
    })
  })

  describe('findById', () => {
    it('should return a project by id', async () => {
      const mockProject = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Project 1',
        description: 'Description 1',
        createdAt: new Date(),
        updatedAt: new Date(),
        tasks: [],
      }

      mockProjectsService.findById.mockResolvedValue(mockProject)

      const result = await controller.findById('123e4567-e89b-12d3-a456-426614174000')

      expect(result).toEqual(mockProject)
      expect(service.findById).toHaveBeenCalledTimes(1)
      expect(service.findById).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000')
    })

    it('should call service with the correct UUID', async () => {
      const testId = '223e4567-e89b-12d3-a456-426614174001'
      mockProjectsService.findById.mockResolvedValue(null)

      await controller.findById(testId)

      expect(service.findById).toHaveBeenCalledWith(testId)
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
      }

      mockProjectsService.create.mockResolvedValue(mockCreatedProject)

      const result = await controller.create(createDto)

      expect(result).toEqual(mockCreatedProject)
      expect(service.create).toHaveBeenCalledTimes(1)
      expect(service.create).toHaveBeenCalledWith(createDto)
    })

    it('should pass the DTO to the service', async () => {
      const createDto = {
        name: 'Test Project',
      }

      mockProjectsService.create.mockResolvedValue({})

      await controller.create(createDto)

      expect(service.create).toHaveBeenCalledWith(createDto)
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
      }

      mockProjectsService.update.mockResolvedValue(mockUpdatedProject)

      const result = await controller.update('123e4567-e89b-12d3-a456-426614174000', updateDto)

      expect(result).toEqual(mockUpdatedProject)
      expect(service.update).toHaveBeenCalledTimes(1)
      expect(service.update).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000', updateDto)
    })

    it('should call service with correct id and data', async () => {
      const testId = '123e4567-e89b-12d3-a456-426614174000'
      const updateDto = { name: 'Updated Name' }

      mockProjectsService.update.mockResolvedValue({})

      await controller.update(testId, updateDto)

      expect(service.update).toHaveBeenCalledWith(testId, updateDto)
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
      }

      mockProjectsService.remove.mockResolvedValue(mockDeletedProject)

      const result = await controller.remove('123e4567-e89b-12d3-a456-426614174000')

      expect(result).toEqual(mockDeletedProject)
      expect(service.remove).toHaveBeenCalledTimes(1)
      expect(service.remove).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000')
    })

    it('should call service with correct id', async () => {
      const testId = 'test-uuid-456'
      mockProjectsService.remove.mockResolvedValue({})

      await controller.remove(testId)

      expect(service.remove).toHaveBeenCalledWith(testId)
    })
  })
})
