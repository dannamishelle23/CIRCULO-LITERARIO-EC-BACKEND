import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'

vi.mock('./middlewares/JWT.js', () => ({
  verificarTokenJWT: vi.fn((req, res, next) => {
    req.usuarioHeader = { _id: 'u1' }
    next()
  })
}))

vi.mock('./models/Comentario.js', () => {
  const mockFind = vi.fn()
  const mockFindById = vi.fn()
  const mockFindByIdAndDelete = vi.fn()

  const Comentario = vi.fn(function (data) {
    this.save = vi.fn().mockResolvedValue(this)
    this.populate = vi.fn().mockResolvedValue({ ...this, usuario: { nombres: 'Test' }, texto: data.texto })
  })

  Comentario.find = mockFind
  Comentario.findById = mockFindById
  Comentario.findByIdAndDelete = mockFindByIdAndDelete

  return { Comentario }
})

vi.mock('./models/Obras.js', () => ({
  default: {
    findById: vi.fn()
  }
}))

import app from './server.js'
import Obra from './models/Obras.js'
import { Comentario } from './models/Comentario.js'

const mockRequest = request(app)

describe('Rutas de comentarios - aceptación básica', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('GET /api/comentarios/obra/:obraId retorna 200 con lista de comentarios', async () => {
    Comentario.find.mockReturnValueOnce({
      populate: vi.fn().mockReturnValueOnce({ sort: vi.fn().mockResolvedValue([{ texto: 'hola' }]) })
    })

    const response = await mockRequest.get('/api/comentarios/obra/1').set('authorization', 'Bearer token')

    expect(response.status).toBe(200)
    expect(response.body).toEqual([{ texto: 'hola' }])
  })

  it('POST /api/comentarios/obra/:obraId crea un comentario cuando la obra está publicada', async () => {
    Obra.findById.mockResolvedValueOnce({
      estado: 'Publicada',
      fechaPublicacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      createdAt: new Date()
    })

    const response = await mockRequest
      .post('/api/comentarios/obra/1')
      .set('authorization', 'Bearer token')
      .send({ texto: 'test' })

    expect(response.status).toBe(201)
    expect(response.body).toEqual(expect.objectContaining({ msg: 'Comentario publicado.' }))
  })
})
