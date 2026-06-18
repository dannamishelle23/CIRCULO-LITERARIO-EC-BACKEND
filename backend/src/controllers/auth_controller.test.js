import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../models/Usuarios.js', () => {
  const mockFindOne = vi.fn()
  const Usuarios = vi.fn(function (data) {
    this.email = data.email
    this.username = data.username
    this.password = null
    this.encryptPassword = vi.fn().mockResolvedValue('hashed-password')
    this.createToken = vi.fn().mockReturnValue('token123')
    this.save = vi.fn().mockResolvedValue(this)
    return this
  })
  Usuarios.findOne = mockFindOne
  return { default: Usuarios }
})

vi.mock('../helpers/sendMail.js', () => ({
  sendMailToRegister: vi.fn().mockResolvedValue(true),
  sendMailToRecoveryPassword: vi.fn().mockResolvedValue(true)
}))

vi.mock('../middlewares/JWT.js', () => ({
  crearTokenJWT: vi.fn().mockReturnValue('jwt-token-123')
}))

import * as authController from './auth_controller.js'
import Usuarios from '../models/Usuarios.js'
import { sendMailToRegister } from '../helpers/sendMail.js'
import { crearTokenJWT } from '../middlewares/JWT.js'

const mockReq = (body = {}, params = {}) => ({
  body,
  params
})

const mockRes = () => {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

describe('auth_controller', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('registro debe devolver 400 si el usuario ya existe', async () => {
    Usuarios.findOne.mockResolvedValueOnce({ email: 'existe@example.com' })

    const req = mockReq({
      email: 'existe@example.com',
      username: 'usuario1',
      password: 'Abc123!@',
      nombres: 'Nombre',
      apellidos: 'Apellido',
      fechaNacimiento: '2000-01-01',
      provincia: 'Pichincha'
    })
    const res = mockRes()

    await authController.registro(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      msg: 'El correo o el nombre del usuario ya se encuentran registrados.'
    })
  })

  it('registro debe crear usuario y enviar correo cuando no existe', async () => {
    Usuarios.findOne.mockResolvedValueOnce(null)

    const req = mockReq({
      email: 'nuevo@example.com',
      username: 'nuevo_usuario',
      password: 'Abc123!@',
      nombres: 'Nuevo',
      apellidos: 'Usuario',
      fechaNacimiento: '2000-01-01',
      provincia: 'Pichincha'
    })
    const res = mockRes()

    await authController.registro(req, res)

    expect(Usuarios.findOne).toHaveBeenCalledWith({
      $or: [{ email: 'nuevo@example.com' }, { username: 'nuevo_usuario' }]
    })
    expect(sendMailToRegister).toHaveBeenCalledWith('nuevo@example.com', 'token123')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Usuario registrado. Revisa tu correo para confirmar tu cuenta.'
    })
  })

  it('login debe devolver 401 si el usuario no existe', async () => {
    Usuarios.findOne.mockReturnValueOnce({ select: vi.fn().mockResolvedValue(null) })

    const req = mockReq({ identifier: 'noexiste', password: 'Abc123!@' })
    const res = mockRes()

    await authController.login(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Correo, nombre de usuario o contraseña incorrectos.'
    })
  })

  it('login debe devolver 403 si la cuenta no está confirmada', async () => {
    const usuario = {
      confirmEmail: false,
      estadoUsuario: 'Activo',
      matchPassword: vi.fn().mockResolvedValue(true)
    }
    Usuarios.findOne.mockReturnValueOnce({ select: vi.fn().mockResolvedValue(usuario) })

    const req = mockReq({ identifier: 'test@example.com', password: 'Abc123!@' })
    const res = mockRes()

    await authController.login(req, res)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Tu cuenta no ha sido verificada. Revisa tu correo electrónico para confirmar tu cuenta antes de iniciar sesión.'
    })
  })

  it('login debe devolver 403 si la cuenta no está disponible', async () => {
    const usuario = {
      confirmEmail: true,
      estadoUsuario: 'Suspendido',
      matchPassword: vi.fn().mockResolvedValue(true)
    }
    Usuarios.findOne.mockReturnValueOnce({ select: vi.fn().mockResolvedValue(usuario) })

    const req = mockReq({ identifier: 'test@example.com', password: 'Abc123!@' })
    const res = mockRes()

    await authController.login(req, res)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Tu cuenta no está disponible.'
    })
  })

  it('login debe devolver 401 si la contraseña es incorrecta', async () => {
    const usuario = {
      confirmEmail: true,
      estadoUsuario: 'Activo',
      matchPassword: vi.fn().mockResolvedValue(false)
    }
    Usuarios.findOne.mockReturnValueOnce({ select: vi.fn().mockResolvedValue(usuario) })

    const req = mockReq({ identifier: 'test@example.com', password: 'Abc123!@' })
    const res = mockRes()

    await authController.login(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Correo, nombre de usuario o contraseña incorrectos.'
    })
  })

  it('login debe devolver 200 y token si las credenciales son válidas', async () => {
    const usuario = {
      confirmEmail: true,
      estadoUsuario: 'Activo',
      nombres: 'Juan',
      apellidos: 'Pérez',
      provincia: 'Pichincha',
      username: 'juan_perez',
      email: 'juan@example.com',
      rol: 'Usuario',
      avatar: 'avatar-url',
      _id: 'user-id',
      matchPassword: vi.fn().mockResolvedValue(true)
    }
    Usuarios.findOne.mockReturnValueOnce({ select: vi.fn().mockResolvedValue(usuario) })

    const req = mockReq({ identifier: 'juan@example.com', password: 'Abc123!@' })
    const res = mockRes()

    await authController.login(req, res)

    expect(crearTokenJWT).toHaveBeenCalledWith('user-id', 'Usuario')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Inicio de sesión exitoso.',
      usuario: {
        _id: 'user-id',
        token: 'jwt-token-123',
        nombres: 'Juan',
        apellidos: 'Pérez',
        provincia: 'Pichincha',
        username: 'juan_perez',
        email: 'juan@example.com',
        rol: 'Usuario',
        avatar: 'avatar-url'
      }
    })
  })
})
