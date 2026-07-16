import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'

vi.mock('./middlewares/JWT.js', () => ({
  verificarTokenJWT: vi.fn((req, res, next) => {
    const rol = req.headers['x-user-role'] || 'Usuario'
    req.usuarioHeader = { _id: 'u1', rol }
    next()
  }),
  crearTokenJWT: vi.fn().mockReturnValue('jwt-token-123')
}))

vi.mock('./models/Clubes.js', () => {
  const mockFindOne = vi.fn()
  const mockFind = vi.fn()
  const mockFindById = vi.fn()

  const Club = vi.fn(function (data) {
    Object.assign(this, data)
    this.save = vi.fn().mockResolvedValue(this)
    return this
  })

  Club.findOne = mockFindOne
  Club.find = mockFind
  Club.findById = mockFindById

  return { default: Club }
})

vi.mock('./helpers/uploadCloudinary.js', () => ({
  subirImagenCloudinary: vi.fn().mockResolvedValue({ secure_url: 'https://cloud.test/file.jpg', public_id: 'cloud-id' }),
  eliminarImagenCloudinary: vi.fn().mockResolvedValue(true)
}))

vi.mock('./models/Usuarios.js', () => ({
  default: {
    findOne: vi.fn()
  }
}))

import app from './server.js'
import Club from './models/Clubes.js'
import Usuarios from './models/Usuarios.js'
import { verificarTokenJWT } from './middlewares/JWT.js'

const mockRequest = request(app)

describe('Pruebas de aceptación - clubes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Club.mockImplementation(function (data) {
      Object.assign(this, data)
      this.save = vi.fn().mockResolvedValue(this)
      return this
    })
    Club.findOne.mockReset()
    Club.find.mockReset()
    Club.findById.mockReset()
    Usuarios.findOne.mockReset()
    verificarTokenJWT.mockImplementation((req, res, next) => {
      const rol = req.headers['x-user-role'] || 'Usuario'
      req.usuarioHeader = { _id: 'u1', rol }
      next()
    })
  })

  it('POST /api/clubes/crear-club retorna 403 para un usuario no administrador', async () => {
    Club.findOne.mockResolvedValueOnce(null)

    const response = await mockRequest
      .post('/api/clubes/crear-club')
      .set('authorization', 'Bearer token')
      .send({
        nombre: 'Club A',
        descripcion: 'Descripción',
        generoLiterario: 'Fantasía'
      })

    expect(response.status).toBe(403)
    expect(response.body).toEqual({ msg: 'No tienes permisos para esta acción', rolUsuario: 'Usuario' })
  })

  it('POST /api/clubes/crear-club retorna 201 cuando el administrador crea correctamente', async () => {
    Club.findOne.mockResolvedValueOnce(null)

    const response = await mockRequest
      .post('/api/clubes/crear-club')
      .set('authorization', 'Bearer token')
      .set('x-user-role', 'Administrador')
      .send({
        nombre: 'Club A',
        descripcion: 'Descripción',
        generoLiterario: 'Fantasía'
      })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({ msg: 'Club literario creado con éxito.' })
  })

  it('GET /api/clubes/listar-clubes retorna 200 con la lista de clubes', async () => {
    Club.find.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      populate: vi.fn().mockResolvedValue([{ _id: 'c1', nombre: 'Club A' }])
    })

    const response = await mockRequest
      .get('/api/clubes/listar-clubes')
      .set('authorization', 'Bearer token')

    expect(response.status).toBe(200)
    expect(response.body.ok).toBe(true)
    expect(response.body.clubes).toEqual([{ _id: 'c1', nombre: 'Club A' }])
  })

  it('GET /api/clubes/listar-clubes retorna 404 cuando no hay clubes registrados', async () => {
    Club.find.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      populate: vi.fn().mockResolvedValue([])
    })

    const response = await mockRequest
      .get('/api/clubes/listar-clubes')
      .set('authorization', 'Bearer token')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({ msg: 'No existen clubes registrados.' })
  })

  it('POST /api/clubes/crear-club retorna 400 si ya existe un club del mismo género', async () => {
    Club.findOne.mockResolvedValueOnce({ _id: 'c1' })

    const response = await mockRequest
      .post('/api/clubes/crear-club')
      .set('authorization', 'Bearer token')
      .set('x-user-role', 'Administrador')
      .send({
        nombre: 'Club B',
        descripcion: 'Otra descripción',
        generoLiterario: 'Fantasía'
      })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({ msg: 'Ya existe un club del género Fantasía.' })
  })

  it('GET /api/clubes/detalle-club/:clubId retorna 404 si el club no existe', async () => {
    Club.findById.mockReturnValueOnce({
      select: vi.fn().mockReturnValueOnce({
        populate: vi.fn().mockResolvedValueOnce(null)
      })
    })

    const response = await mockRequest
      .get('/api/clubes/detalle-club/64a1184eb2f57700123abcde')
      .set('authorization', 'Bearer token')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({ msg: 'Club no encontrado.' })
  })

  it('GET /api/clubes/mis-clubes retorna 404 cuando el moderador no tiene clubes asignados', async () => {
    Club.find.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      populate: vi.fn().mockResolvedValue([])
    })

    const response = await mockRequest
      .get('/api/clubes/mis-clubes')
      .set('authorization', 'Bearer token')

    expect(response.status).toBe(403)
    expect(response.body).toEqual({ msg: 'No tienes permisos para esta acción', rolUsuario: 'Usuario' })
  })

  it('PATCH /api/clubes/actualizar-club/:clubId retorna 403 para un usuario no administrador', async () => {
    const clubBDD = {
      _id: 'c1',
      nombre: 'Club Viejo',
      descripcion: 'Desc vieja',
      save: vi.fn().mockResolvedValue(true)
    }

    Club.findById.mockResolvedValueOnce(clubBDD)

    const response = await mockRequest
      .patch('/api/clubes/actualizar-club/64a1184eb2f57700123abcde')
      .set('authorization', 'Bearer token')
      .send({ nombre: 'Club Nuevo' })

    expect(response.status).toBe(403)
    expect(response.body).toEqual({ msg: 'No tienes permisos para esta acción', rolUsuario: 'Usuario' })
  })

  it('PATCH /api/clubes/actualizar-club/:clubId retorna 200 cuando el administrador actualiza correctamente', async () => {
    const clubBDD = {
      _id: 'c1',
      nombre: 'Club Viejo',
      descripcion: 'Desc vieja',
      save: vi.fn().mockResolvedValue(true)
    }

    Club.findById.mockResolvedValueOnce(clubBDD)

    const response = await mockRequest
      .patch('/api/clubes/actualizar-club/64a1184eb2f57700123abcde')
      .set('authorization', 'Bearer token')
      .set('x-user-role', 'Administrador')
      .send({ nombre: 'Club Nuevo' })

    expect(response.status).toBe(200)
    expect(response.body.msg).toBe('Club actualizado correctamente.')
  })

  it('PATCH /api/clubes/suspender-club/:clubId retorna 403 para un usuario no administrador', async () => {
    const clubBDD = {
      _id: 'c1',
      estadoClub: 'Activo',
      save: vi.fn().mockResolvedValue(true)
    }

    Club.findById.mockResolvedValueOnce(clubBDD)

    const response = await mockRequest
      .patch('/api/clubes/suspender-club/64a1184eb2f57700123abcde')
      .set('authorization', 'Bearer token')

    expect(response.status).toBe(403)
    expect(response.body).toEqual({ msg: 'No tienes permisos para esta acción', rolUsuario: 'Usuario' })
  })

  it('PATCH /api/clubes/suspender-club/:clubId retorna 200 cuando el administrador suspende el club', async () => {
    const clubBDD = {
      _id: 'c1',
      estadoClub: 'Activo',
      save: vi.fn().mockResolvedValue(true)
    }

    Club.findById.mockResolvedValueOnce(clubBDD)

    const response = await mockRequest
      .patch('/api/clubes/suspender-club/64a1184eb2f57700123abcde')
      .set('authorization', 'Bearer token')
      .set('x-user-role', 'Administrador')

    expect(response.status).toBe(200)
    expect(response.body.msg).toBe('Club suspendido correctamente.')
  })

  it('GET /api/clubes/mis-clubes/:clubId retorna 404 cuando el moderador no tiene acceso al club', async () => {
    Club.findOne.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      populate: vi.fn().mockResolvedValueOnce(null)
    })

    const response = await mockRequest
      .get('/api/clubes/mis-clubes/64a1184eb2f57700123abcde')
      .set('authorization', 'Bearer token')

    expect(response.status).toBe(403)
    expect(response.body).toEqual({ msg: 'No tienes permisos para esta acción', rolUsuario: 'Usuario' })
  })

  it('PATCH /api/clubes/asignar-moderador/:clubId/:moderadorId retorna 403 para un usuario no administrador', async () => {
    const clubBDD = {
      _id: 'c1',
      estadoClub: 'Activo',
      moderadores: [],
      save: vi.fn().mockResolvedValue(true)
    }

    Club.findById.mockResolvedValueOnce(clubBDD)

    const response = await mockRequest
      .patch('/api/clubes/asignar-moderador/64a1184eb2f57700123abcde/64a1184eb2f57700123abcf0')
      .set('authorization', 'Bearer token')
      .set('x-user-role', 'Moderador')

    expect(response.status).toBe(403)
    expect(response.body).toEqual({ msg: 'No tienes permisos para esta acción', rolUsuario: 'Moderador' })
  })

  it('PATCH /api/clubes/asignar-moderador/:clubId/:moderadorId retorna 200 cuando se asigna correctamente', async () => {
    const clubBDD = {
      _id: 'c1',
      estadoClub: 'Activo',
      moderadores: [],
      save: vi.fn().mockResolvedValue(true)
    }

    Club.findById.mockResolvedValueOnce(clubBDD)
    Usuarios.findOne.mockResolvedValueOnce({ _id: '64a1184eb2f57700123abcf0', rol: 'Moderador', estadoUsuario: 'Activo' })

    const response = await mockRequest
      .patch('/api/clubes/asignar-moderador/64a1184eb2f57700123abcde/64a1184eb2f57700123abcf0')
      .set('authorization', 'Bearer token')
      .set('x-user-role', 'Administrador')

    expect(response.status).toBe(200)
    expect(response.body.msg).toBe('Moderador asignado al club con éxito.')
    expect(clubBDD.moderadores).toEqual(['64a1184eb2f57700123abcf0'])
  })

  it('PATCH /api/clubes/quitar-moderador/:clubId/:moderadorId retorna 403 para un usuario no administrador', async () => {
    const clubBDD = {
      _id: 'c1',
      moderadores: ['64a1184eb2f57700123abcf0'],
      save: vi.fn().mockResolvedValue(true)
    }

    Club.findById.mockResolvedValueOnce(clubBDD)

    const response = await mockRequest
      .patch('/api/clubes/quitar-moderador/64a1184eb2f57700123abcde/64a1184eb2f57700123abcf0')
      .set('authorization', 'Bearer token')
      .set('x-user-role', 'Moderador')

    expect(response.status).toBe(403)
    expect(response.body).toEqual({ msg: 'No tienes permisos para esta acción', rolUsuario: 'Moderador' })
  })

  it('PATCH /api/clubes/quitar-moderador/:clubId/:moderadorId retorna 200 cuando se elimina correctamente', async () => {
    const clubBDD = {
      _id: 'c1',
      moderadores: ['64a1184eb2f57700123abcf0'],
      save: vi.fn().mockResolvedValue(true)
    }

    Club.findById.mockResolvedValueOnce(clubBDD)

    const response = await mockRequest
      .patch('/api/clubes/quitar-moderador/64a1184eb2f57700123abcde/64a1184eb2f57700123abcf0')
      .set('authorization', 'Bearer token')
      .set('x-user-role', 'Administrador')

    expect(response.status).toBe(200)
    expect(response.body.msg).toBe('Moderador removido del club correctamente.')
    expect(clubBDD.moderadores).toEqual([])
  })

  it('PATCH /api/clubes/reactivar-club/:clubId retorna 200 cuando se reactiva correctamente', async () => {
    const clubBDD = {
      _id: 'c1',
      estadoClub: 'Suspendido',
      save: vi.fn().mockResolvedValue(true)
    }

    Club.findById.mockResolvedValueOnce(clubBDD)

    const response = await mockRequest
      .patch('/api/clubes/reactivar-club/64a1184eb2f57700123abcde')
      .set('authorization', 'Bearer token')
      .set('x-user-role', 'Administrador')

    expect(response.status).toBe(200)
    expect(response.body.msg).toBe('Club reactivado correctamente.')
    expect(clubBDD.estadoClub).toBe('Activo')
  })
})
