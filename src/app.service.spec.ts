import { Test, TestingModule } from '@nestjs/testing'
import { AppService } from './app.service'

describe('AppService', () => {
  let service: AppService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile()

    service = module.get<AppService>(AppService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getHealthCheck', () => {
    it('should return health check message with timestamp', () => {
      const result = service.getHealthCheck()

      expect(result).toBeDefined()
      expect(result).toHaveProperty('message')
      expect(result).toHaveProperty('timestamp')
      expect(result.message).toBe('API is running!')
      expect(typeof result.timestamp).toBe('string')
    })

    it('should return timestamp in Brazilian format', () => {
      const result = service.getHealthCheck()

      // Timestamp should be in format DD/MM/YYYY, HH:MM:SS
      expect(result.timestamp).toMatch(/\d{2}\/\d{2}\/\d{4},\s\d{2}:\d{2}:\d{2}/)
    })

    it('should return current timestamp', () => {
      const beforeCall = new Date()
      const result = service.getHealthCheck()
      const afterCall = new Date()

      // Parse the timestamp
      const [datePart, timePart] = result.timestamp.split(', ')
      const [day, month, year] = datePart.split('/').map(Number)
      const [hours, minutes, seconds] = timePart.split(':').map(Number)
      const resultDate = new Date(year, month - 1, day, hours, minutes, seconds)

      // The timestamp should be between beforeCall and afterCall
      expect(resultDate.getTime()).toBeGreaterThanOrEqual(beforeCall.getTime() - 2000)
      expect(resultDate.getTime()).toBeLessThanOrEqual(afterCall.getTime() + 2000)
    })
  })
})
