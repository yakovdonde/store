import request from 'supertest'
import app from '@/index'

describe('Health endpoint', () => {
  it('returns ok status', async () => {
    const response = await request(app).get('/api/health')
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('status', 'ok')
    expect(response.body).toHaveProperty('timestamp')
  })
})
