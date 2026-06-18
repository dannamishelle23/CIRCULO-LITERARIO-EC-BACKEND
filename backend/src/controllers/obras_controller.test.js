import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../models/Obras.js', () => {
  const mockFindById = vi.fn()
  const mockFind = vi.fn()
  const mockFindOne = vi.fn()
  const mockUpdateMany = vi.fn()

  const Obra = vi.fn(function (data) {
    this._id = 'obra-id'
    this.titulo = data.titulo
    this.estado = data.estado || 'Borrador'
    this.autor = data.autor
    this.club = data.club
    this.votos = data.votos || []
    this.activo = data.activo ?? true
    this.save = vi.fn().mockResolvedValue(this)
  })

  Obra.findById = mockFindById
  Obra.find = mockFind
  Obra.findOne = mockFindOne
  Obra.updateMany = mockUpdateMany

  return { default: Obra }
})

vi.mock('../models/Clubes.js', () => ({
  default: {
    findById: vi.fn()
  }
}))

vi.mock('../models/Capitulos.js', () => ({
  default: {
    countDocuments: vi.fn(),
    deleteMany: vi.fn()
  }
}))

vi.mock('../models/ClubMiembros.js', () => ({
  default: {
    findOne: vi.fn()
  }
}))
vi.mock('../helpers/uploadCloudinary.js', () => ({
  subirImagenCloudinary: vi.fn().mockResolvedValue({
    secure_url: 'https://cloud-url.jpg',
    public_id: 'cloud-id'
  }),
  eliminarImagenCloudinary: vi.fn().mockResolvedValue(true)
}))

import * as obrasController from './obras_controller.js'
import Obra from '../models/Obras.js'
import Club from '../models/Clubes.js'
import Capitulo from '../models/Capitulos.js'
import ClubMiembros from '../models/ClubMiembros.js'

const mockReq = (body = {}, params = {}, usuarioHeader = {}) => ({
  body,
  params,
  usuarioHeader,
  files: {}
})

const mockRes = () => {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

describe('obras_controller', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('crearObra debe devolver 400 si faltan campos obligatorios', async () => {
    const req = mockReq({ titulo: 'Obra' }, {}, { _id: 'user-1' })
    const res = mockRes()

    await obrasController.crearObra(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Todos los campos son obligatorios.'
    })
  })

  it('crearObra debe devolver 400 si el club no existe', async () => {
    Club.findById.mockResolvedValueOnce(null)

    const req = mockReq(
      { titulo: 'Obra', sinopsis: 'Sinop', prologo: 'Prol', club: 'club-1' },
      {},
      { _id: 'user-1' }
    )
    req.files = { portada: { tempFilePath: '/tmp/file' } }
    const res = mockRes()

    await obrasController.crearObra(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Club inválido o inactivo.'
    })
  })

  it('crearObra debe devolver 403 si el usuario no es miembro del club', async () => {
    Club.findById.mockResolvedValueOnce({ estadoClub: 'Activo' })
    ClubMiembros.findOne.mockResolvedValueOnce(null)

    const req = mockReq(
      { titulo: 'Obra', sinopsis: 'Sinop', prologo: 'Prol', club: 'club-1' },
      {},
      { _id: 'user-1' }
    )
    req.files = { portada: { tempFilePath: '/tmp/file' } }
    const res = mockRes()

    await obrasController.crearObra(req, res)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Debes ser miembro aprobado del club.'
    })
  })

  it('postularObra debe devolver 403 si no es el autor', async () => {
    const obraExistente = {
      autor: { toString: () => 'other-user' },
      estado: 'Borrador'
    }
    Obra.findById.mockResolvedValueOnce(obraExistente)

    const req = mockReq({}, { id: 'obra-1' }, { _id: 'user-1' })
    const res = mockRes()

    await obrasController.postularObra(req, res)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({ msg: 'No eres el autor.' })
  })

  it('postularObra debe devolver 400 si no hay 3 capítulos', async () => {
    const obraExistente = {
      autor: { toString: () => 'user-1' },
      estado: 'Borrador',
      subgenero: 'Drama',
      save: vi.fn().mockResolvedValue(true)
    }
    Obra.findById.mockResolvedValueOnce(obraExistente)
    Capitulo.countDocuments.mockResolvedValueOnce(2)

    const req = mockReq({}, { id: 'obra-1' }, { _id: 'user-1' })
    const res = mockRes()

    await obrasController.postularObra(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Debe tener al menos 3 capítulos.'
    })
  })

  it('iniciarVotacion debe validar que el club existe', async () => {
    Club.findById.mockResolvedValueOnce(null)

    const req = mockReq(
      { obrasIds: ['obra-1'] },
      { clubId: 'club-1' },
      { _id: 'mod-1', rol: 'Moderador' }
    )
    const res = mockRes()

    await obrasController.iniciarVotacion(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
  })

  it('iniciarVotacion debe devolver 403 si el club está suspendido', async () => {
    Club.findById.mockResolvedValueOnce({ estadoClub: 'Suspendido', moderadores: [] })

    const req = mockReq(
      { obrasIds: ['obra-1'] },
      { clubId: 'club-1' },
      { _id: 'mod-1', rol: 'Moderador' }
    )
    const res = mockRes()

    await obrasController.iniciarVotacion(req, res)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Club suspendido. No se puede iniciar votación.'
    })
  })

  it('eliminarObra debe devolver 404 si no existe', async () => {
    Obra.findById.mockResolvedValueOnce(null)

    const req = mockReq({}, { id: 'obra-1' }, { _id: 'user-1' })
    const res = mockRes()

    await obrasController.eliminarObra(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
  })

  it('eliminarObra debe devolver 403 si no es el autor', async () => {
    const obraExistente = {
      autor: { toString: () => 'other-user' }
    }
    Obra.findById.mockResolvedValueOnce(obraExistente)

    const req = mockReq({}, { id: 'obra-1' }, { _id: 'user-1', rol: 'Usuario' })
    const res = mockRes()

    await obrasController.eliminarObra(req, res)

    expect(res.status).toHaveBeenCalledWith(403)
  })

  it('eliminarObra debe devolver 400 si está en votación', async () => {
    const obraExistente = {
      autor: { toString: () => 'user-1' },
      estado: 'EnVotacion'
    }
    Obra.findById.mockResolvedValueOnce(obraExistente)

    const req = mockReq({}, { id: 'obra-1' }, { _id: 'user-1' })
    const res = mockRes()

    await obrasController.eliminarObra(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('eliminarObra debe eliminar si está en Borrador', async () => {
    const obraExistente = {
      autor: { toString: () => 'user-1' },
      estado: 'Borrador',
      portadaID: 'cloud-id',
      activo: true,
      save: vi.fn().mockResolvedValue(true)
    }
    Obra.findById.mockResolvedValueOnce(obraExistente)
    Capitulo.deleteMany.mockResolvedValueOnce({})

    const req = mockReq({}, { id: 'obra-1' }, { _id: 'user-1' })
    const res = mockRes()

    await obrasController.eliminarObra(req, res)

    expect(obraExistente.save).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      msg: 'Obra eliminada correctamente.'
    })
  })
})
