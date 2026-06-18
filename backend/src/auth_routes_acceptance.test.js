import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'

vi.mock('./models/Usuarios.js', () => {
  const mockFindOne = vi.fn()
  const Usuarios = vi.fn(function (data) {
    this.email = data.email
    this.username = data.username
    this.password = data.password
    this.confirmEmail = data.confirmEmail ?? false
    this.estadoUsuario = data.estadoUsuario ?? 'Activo'
    this.token = data.token ?? null
    this.encryptPassword = vi.fn().mockResolvedValue('hashed-password')
    this.createToken = vi.fn().mockReturnValue('token123')
    this.save = vi.fn().mockResolvedValue(this)
  })
  Usuarios.findOne = mockFindOne
  return { default: Usuarios }
})

vi.mock('./helpers/sendMail.js', () => ({
  sendMailToRegister: vi.fn().mockResolvedValue(true),
  sendMailToRecoveryPassword: vi.fn().mockResolvedValue(true)
}))

vi.mock('./middlewares/JWT.js', () => ({
  crearTokenJWT: vi.fn().mockReturnValue('jwt-token-123'),
  verificarTokenJWT: vi.fn((req, res, next) => next())
}))

import app from './server.js'
import Usuarios from './models/Usuarios.js'

const mockRequest = request(app)

describe('Rutas auth - aceptación', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('POST /api/auth/registro retorna 200 con usuario registrado cuando datos válidos', async () => {
    Usuarios.findOne.mockResolvedValueOnce(null)

    const response = await mockRequest
      .post('/api/auth/registro')
      .send({
        nombres: 'Carlos',
        apellidos: 'Gómez',
        fechaNacimiento: '2000-01-01',
        provincia: 'Pichincha',
        email: 'carlos@example.com',
        username: 'carlos_gomez',
        password: 'Abc123!@'
      })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      msg: 'Usuario registrado. Revisa tu correo para confirmar tu cuenta.'
    })
  })

  it('POST /api/auth/login retorna 200 con datos de usuario cuando credenciales son válidas', async () => {
    const usuarioValido = {
      confirmEmail: true,
      estadoUsuario: 'Activo',
      nombres: 'Carlos',
      apellidos: 'Gómez',
      provincia: 'Pichincha',
      username: 'carlos_gomez',
      email: 'carlos@example.com',
      rol: 'Usuario',
      avatar: 'avatar-url',
      _id: 'user-id',
      matchPassword: vi.fn().mockResolvedValue(true)
    }

    Usuarios.findOne.mockReturnValueOnce({ select: vi.fn().mockResolvedValue(usuarioValido) })

    const response = await mockRequest
      .post('/api/auth/login')
      .send({ identifier: 'carlos@example.com', password: 'Abc123!@' })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      msg: 'Inicio de sesión exitoso.',
      usuario: {
        _id: 'user-id',
        token: 'jwt-token-123',
        nombres: 'Carlos',
        apellidos: 'Gómez',
        provincia: 'Pichincha',
        username: 'carlos_gomez',
        email: 'carlos@example.com',
        rol: 'Usuario',
        avatar: 'avatar-url'
      }
    })
  })

  it('GET /api/auth/confirmar/:token retorna 200 si el token es válido y la cuenta se confirma', async () => {
    const usuarioConToken = {
      email: 'confirm@example.com',
      username: 'confirm_user',
      confirmEmail: false,
      token: 'token123',
      save: vi.fn().mockResolvedValue(true)
    }
    Usuarios.findOne.mockResolvedValueOnce(usuarioConToken)

    const response = await mockRequest.get('/api/auth/confirmar/token123')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      msg: '¡Cuenta confirmada exitosamente! Ya puedes iniciar sesión.',
      usuario: {
        email: 'confirm@example.com',
        username: 'confirm_user',
        confirmEmail: true
      }
    })
    expect(usuarioConToken.save).toHaveBeenCalled()
  })
})
