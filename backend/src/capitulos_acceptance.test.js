import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'

vi.mock('./middlewares/JWT.js', () => ({
  verificarTokenJWT: vi.fn((req, res, next) => {
    req.usuarioHeader = { _id: 'u1', rol: 'Usuario' }
    next()
  })
}))

vi.mock('./models/Obras.js', () => ({
  default: {
    findById: vi.fn()
  }
}))

vi.mock('./models/Capitulos.js', () => {
  const mockFindOne = vi.fn()
  const mockFindById = vi.fn()
  const mockFind = vi.fn()

  const Capitulo = vi.fn(function (data) {
    Object.assign(this, data)
    this.save = vi.fn().mockResolvedValue(this)
    return this
  })

  Capitulo.findOne = mockFindOne
  Capitulo.findById = mockFindById
  Capitulo.find = mockFind

  return { default: Capitulo }
})

import app from './server.js'
import Obra from './models/Obras.js'
import Capitulo from './models/Capitulos.js'

const mockRequest = request(app)

describe('Pruebas de aceptación - capítulos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('POST /api/capitulos/:id retorna 201 cuando se crea correctamente', async () => {
    Obra.findById.mockResolvedValueOnce({
      _id: 'o1',
      activo: true,
      autor: { toString: () => 'u1' },
      estado: 'Borrador'
    })
    Capitulo.findOne.mockResolvedValueOnce(null)

    const response = await mockRequest
      .post('/api/capitulos/o1')
      .set('authorization', 'Bearer token')
      .send({
        titulo: 'Capítulo 1',
        contenido: 'Texto del capítulo',
        numeroCapitulo: 1
      })

    expect(response.status).toBe(201)
    expect(response.body.ok).toBe(true)
    expect(response.body.msg).toBe('Capítulo creado correctamente')
    expect(response.body.capitulo.titulo).toBe('Capítulo 1')
  })

  it('GET /api/capitulos/obra/:id retorna 200 con la lista de capítulos', async () => {
    Capitulo.find.mockReturnValueOnce({
      sort: vi.fn().mockResolvedValue([{ _id: 'c1', numeroCapitulo: 1, titulo: 'Capítulo 1' }])
    })

    const response = await mockRequest
      .get('/api/capitulos/obra/o1')
      .set('authorization', 'Bearer token')

    expect(response.status).toBe(200)
    expect(response.body.ok).toBe(true)
    expect(response.body.capitulos).toEqual([{ _id: 'c1', numeroCapitulo: 1, titulo: 'Capítulo 1' }])
  })

  it('GET /api/capitulos/detalle/:capituloId retorna 404 si el capítulo está eliminado', async () => {
    Capitulo.findById.mockReturnValueOnce({
      populate: vi.fn().mockResolvedValueOnce({ _id: 'c1', activo: false })
    })

    const response = await mockRequest
      .get('/api/capitulos/detalle/c1')
      .set('authorization', 'Bearer token')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({ msg: 'Capítulo eliminado' })
  })

  it('PUT /api/capitulos/:capituloId retorna 200 cuando se edita correctamente', async () => {
    const capituloBDD = {
      _id: 'c1',
      titulo: 'Viejo',
      contenido: 'Viejo',
      numeroCapitulo: 1,
      obra: {
        autor: { toString: () => 'u1' },
        estado: 'Borrador'
      },
      save: vi.fn().mockResolvedValue(true)
    }

    Capitulo.findById.mockReturnValueOnce({
      populate: vi.fn().mockResolvedValueOnce(capituloBDD)
    })
    Capitulo.findOne.mockResolvedValueOnce(null)

    const response = await mockRequest
      .put('/api/capitulos/c1')
      .set('authorization', 'Bearer token')
      .send({
        titulo: 'Nuevo',
        contenido: 'Contenido nuevo',
        numeroCapitulo: 2
      })

    expect(response.status).toBe(200)
    expect(response.body.ok).toBe(true)
    expect(response.body.msg).toBe('Capítulo actualizado')
    expect(capituloBDD.titulo).toBe('Nuevo')
  })

  it('DELETE /api/capitulos/:capituloId retorna 200 cuando se elimina correctamente', async () => {
    const capituloBDD = {
      _id: 'c1',
      activo: true,
      obra: {
        autor: { toString: () => 'u1' },
        estado: 'Borrador'
      },
      save: vi.fn().mockResolvedValue(true)
    }

    Capitulo.findById.mockReturnValueOnce({
      populate: vi.fn().mockResolvedValueOnce(capituloBDD)
    })

    const response = await mockRequest
      .delete('/api/capitulos/c1')
      .set('authorization', 'Bearer token')

    expect(response.status).toBe(200)
    expect(response.body.ok).toBe(true)
    expect(response.body.msg).toBe('Capítulo eliminado correctamente')
    expect(capituloBDD.activo).toBe(false)
  })
})
