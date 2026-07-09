import { bench, vi, beforeEach } from 'vitest'

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
  const mockFindById = vi.fn()
  const mockFind = vi.fn()

  const Usuarios = vi.fn(function (data) {
    Object.assign(this, data)
    this.save = vi.fn().mockResolvedValue(this)
    return this
  })

  Usuarios.findOne = mockFindOne
  Usuarios.findById = mockFindById
  Usuarios.find = mockFind

  return { default: Usuarios }
})

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

vi.mock('../helpers/uploadCloudinary.js', () => ({
  subirImagenCloudinary: vi.fn().mockResolvedValue({ secure_url: 'https://cloud.test/file.jpg', public_id: 'cloud-id' }),
  eliminarImagenCloudinary: vi.fn().mockResolvedValue(true)
}))

vi.mock('../helpers/sendMail.js', () => ({
  sendMailToRegister: vi.fn().mockResolvedValue(true),
  sendMailToRecoveryPassword: vi.fn().mockResolvedValue(true),
  sendMailToCreateModerator: vi.fn().mockResolvedValue(true)
}))

import * as clubController from './club_controller.js'
import * as comentariosController from './comentarios_controller.js'
import * as obrasController from './obras_controller.js'
import * as usuarioController from './usuario_controller.js'
import Club from '../models/Clubes.js'
import { Comentario } from '../models/Comentario.js'
import Obra from '../models/Obras.js'
import Usuarios from '../models/Usuarios.js'
import Capitulo from '../models/Capitulos.js'
import ClubMiembros from '../models/ClubMiembros.js'

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

beforeEach(() => {
  vi.clearAllMocks()
})

bench('performance de crearClub en club_controller', async () => {
  Club.findOne.mockResolvedValueOnce(null)
  Club.mockImplementationOnce(function (data) {
    Object.assign(this, data)
    this.save = vi.fn().mockResolvedValue(this)
    return this
  })

  const req = mockReq(
    { nombre: 'Club Bench', descripcion: 'Descripción benchmark', generoLiterario: 'Fantasía' },
    {},
    { _id: 'admin-bench' }
  )
  const res = mockRes()

  await clubController.crearClub(req, res)
})

bench('performance de listarClubes en club_controller', async () => {
  const clubes = [{ _id: 'club-bench', nombre: 'Club Bench' }]
  const query = {
    select: vi.fn().mockReturnThis(),
    populate: vi.fn().mockResolvedValue(clubes)
  }
  Club.find.mockReturnValueOnce(query)

  const req = mockReq({}, {}, { rol: 'Usuario' })
  const res = mockRes()

  await clubController.listarClubes(req, res)
})

bench('performance de agregarComentarioObra en comentarios_controller', async () => {
  Obra.findById.mockResolvedValueOnce({
    estado: 'Publicada',
    fechaPublicacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date()
  })

  const req = mockReq({ obraId: 'bench-obra' }, { texto: 'comentario benchmark' }, { _id: 'u-bench' })
  const res = mockRes()

  await comentariosController.agregarComentarioObra(req, res)
})

bench('performance de obtenerComentariosObra en comentarios_controller', async () => {
  const sortMock = vi.fn().mockResolvedValueOnce([{ texto: 'hola benchmark' }])
  const populateMock = vi.fn().mockReturnValueOnce({ sort: sortMock })
  Comentario.find.mockReturnValueOnce({ populate: populateMock })

  const req = mockReq({ obraId: 'bench-obra' })
  const res = mockRes()

  await comentariosController.obtenerComentariosObra(req, res)
})

bench('performance de crearObra en obras_controller', async () => {
  Club.findById.mockResolvedValueOnce({ estadoClub: 'Activo' })
  ClubMiembros.findOne.mockResolvedValueOnce({ estado: 'Aprobado' })

  const req = mockReq(
    { titulo: 'Obra Bench', sinopsis: 'Sinopsis benchmark', prologo: 'Prólogo benchmark', club: 'club-bench' },
    {},
    { _id: 'user-bench' }
  )
  req.files = { portada: { tempFilePath: '/tmp/bench-portada' } }
  const res = mockRes()

  await obrasController.crearObra(req, res)
})

bench('performance de postularObra en obras_controller', async () => {
  const obraExistente = {
    autor: { toString: () => 'user-bench' },
    estado: 'Borrador',
    subgenero: 'Drama',
    save: vi.fn().mockResolvedValue(true)
  }
  Obra.findById.mockResolvedValueOnce(obraExistente)
  Capitulo.countDocuments.mockResolvedValueOnce(3)

  const req = mockReq({}, { id: 'obra-bench' }, { _id: 'user-bench' })
  const res = mockRes()

  await obrasController.postularObra(req, res)
})

bench('performance de perfilPublicoUsuario en usuario_controller', async () => {
  const usuario = { _id: 'user-bench', nombres: 'Ana', apellidos: 'García' }
  const sortMock = vi.fn().mockResolvedValueOnce([{ _id: 'obra-bench', titulo: 'Obra bench' }])
  const obraQuery = {
    select: vi.fn().mockReturnValueOnce({ sort: sortMock })
  }
  Obra.find.mockReturnValueOnce(obraQuery)
  Usuarios.findById.mockImplementationOnce(() => ({
    select: vi.fn().mockResolvedValueOnce(usuario)
  }))

  const req = mockReq({}, { id: 'user-bench' })
  const res = mockRes()

  await usuarioController.perfilPublicoUsuario(req, res)
})

bench('performance de actualizarPerfil en usuario_controller', async () => {
  const usuarioBDD = {
    _id: 'user-bench-update',
    email: 'bench@example.com',
    username: 'benchuser',
    nombres: 'Bench',
    apellidos: 'User',
    provincia: 'Pichincha',
    avatar: null,
    avatarID: null,
    redes: { facebook: '' },
    save: vi.fn().mockResolvedValue(true),
    toObject() {
      return {
        _id: this._id,
        email: this.email,
        username: this.username,
        nombres: this.nombres,
        apellidos: this.apellidos,
        provincia: this.provincia,
        avatar: this.avatar,
        redes: this.redes
      }
    }
  }
  Usuarios.findById.mockResolvedValueOnce(usuarioBDD)
  Usuarios.findOne.mockResolvedValue(null)

  const req = mockReq(
    { nombres: 'Bench Actualizado', provincia: 'Guayas', redes: { instagram: 'benchuser' } },
    { id: 'user-bench-update' }
  )
  const res = mockRes()

  await usuarioController.actualizarPerfil(req, res)
})
