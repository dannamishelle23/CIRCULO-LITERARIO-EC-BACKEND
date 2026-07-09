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

vi.mock('./middlewares/verificarRol.js', () => ({
  default: vi.fn(() => (req, res, next) => next())
}))

vi.mock('./middlewares/verificarMiembrosClub.js', () => ({
  default: vi.fn(() => (req, res, next) => next())
}))

vi.mock('./middlewares/verificarAutorObra.js', () => ({
  default: vi.fn(() => (req, res, next) => next())
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

vi.mock('./models/Obras.js', () => {
  const mockFindById = vi.fn()
  const mockFind = vi.fn()

  const Obra = vi.fn(function (data) {
    Object.assign(this, data)
    this.save = vi.fn().mockResolvedValue(this)
    return this
  })

  Obra.findById = mockFindById
  Obra.find = mockFind

  return { default: Obra }
})

vi.mock('./models/Capitulos.js', () => ({
  default: {
    find: vi.fn()
  }
}))

vi.mock('./models/ClubMiembros.js', () => ({
  default: {
    findOne: vi.fn()
  }
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

vi.mock('./helpers/uploadCloudinary.js', () => ({
  subirImagenCloudinary: vi.fn().mockResolvedValue({ secure_url: 'https://cloud.test/file.jpg', public_id: 'cloud-id' }),
  eliminarImagenCloudinary: vi.fn().mockResolvedValue(true)
}))

vi.mock('./helpers/sendMail.js', () => ({
  sendMailToRegister: vi.fn().mockResolvedValue(true),
  sendMailToRecoveryPassword: vi.fn().mockResolvedValue(true),
  sendMailToCreateModerator: vi.fn().mockResolvedValue(true)
}))

import app from './server.js'
import Club from './models/Clubes.js'
import Obra from './models/Obras.js'
import Usuarios from './models/Usuarios.js'

const mockRequest = request(app)

describe('Rutas de aceptación - recursos faltantes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('POST /api/clubes/crear-club retorna 201 cuando se crea correctamente', async () => {
    Club.findOne.mockResolvedValueOnce(null)

    const response = await mockRequest
      .post('/api/clubes/crear-club')
      .set('authorization', 'Bearer token')
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

  it('GET /api/obras/autor/:autorId retorna 200 con obras públicas', async () => {
    Obra.find.mockReturnValueOnce({
      populate: vi.fn().mockReturnThis(),
      sort: vi.fn().mockResolvedValue([{ _id: 'o1', titulo: 'Obra pública' }])
    })

    const response = await mockRequest
      .get('/api/obras/autor/u1')
      .set('authorization', 'Bearer token')

    expect(response.status).toBe(200)
    expect(response.body.ok).toBe(true)
    expect(response.body.obras).toEqual([{ _id: 'o1', titulo: 'Obra pública' }])
  })

  it('GET /api/obras/:id retorna 200 con una obra', async () => {
    const obraPopulada = {
      _id: 'o1',
      titulo: 'Obra 1',
      sinopsis: 'Sinopsis',
      prologo: 'Prólogo',
      portada: 'https://img.test/obra.jpg',
      subgenero: 'Drama',
      estado: 'Aprobada',
      autor: { _id: { toString: () => 'u1' }, nombres: 'Ana', apellidos: 'García', username: 'ana', avatar: 'a' },
      club: { nombre: 'Club', generoLiterario: 'Fantasía' },
      votos: [],
      fechaInicioVotacion: null,
      fechaFinVotacion: null,
      fechaPublicacion: null,
      motivoRechazo: null
    }

    const populateAutor = vi.fn().mockReturnValueOnce({
      populate: vi.fn().mockResolvedValueOnce(obraPopulada)
    })

    Obra.findById.mockReturnValueOnce({
      populate: populateAutor
    })

    const response = await mockRequest
      .get('/api/obras/o1')
      .set('authorization', 'Bearer token')

    expect(response.status).toBe(200)
    expect(response.body.ok).toBe(true)
    expect(response.body.obra.titulo).toBe('Obra 1')
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
