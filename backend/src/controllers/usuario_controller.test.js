import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../models/Usuarios.js', () => {
  const mockFindById = vi.fn()
  const mockFindOne = vi.fn()
  const mockFind = vi.fn()

  const createSelectQuery = (result) => ({
    select: vi.fn().mockResolvedValue(result)
  })

  const createFindQuery = (result) => ({
    select: vi.fn().mockReturnThis(),
    populate: vi.fn().mockResolvedValue(result)
  })

  const Usuarios = vi.fn(function (data) {
    Object.assign(this, data)
    this.save = vi.fn().mockResolvedValue(this)
    this.matchPassword = vi.fn()
    this.encryptPassword = vi.fn().mockResolvedValue('hashed-password')
    return this
  })

  Usuarios.findById = mockFindById
  Usuarios.findOne = mockFindOne
  Usuarios.find = mockFind
  Usuarios.createSelectQuery = createSelectQuery
  Usuarios.createFindQuery = createFindQuery
  Usuarios.prototype.encryptPassword = vi.fn().mockResolvedValue('hashed-password')

  return { default: Usuarios }
})

vi.mock('../models/Obras.js', () => ({ default: { find: vi.fn() } }))
vi.mock('../helpers/sendMail.js', () => ({ sendMailToCreateModerator: vi.fn().mockResolvedValue(true) }))
vi.mock('../helpers/uploadCloudinary.js', () => ({ subirImagenCloudinary: vi.fn().mockResolvedValue({ secure_url: 'https://cloudinary.test/avatar.jpg', public_id: 'cloud-avatar-id' }) }))
vi.mock('cloudinary', () => ({ v2: { uploader: { destroy: vi.fn().mockResolvedValue(true) } } }))

import * as usuarioController from './usuario_controller.js'
import Usuarios from '../models/Usuarios.js'
import Obra from '../models/Obras.js'
import { sendMailToCreateModerator } from '../helpers/sendMail.js'
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

describe('usuario_controller', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('perfil devuelve 401 si no hay usuarioHeader', () => {
    const req = mockReq()
    const res = mockRes()

    usuarioController.perfil(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ msg: 'No autorizado.' })
  })

  it('perfil devuelve datos cuando existe usuarioHeader', () => {
    const usuarioHeader = {
      _id: 'user-1',
      nombres: 'Juan',
      apellidos: 'Pérez',
      email: 'juan@example.com',
      rol: 'Usuario',
      avatar: 'avatar-url',
      token: 'token-123',
      confirmEmail: true,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-02',
      __v: 0
    }
    const req = mockReq({}, {}, usuarioHeader)
    const res = mockRes()

    usuarioController.perfil(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      _id: 'user-1',
      nombres: 'Juan',
      apellidos: 'Pérez',
      email: 'juan@example.com',
      rol: 'Usuario',
      avatar: 'avatar-url'
    })
  })

  it('perfilPublicoUsuario devuelve 404 cuando no existe el usuario', async () => {
    Usuarios.findById.mockImplementationOnce(() => ({
      select: vi.fn().mockResolvedValueOnce(null)
    }))

    const req = mockReq({}, { id: 'user-2' })
    const res = mockRes()

    await usuarioController.perfilPublicoUsuario(req, res)

    expect(Usuarios.findById).toHaveBeenCalledWith('user-2')
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ ok: false, msg: 'Usuario no encontrado.' })
  })

  it('perfilPublicoUsuario devuelve usuario y obras cuando existe', async () => {
    const usuario = {
      _id: 'user-2',
      nombres: 'Ana',
      apellidos: 'García'
    }
    const sortMock = vi.fn().mockResolvedValueOnce([{ _id: 'obra-1', titulo: 'Obra 1' }])
    const obraQuery = {
      select: vi.fn().mockReturnValueOnce({ sort: sortMock })
    }
    Obra.find.mockReturnValueOnce(obraQuery)
    Usuarios.findById.mockImplementationOnce(() => ({
      select: vi.fn().mockResolvedValueOnce(usuario)
    }))

    const req = mockReq({}, { id: 'user-2' })
    const res = mockRes()

    await usuarioController.perfilPublicoUsuario(req, res)

    expect(Usuarios.findById).toHaveBeenCalledWith('user-2')
    expect(obraQuery.select).toHaveBeenCalledWith('_id titulo portada sinopsis estado fechaPublicacion createdAt')
    expect(sortMock).toHaveBeenCalledWith({ createdAt: -1 })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ ok: true, usuario, obras: [{ _id: 'obra-1', titulo: 'Obra 1' }] })
  })

  it('actualizarPerfil devuelve 404 cuando el usuario no existe', async () => {
    Usuarios.findById.mockResolvedValueOnce(null)

    const req = mockReq({ nombres: 'Nuevo' }, { id: 'user-3' })
    const res = mockRes()

    await usuarioController.actualizarPerfil(req, res)

    expect(Usuarios.findById).toHaveBeenCalledWith('user-3')
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ msg: 'Usuario no encontrado.' })
  })

  it('actualizarPerfil devuelve 400 si no envían datos', async () => {
    const usuarioBDD = {
      _id: 'user-4',
      email: 'user4@example.com',
      username: 'user4',
      avatar: null,
      avatarID: null,
      save: vi.fn().mockResolvedValue(true)
    }
    Usuarios.findById.mockResolvedValueOnce(usuarioBDD)

    const req = mockReq({}, { id: 'user-4' })
    const res = mockRes()

    await usuarioController.actualizarPerfil(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ msg: 'Debes enviar al menos un campo para actualizar.' })
  })

  it('actualizarPerfil devuelve 400 si el email ya está en uso', async () => {
    const usuarioBDD = {
      _id: 'user-5',
      email: 'user5@example.com',
      username: 'user5',
      avatar: null,
      avatarID: null,
      save: vi.fn().mockResolvedValue(true)
    }
    Usuarios.findById.mockResolvedValueOnce(usuarioBDD)
    Usuarios.findOne.mockResolvedValueOnce({ email: 'otro@example.com' })

    const req = mockReq({ email: 'otro@example.com' }, { id: 'user-5' })
    const res = mockRes()

    await usuarioController.actualizarPerfil(req, res)

    expect(Usuarios.findOne).toHaveBeenCalledWith({ email: 'otro@example.com' })
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ msg: 'El correo ya se encuentra registrado.' })
  })

  it('actualizarPerfil devuelve 400 si el username ya está en uso', async () => {
    const usuarioBDD = {
      _id: 'user-6',
      email: 'user6@example.com',
      username: 'user6',
      avatar: null,
      avatarID: null,
      save: vi.fn().mockResolvedValue(true)
    }
    Usuarios.findById.mockResolvedValueOnce(usuarioBDD)
    Usuarios.findOne.mockResolvedValueOnce({ username: 'otro_usuario' })

    const req = mockReq({ username: 'otro_usuario' }, { id: 'user-6' })
    const res = mockRes()

    await usuarioController.actualizarPerfil(req, res)

    expect(Usuarios.findOne).toHaveBeenCalledWith({ username: 'otro_usuario' })
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ msg: 'El nombre de usuario ya existe.' })
  })

  it('actualizarPerfil actualiza el perfil correctamente', async () => {
    const usuarioBDD = {
      _id: 'user-7',
      email: 'user7@example.com',
      username: 'user7',
      nombres: 'Ana',
      apellidos: 'Torres',
      provincia: 'Pichincha',
      avatar: 'old-avatar.jpg',
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
      {
        nombres: 'Ana María',
        apellidos: 'Torres',
        provincia: 'Guayas',
        username: 'user7',
        email: 'user7@example.com',
        redes: { instagram: 'anatorres' }
      },
      { id: 'user-7' }
    )
    const res = mockRes()

    await usuarioController.actualizarPerfil(req, res)

    expect(usuarioBDD.save).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Perfil actualizado correctamente.',
      usuario: expect.objectContaining({
        _id: 'user-7',
        nombres: 'Ana María',
        provincia: 'Guayas',
        redes: expect.objectContaining({ instagram: 'anatorres' })
      })
    })
  })

  it('actualizarPassword devuelve 404 cuando el usuario no existe', async () => {
    Usuarios.findById.mockResolvedValueOnce(null)

    const req = mockReq({ passwordActual: 'Abc123!@', passwordNuevo: 'Nuevo123!' }, {}, { _id: 'user-8' })
    const res = mockRes()

    await usuarioController.actualizarPassword(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ msg: 'Usuario no encontrado.' })
  })

  it('actualizarPassword devuelve 400 cuando la contraseña actual es incorrecta', async () => {
    const usuarioBDD = {
      _id: 'user-9',
      matchPassword: vi.fn().mockResolvedValue(false)
    }
    Usuarios.findById.mockResolvedValueOnce(usuarioBDD)

    const req = mockReq({ passwordActual: 'wrong', passwordNuevo: 'Nuevo123!' }, {}, { _id: 'user-9' })
    const res = mockRes()

    await usuarioController.actualizarPassword(req, res)

    expect(usuarioBDD.matchPassword).toHaveBeenCalledWith('wrong')
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ msg: 'La contraseña actual no es correcta.' })
  })

  it('actualizarPassword devuelve 400 cuando la nueva contraseña es igual a la actual', async () => {
    const usuarioBDD = {
      _id: 'user-10',
      matchPassword: vi.fn().mockResolvedValue(true)
    }
    Usuarios.findById.mockResolvedValueOnce(usuarioBDD)

    const req = mockReq({ passwordActual: 'SamePass1!', passwordNuevo: 'SamePass1!' }, {}, { _id: 'user-10' })
    const res = mockRes()

    await usuarioController.actualizarPassword(req, res)

    expect(usuarioBDD.matchPassword).toHaveBeenNthCalledWith(1, 'SamePass1!')
    expect(usuarioBDD.matchPassword).toHaveBeenNthCalledWith(2, 'SamePass1!')
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ msg: 'La nueva contraseña no puede ser igual a la actual.' })
  })

  it('actualizarPassword actualiza la contraseña correctamente', async () => {
    const usuarioBDD = {
      _id: 'user-11',
      password: 'oldPass',
      matchPassword: vi.fn().mockResolvedValueOnce(true).mockResolvedValueOnce(false),
      encryptPassword: vi.fn().mockResolvedValue('new-hash'),
      save: vi.fn().mockResolvedValue(true)
    }
    Usuarios.findById.mockResolvedValueOnce(usuarioBDD)

    const req = mockReq({ passwordActual: 'OldPass1!', passwordNuevo: 'NewPass1!' }, {}, { _id: 'user-11' })
    const res = mockRes()

    await usuarioController.actualizarPassword(req, res)

    expect(usuarioBDD.encryptPassword).toHaveBeenCalledWith('NewPass1!')
    expect(usuarioBDD.save).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ msg: 'Contraseña actualizada correctamente.' })
  })

  it('registrarModerador crea un moderador cuando no hay email ni username duplicados', async () => {
    Usuarios.findOne.mockResolvedValueOnce(null)
    Usuarios.findOne.mockResolvedValueOnce(null)

    const saveMock = vi.fn().mockResolvedValue(true)
    const nuevoModerador = {
      save: saveMock,
      toObject: vi.fn().mockReturnValue({ _id: 'mod-1', email: 'mod@example.com', username: 'moduser' })
    }
    Usuarios.mockImplementationOnce(function (data) {
      Object.assign(this, data)
      return nuevoModerador
    })

    const req = mockReq(
      {
        nombres: 'Mod',
        apellidos: 'Test',
        fechaNacimiento: '1990-01-01',
        provincia: 'Pichincha',
        username: 'moduser',
        email: 'mod@example.com'
      },
      {},
      { _id: 'admin-1' }
    )
    const res = mockRes()

    await usuarioController.registrarModerador(req, res)

    expect(Usuarios.findOne).toHaveBeenCalledTimes(2)
    expect(sendMailToCreateModerator).toHaveBeenCalledWith('mod@example.com', 'moduser', expect.stringContaining('MOD-'))
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, emailSent: true }))
  })

  it('listarUsuarios devuelve la lista de usuarios activos y suspendidos', async () => {
    const usuarios = [{ _id: 'user-12', username: 'lector1' }]
    const query = {
      select: vi.fn().mockReturnThis(),
      populate: vi.fn().mockResolvedValue(usuarios)
    }
    Usuarios.find.mockReturnValueOnce(query)

    const req = mockReq()
    const res = mockRes()

    await usuarioController.listarUsuarios(req, res)

    expect(Usuarios.find).toHaveBeenCalledWith({ rol: 'Usuario', estadoUsuario: { $ne: 'Eliminado' } })
    expect(query.select).toHaveBeenCalledWith('-password -createdAt -updatedAt -__v -confirmEmail')
    expect(query.populate).toHaveBeenCalledWith('creadoPor', 'nombres')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Usuarios obtenidos correctamente',
      data: { usuarios }
    })
  })
})
