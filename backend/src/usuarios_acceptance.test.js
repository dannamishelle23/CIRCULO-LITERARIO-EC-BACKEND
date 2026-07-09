import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'

vi.mock('./middlewares/JWT.js', () => ({
  verificarTokenJWT: vi.fn((req, res, next) => {
    req.usuarioHeader = { _id: 'u1', rol: 'Usuario' }
    next()
  }),
  crearTokenJWT: vi.fn().mockReturnValue('jwt-token-123')
}))

vi.mock('./middlewares/validar_campos.js', () => ({
  validarCampos: vi.fn((req, res, next) => next())
}))

vi.mock('./validators/usuario_validator.js', () => ({
  validarActualizarPerfil: [vi.fn((req, res, next) => next())],
  validarMongoID: vi.fn((req, res, next) => next()),
  validarActualizarPassword: [vi.fn((req, res, next) => next())],
  validarRegistrarModerador: [vi.fn((req, res, next) => next())]
}))

vi.mock('./models/Usuarios.js', () => {
  const mockFindOne = vi.fn()
  const mockFindById = vi.fn()

  const Usuarios = vi.fn(function (data) {
    Object.assign(this, data)
    this.save = vi.fn().mockResolvedValue(this)
    return this
  })

  Usuarios.findOne = mockFindOne
  Usuarios.findById = mockFindById

  return { default: Usuarios }
})

vi.mock('./models/Obras.js', () => ({
  default: {
    find: vi.fn()
  }
}))

import app from './server.js'
import Usuarios from './models/Usuarios.js'
import Obra from './models/Obras.js'

const mockRequest = request(app)

describe('Pruebas de aceptación - usuarios', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('GET /api/usuarios/perfil retorna 200 con datos del usuario autenticado', async () => {
    const response = await mockRequest
      .get('/api/usuarios/perfil')
      .set('authorization', 'Bearer token')

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expect.objectContaining({ _id: 'u1', rol: 'Usuario' }))
  })

  it('GET /api/usuarios/perfil/:id retorna 200 con el perfil público', async () => {
    Usuarios.findById.mockReturnValueOnce({
      select: vi.fn().mockResolvedValueOnce({ _id: 'u2', nombres: 'Ana', apellidos: 'García', username: 'ana' })
    })

    Obra.find.mockReturnValueOnce({
      select: vi.fn().mockReturnValueOnce({
        sort: vi.fn().mockResolvedValue([{ _id: 'o2', titulo: 'Obra del usuario' }])
      })
    })

    const response = await mockRequest
      .get('/api/usuarios/perfil/u2')
      .set('authorization', 'Bearer token')

    expect(response.status).toBe(200)
    expect(response.body.ok).toBe(true)
    expect(response.body.usuario.nombres).toBe('Ana')
    expect(response.body.obras).toEqual([{ _id: 'o2', titulo: 'Obra del usuario' }])
  })

  it('GET /api/usuarios/perfil/:id retorna 404 si el usuario no existe', async () => {
    Usuarios.findById.mockReturnValueOnce({
      select: vi.fn().mockResolvedValueOnce(null)
    })

    const response = await mockRequest
      .get('/api/usuarios/perfil/no-existe')
      .set('authorization', 'Bearer token')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({ ok: false, msg: 'Usuario no encontrado.' })
  })

  it('PATCH /api/usuarios/actualizar-perfil/:id retorna 400 si no envían datos para actualizar', async () => {
    const usuarioBDD = {
      _id: 'u2',
      email: 'ana@example.com',
      username: 'ana',
      nombres: 'Ana',
      apellidos: 'García',
      provincia: 'Pichincha',
      avatar: null,
      avatarID: null,
      redes: {},
      save: vi.fn().mockResolvedValue(true)
    }

    Usuarios.findById.mockResolvedValueOnce(usuarioBDD)

    const response = await mockRequest
      .patch('/api/usuarios/actualizar-perfil/u2')
      .set('authorization', 'Bearer token')
      .send({})

    expect(response.status).toBe(400)
    expect(response.body).toEqual({ msg: 'Debes enviar al menos un campo para actualizar.' })
  })

  it('PATCH /api/usuarios/actualizar-perfil/:id retorna 200 cuando se actualiza correctamente', async () => {
    const usuarioBDD = {
      _id: 'u2',
      email: 'ana@example.com',
      username: 'ana',
      nombres: 'Ana',
      apellidos: 'García',
      provincia: 'Pichincha',
      avatar: null,
      avatarID: null,
      redes: {},
      save: vi.fn().mockResolvedValue(true),
      toObject: vi.fn().mockReturnValue({
        _id: 'u2',
        email: 'ana@example.com',
        username: 'ana',
        nombres: 'Ana María',
        apellidos: 'García',
        provincia: 'Pichincha',
        avatar: null,
        redes: {}
      })
    }

    Usuarios.findById.mockResolvedValueOnce(usuarioBDD)
    Usuarios.findOne.mockResolvedValue(null)

    const response = await mockRequest
      .patch('/api/usuarios/actualizar-perfil/u2')
      .set('authorization', 'Bearer token')
      .send({ nombres: 'Ana María' })

    expect(response.status).toBe(200)
    expect(response.body.msg).toBe('Perfil actualizado correctamente.')
  })
})
