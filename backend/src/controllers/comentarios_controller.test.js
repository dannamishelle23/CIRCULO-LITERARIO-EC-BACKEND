import { describe, it, expect, vi, beforeEach, bench } from 'vitest'

vi.mock('../models/Comentario.js', () => {
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

vi.mock('../models/Obras.js', () => ({
  default: {
    findById: vi.fn()
  }
}))

import * as comentariosController from './comentarios_controller.js'
import { Comentario } from '../models/Comentario.js'
import Obra from '../models/Obras.js'

const mockReq = (params = {}, body = {}, usuarioHeader = {}) => ({
  params,
  body,
  usuarioHeader
})

const mockRes = () => {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

describe('comentarios_controller', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe devolver 404 si la obra no existe o no está publicada', async () => {
    Obra.findById.mockResolvedValueOnce(null)

    const req = mockReq({ obraId: '1' }, { texto: 'prueba' }, { _id: 'u1' })
    const res = mockRes()

    await comentariosController.agregarComentarioObra(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ msg: 'La obra no está disponible para comentarios.' })
  })

  it('debe devolver 400 si el periodo de debate ya expiró', async () => {
    Obra.findById.mockResolvedValueOnce({
      estado: 'Publicada',
      fechaPublicacion: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      createdAt: new Date()
    })

    const req = mockReq({ obraId: '1' }, { texto: 'prueba' }, { _id: 'u1' })
    const res = mockRes()

    await comentariosController.agregarComentarioObra(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ msg: 'El periodo de debate/foro para esta lectura ha finalizado.' })
  })

  it('debe crear un comentario cuando la obra está publicada y el periodo es válido', async () => {
    Obra.findById.mockResolvedValueOnce({
      estado: 'Publicada',
      fechaPublicacion: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      createdAt: new Date()
    })

    const req = mockReq({ obraId: '1' }, { texto: 'texto de prueba' }, { _id: 'u1' })
    const res = mockRes()

    await comentariosController.agregarComentarioObra(req, res)

    expect(Comentario).toHaveBeenCalledWith({ obra: '1', usuario: 'u1', texto: 'texto de prueba' })
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ msg: 'Comentario publicado.' }))
  })

  bench('performance de agregarComentarioObra', async () => {
    Obra.findById.mockResolvedValue({
      estado: 'Publicada',
      fechaPublicacion: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      createdAt: new Date()
    })

    const req = mockReq({ obraId: '1' }, { texto: 'benchmark' }, { _id: 'u1' })
    const res = mockRes()
    await comentariosController.agregarComentarioObra(req, res)
  })

  it('debe editar un comentario cuando el usuario es autor y está dentro del plazo', async () => {
    Comentario.findById.mockResolvedValueOnce({
      usuario: 'u1',
      obra: { estado: 'Publicada', fechaPublicacion: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), createdAt: new Date() },
      texto: 'original',
      save: vi.fn().mockResolvedValue(true),
      populate: vi.fn().mockResolvedValue({ usuario: { nombres: 'Test' }, texto: 'actualizado' })
    })

    const req = mockReq({ comentarioId: '1' }, { texto: 'actualizado' }, { _id: 'u1' })
    const res = mockRes()

    await comentariosController.editarComentarioObra(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ msg: 'Comentario actualizado correctamente.' }))
  })

  it('debe obtener comentarios de una obra y devolver 200', async () => {
    const sortMock = vi.fn().mockResolvedValueOnce([{ texto: 'hola' }])
    const populateMock = vi.fn().mockReturnValueOnce({ sort: sortMock })
    Comentario.find.mockReturnValueOnce({ populate: populateMock })

    const req = mockReq({ obraId: '1' })
    const res = mockRes()

    await comentariosController.obtenerComentariosObra(req, res)

    expect(Comentario.find).toHaveBeenCalledWith({ obra: '1' })
    expect(populateMock).toHaveBeenCalledWith('usuario', 'nombres apellidos avatar username')
    expect(sortMock).toHaveBeenCalledWith({ fechaCreacion: 1 })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith([{ texto: 'hola' }])
  })
})
