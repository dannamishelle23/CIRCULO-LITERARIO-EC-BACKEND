import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'

vi.mock('./middlewares/JWT.js', () => ({
  verificarTokenJWT: vi.fn((req, res, next) => {
    req.usuarioHeader = {
      _id: req.headers['x-user-id'] || 'u1',
      rol: req.headers['x-user-role'] || 'Usuario'
    }
    next()
  })
}))

vi.mock('./models/Obras.js', () => {
  const mockFindById = vi.fn()
  const mockFind = vi.fn()
  const mockFindOne = vi.fn()
  const mockUpdateMany = vi.fn()

  const Obra = vi.fn(function (data) {
    Object.assign(this, data)
    this.save = vi.fn().mockResolvedValue(this)
    return this
  })

  Obra.findById = mockFindById
  Obra.find = mockFind
  Obra.findOne = mockFindOne
  Obra.updateMany = mockUpdateMany

  return { default: Obra }
})

vi.mock('./models/Clubes.js', () => ({
  default: {
    findById: vi.fn()
  }
}))

vi.mock('./models/ClubMiembros.js', () => ({
  default: {
    findOne: vi.fn()
  }
}))

vi.mock('./models/Capitulos.js', () => {
  const mockFindOne = vi.fn()
  const mockFindById = vi.fn()
  const mockFind = vi.fn()
  const mockCountDocuments = vi.fn()

  const Capitulo = vi.fn(function (data) {
    Object.assign(this, data)
    this.save = vi.fn().mockResolvedValue(this)
    return this
  })

  Capitulo.findOne = mockFindOne
  Capitulo.findById = mockFindById
  Capitulo.find = mockFind
  Capitulo.countDocuments = mockCountDocuments

  return { default: Capitulo }
})

vi.mock('./helpers/uploadCloudinary.js', () => ({
  subirImagenCloudinary: vi.fn().mockResolvedValue({ secure_url: 'https://cloud.test/obra.jpg', public_id: 'cloud-id' }),
  eliminarImagenCloudinary: vi.fn().mockResolvedValue(true)
}))

import app from './server.js'
import Obra from './models/Obras.js'
import Club from './models/Clubes.js'
import ClubMiembros from './models/ClubMiembros.js'
import Capitulo from './models/Capitulos.js'

const mockRequest = request(app)

describe('Pruebas de aceptación - obras', () => {
  beforeEach(() => {
    vi.clearAllMocks()
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

  it('GET /api/obras/:id retorna 404 si la obra no existe', async () => {
    const populateAutor = vi.fn().mockReturnValueOnce({
      populate: vi.fn().mockResolvedValueOnce(null)
    })

    Obra.findById.mockReturnValueOnce({
      populate: populateAutor
    })

    const response = await mockRequest
      .get('/api/obras/no-existe')
      .set('authorization', 'Bearer token')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({ msg: 'Obra no encontrada.' })
  })

  it('GET /api/obras/autor/:autorId retorna 200 aunque no haya obras', async () => {
    Obra.find.mockReturnValueOnce({
      populate: vi.fn().mockReturnThis(),
      sort: vi.fn().mockResolvedValue([])
    })

    const response = await mockRequest
      .get('/api/obras/autor/u2')
      .set('authorization', 'Bearer token')

    expect(response.status).toBe(200)
    expect(response.body.obras).toEqual([])
  })

  it('flujo completo de obra: crea la obra, añade capítulos, la postula, el moderador la aprueba y se inicia votación', async () => {
    const obra = {
      _id: 'o1',
      titulo: 'La historia',
      sinopsis: 'Sinopsis',
      prologo: 'Prólogo',
      portada: 'https://cloud.test/obra.jpg',
      club: 'c1',
      autor: { toString: () => 'u1' },
      subgenero: 'Drama',
      estado: 'Borrador',
      activo: true,
      save: vi.fn().mockResolvedValue(true)
    }

    Club.findById
      .mockResolvedValueOnce({ _id: 'c1', estadoClub: 'Activo' })
      .mockResolvedValueOnce({ _id: 'c1', estadoClub: 'Activo', moderadores: ['m1'] })
      .mockResolvedValueOnce({ _id: 'c1', estadoClub: 'Activo', moderadores: ['m1'] })

    ClubMiembros.findOne.mockResolvedValueOnce({ club: 'c1', usuario: 'u1', estadoSolicitud: 'Aprobado' })

    Obra.findById
      .mockResolvedValueOnce(obra)
      .mockResolvedValueOnce(obra)
      .mockResolvedValueOnce(obra)
      .mockResolvedValueOnce(obra)

    Capitulo.countDocuments.mockResolvedValueOnce(3)
    Capitulo.findOne.mockResolvedValueOnce(null)
    Obra.findOne.mockResolvedValueOnce(null)
    Obra.find.mockReturnValueOnce([{ _id: 'o1', estado: 'Aprobada', votos: [] }])
    Obra.updateMany.mockResolvedValueOnce({})

    const createResponse = await mockRequest
      .post('/api/obras/')
      .set('authorization', 'Bearer token')
      .set('x-user-id', 'u1')
      .set('x-user-role', 'Usuario')
      .field('titulo', 'La historia')
      .field('sinopsis', 'Sinopsis')
      .field('prologo', 'Prólogo')
      .field('club', 'c1')
      .field('subgenero', 'Drama')
      .attach('portada', Buffer.from('fake-image'), { filename: 'portada.jpg', contentType: 'image/jpeg' })

    expect(createResponse.status).toBe(201)
    expect(createResponse.body.ok).toBe(true)

    const capituloResponse = await mockRequest
      .post('/api/capitulos/o1')
      .set('authorization', 'Bearer token')
      .set('x-user-id', 'u1')
      .set('x-user-role', 'Usuario')
      .send({
        titulo: 'Capítulo 1',
        contenido: 'Contenido del capítulo',
        numeroCapitulo: 1
      })

    expect(capituloResponse.status).toBe(201)
    expect(capituloResponse.body.ok).toBe(true)

    const postularResponse = await mockRequest
      .post('/api/obras/o1/postular')
      .set('authorization', 'Bearer token')
      .set('x-user-id', 'u1')
      .set('x-user-role', 'Usuario')

    expect(postularResponse.status).toBe(200)
    expect(postularResponse.body.msg).toBe('Enviada a revisión')

    const aprobarResponse = await mockRequest
      .post('/api/obras/o1/aprobar')
      .set('authorization', 'Bearer token')
      .set('x-user-id', 'm1')
      .set('x-user-role', 'Moderador')

    expect(aprobarResponse.status).toBe(200)
    expect(aprobarResponse.body.msg).toBe('Obra aprobada')
    expect(obra.estado).toBe('Aprobada')

    const votacionResponse = await mockRequest
      .post('/api/obras/club/c1/iniciar-votacion')
      .set('authorization', 'Bearer token')
      .set('x-user-id', 'm1')
      .set('x-user-role', 'Moderador')
      .send({ obrasIds: ['o1'] })

    expect(votacionResponse.status).toBe(200)
    expect(votacionResponse.body.msg).toBe('Votación iniciada')
  })

  it('rechaza una obra en revisión y la devuelve a borrador', async () => {
    const obra = {
      _id: 'o2',
      estado: 'EnRevision',
      club: 'c1',
      motivoRechazo: null,
      save: vi.fn().mockResolvedValue(true)
    }

    Obra.findById.mockResolvedValueOnce(obra)
    Club.findById.mockResolvedValueOnce({ _id: 'c1', moderadores: ['m1'] })

    const response = await mockRequest
      .post('/api/obras/o2/rechazar')
      .set('authorization', 'Bearer token')
      .set('x-user-id', 'm1')
      .set('x-user-role', 'Moderador')
      .send({ motivo: 'Falta profundidad' })

    expect(response.status).toBe(200)
    expect(response.body.msg).toBe('Obra rechazada')
    expect(obra.estado).toBe('Borrador')
    expect(obra.motivoRechazo).toBe('Falta profundidad')
  })

  it('cierra la votación y publica la obra ganadora', async () => {
    const obraGanadora = {
      _id: 'o3',
      club: 'c1',
      estado: 'EnVotacion',
      votos: [{ usuario: 'u1' }],
      fechaFinVotacion: new Date(Date.now() - 1000),
      save: vi.fn().mockResolvedValue(true)
    }

    Obra.find.mockResolvedValueOnce([obraGanadora])

    const response = await mockRequest
      .post('/api/obras/club/c1/cerrar-votacion')
      .set('authorization', 'Bearer token')
      .set('x-user-id', 'm1')
      .set('x-user-role', 'Moderador')

    expect(response.status).toBe(200)
    expect(response.body.ok).toBe(true)
    expect(obraGanadora.estado).toBe('Publicada')
  })

  it('no permite votar si la votación ya pasó la fecha de cierre', async () => {
    const obraVotacionCerrada = {
      _id: 'o4',
      club: 'c1',
      estado: 'EnVotacion',
      fechaFinVotacion: new Date(Date.now() - 1000),
      votos: []
    }

    Obra.findById.mockResolvedValueOnce(obraVotacionCerrada)
    ClubMiembros.findOne.mockResolvedValueOnce({ club: 'c1', usuario: 'u1', estadoSolicitud: 'Aprobado' })

    const response = await mockRequest
      .post('/api/obras/o4/votar')
      .set('authorization', 'Bearer token')
      .set('x-user-id', 'u1')
      .set('x-user-role', 'Usuario')

    expect(response.status).toBe(400)
    expect(response.body.msg).toBe('La votación ya terminó.')
  })
})
