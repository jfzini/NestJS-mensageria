import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHealthCheck(): { message: string; timestamp: string } {
    return {
      message: 'API is running!',
      timestamp: new Date().toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
      }),
    }
  }
}
