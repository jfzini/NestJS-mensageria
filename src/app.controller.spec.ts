import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from './app.controller'
import { AppService } from './app.service'

describe('AppController', () => {
  let appController: AppController
  let appService: AppService

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile()

    appController = app.get<AppController>(AppController)
    appService = app.get<AppService>(AppService)
  })

  it('should be defined', () => {
    expect(appController).toBeDefined()
  })

  describe('getHealthCheck', () => {
    it('should return health check response with message and timestamp', () => {
      const mockResponse = {
        message: 'API is running!',
        timestamp: '27/12/2025, 22:52:14',
      }

      jest.spyOn(appService, 'getHealthCheck').mockReturnValue(mockResponse)

      const result = appController.getHealthCheck()

      expect(result).toEqual(mockResponse)
      expect(result).toHaveProperty('message')
      expect(result).toHaveProperty('timestamp')
      expect(appService.getHealthCheck).toHaveBeenCalled()
    })

    it('should call appService.getHealthCheck()', () => {
      const spy = jest.spyOn(appService, 'getHealthCheck')

      appController.getHealthCheck()

      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('should return the exact response from service', () => {
      const mockResponse = {
        message: 'API is running!',
        timestamp: '01/01/2025, 00:00:00',
      }

      jest.spyOn(appService, 'getHealthCheck').mockReturnValue(mockResponse)

      expect(appController.getHealthCheck()).toBe(mockResponse)
    })
  })
})
