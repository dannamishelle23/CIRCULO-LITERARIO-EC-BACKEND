import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../models/Clubes.js', () => {
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

vi.mock('../models/Usuarios.js', () => {
  const mockFindOne = vi.fn()
  const Usuarios = {
    findOne: mockFindOne
  }
  return { default: Usuarios }
})

vi.mock('../helpers/uploadCloudinary.js', () => ({
  subirImagenCloudinary: vi.fn().mockResolvedValue({
    secure_url: 'https://cloud.test/club.jpg',
    public_id: 'cloud-avatar-id'
  })
}))

import * as clubController from './club_controller.js'
import Club from '../models/Clubes.js'
import Usuarios from '../models/Usuarios.js'
import { subirImagenCloudinary } from '../helpers/uploadCloudinary.js'

const mockReq = (body = {}, params = {}, usuarioHeader = undefined, files = {}) => ({
  body,
  params,
  usuarioHeader,
  files
})

const mockRes = () => {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

const chainQuery = (value) => ({
  select: vi.fn().mockReturnValue({
    populate: vi.fn().mockResolvedValue(value)
  })
})

describe('club_controller', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('crearClub devuelve 400 si faltan campos', async () => {
    const req = mockReq({ nombre: '', descripcion: 'Desc', generoLiterario: 'Fantasía' }, {}, { _id: 'admin-1' })
    const res = mockRes()

    await clubController.crearClub(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ msg: 'Debes completar todos los campos.' })
  })

  it('crearClub devuelve 400 si ya existe un club del género', async () => {
    Club.findOne.mockResolvedValueOnce({ _id: 'club-1' })

    const req = mockReq(
      { nombre: 'Club A', descripcion: 'Desc', generoLiterario: 'Fantasía' },
      {},
      { _id: 'admin-1' }
    )
    const res = mockRes()

    await clubController.crearClub(req, res)

    expect(Club.findOne).toHaveBeenCalledWith({ generoLiterario: 'Fantasía' })
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ msg: 'Ya existe un club del género Fantasía.' })
  })

  it('crearClub crea un club con éxito', async () => {
    Club.findOne.mockResolvedValueOnce(null)
    const saveMock = vi.fn().mockResolvedValue(true)
    Club.mockImplementationOnce(function (data) {
      Object.assign(this, data)
      this.save = saveMock
      return this
    })

    const req = mockReq(
      { nombre: 'Club A', descripcion: 'Descripción', generoLiterario: 'Fantasía' },
      {},
      { _id: 'admin-1' }
    )
    const res = mockRes()

    await clubController.crearClub(req, res)

    expect(Club.findOne).toHaveBeenCalledWith({ generoLiterario: 'Fantasía' })
    expect(saveMock).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({ msg: 'Club literario creado con éxito.' })
  })

  it('listarClubes devuelve 404 cuando no hay clubes', async () => {
    const query = {
      select: vi.fn().mockReturnThis(),
      populate: vi.fn().mockResolvedValue([])
    }
    Club.find.mockReturnValueOnce(query)

    const req = mockReq({}, {}, { rol: 'Usuario' })
    const res = mockRes()

    await clubController.listarClubes(req, res)

    expect(Club.find).toHaveBeenCalledWith({ estadoClub: 'Activo' })
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ msg: 'No existen clubes registrados.' })
  })

  it('listarClubes retorna clubes para un moderador', async () => {
    const clubes = [{ _id: 'club-1', nombre: 'Club A' }]
    const query = {
      select: vi.fn().mockReturnThis(),
      populate: vi.fn().mockResolvedValue(clubes)
    }
    Club.find.mockReturnValueOnce(query)

    const req = mockReq({}, {}, { rol: 'Moderador' })
    const res = mockRes()

    await clubController.listarClubes(req, res)

    expect(Club.find).toHaveBeenCalledWith({ estadoClub: { $in: ['Activo', 'Suspendido'] } })
    expect(query.select).toHaveBeenCalledWith('-createdAt -updatedAt -__v')
    expect(query.populate).toHaveBeenCalledWith('moderadores', 'nombres apellidos email estadoUsuario avatar')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ ok: true, msg: 'Clubes obtenidos correctamente', clubes })
  })

  it('detalleClub devuelve 400 si el id es inválido', async () => {
    const req = mockReq({}, { clubId: '123' }, { rol: 'Administrador' })
    const res = mockRes()

    await clubController.detalleClub(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ msg: 'ID inválido.' })
  })

  it('detalleClub devuelve 404 si no existe el club', async () => {
    Club.findById.mockReturnValueOnce({ select: vi.fn().mockReturnValueOnce({ populate: vi.fn().mockResolvedValueOnce(null) }) })

    const req = mockReq({}, { clubId: '64a1184eb2f57700123abcde' }, { rol: 'Administrador' })
    const res = mockRes()

    await clubController.detalleClub(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ msg: 'Club no encontrado.' })
  })

  it('detalleClub devuelve el club cuando existe', async () => {
    const club = { _id: '64a1184eb2f57700123abcde', nombre: 'Club A' }
    Club.findById.mockReturnValueOnce({
      select: vi.fn().mockReturnValueOnce({
        populate: vi.fn().mockResolvedValueOnce(club)
      })
    })

    const req = mockReq({}, { clubId: '64a1184eb2f57700123abcde' }, { rol: 'Administrador' })
    const res = mockRes()

    await clubController.detalleClub(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ ok: true, msg: 'Info del club obtenida correctamente', club })
  })

  it('asignarModeradorClub devuelve 400 si IDs inválidos', async () => {
    const req = mockReq({}, { clubId: 'abc', moderadorId: 'def' }, { rol: 'Administrador' })
    const res = mockRes()

    await clubController.asignarModeradorClub(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ msg: 'IDs inválidos.' })
  })

  it('asignarModeradorClub devuelve 404 si no existe el club', async () => {
    Club.findById.mockResolvedValueOnce(null)

    const req = mockReq({}, { clubId: '64a1184eb2f57700123abcde', moderadorId: '64a1184eb2f57700123abcdf' }, { rol: 'Administrador' })
    const res = mockRes()

    await clubController.asignarModeradorClub(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ msg: 'Club no encontrado.' })
  })

  it('asignarModeradorClub devuelve 403 si el club está suspendido', async () => {
    Club.findById.mockResolvedValueOnce({ estadoClub: 'Suspendido', moderadores: [] })

    const req = mockReq({}, { clubId: '64a1184eb2f57700123abcde', moderadorId: '64a1184eb2f57700123abcdf' }, { rol: 'Administrador' })
    const res = mockRes()

    await clubController.asignarModeradorClub(req, res)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({ msg: 'No se pueden asignar moderadores a clubes suspendidos.' })
  })

  it('asignarModeradorClub devuelve 404 si el moderador no existe', async () => {
    Club.findById.mockResolvedValueOnce({ estadoClub: 'Activo', moderadores: [] })
    Usuarios.findOne.mockResolvedValueOnce(null)

    const req = mockReq({}, { clubId: '64a1184eb2f57700123abcde', moderadorId: '64a1184eb2f57700123abcdf' }, { rol: 'Administrador' })
    const res = mockRes()

    await clubController.asignarModeradorClub(req, res)

    expect(Usuarios.findOne).toHaveBeenCalledWith({ _id: '64a1184eb2f57700123abcdf', rol: 'Moderador' })
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ msg: 'Moderador no encontrado.' })
  })

  it('asignarModeradorClub asigna el moderador correctamente', async () => {
    const saveMock = vi.fn().mockResolvedValue(true)
    const club = { estadoClub: 'Activo', moderadores: [], save: saveMock }
    Club.findById.mockResolvedValueOnce(club)
    Usuarios.findOne.mockResolvedValueOnce({ estadoUsuario: 'Activo' })

    const req = mockReq({}, { clubId: '64a1184eb2f57700123abcde', moderadorId: '64a1184eb2f57700123abcdf' }, { rol: 'Administrador' })
    const res = mockRes()

    await clubController.asignarModeradorClub(req, res)

    expect(club.save).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ msg: 'Moderador asignado al club con éxito.' })
  })
})
