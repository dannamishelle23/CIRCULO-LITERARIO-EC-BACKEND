import { bench, vi, beforeEach } from 'vitest'

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

beforeEach(() => {
  vi.clearAllMocks()
})

bench('performance de registro auth_controller', async () => {
  Usuarios.findOne.mockResolvedValueOnce(null)
  const req = mockReq({
    email: 'benchmark@example.com',
    username: 'benchmark_user',
    password: 'Abc123!@',
    nombres: 'Bench',
    apellidos: 'User',
    fechaNacimiento: '2000-01-01',
    provincia: 'Pichincha'
  })
  const res = mockRes()
  await authController.registro(req, res)
})

bench('performance de login auth_controller', async () => {
  const usuario = {
    confirmEmail: true,
    estadoUsuario: 'Activo',
    nombres: 'Benchmark',
    apellidos: 'User',
    provincia: 'Pichincha',
    username: 'benchmark_user',
    email: 'benchmark@example.com',
    rol: 'Usuario',
    avatar: 'avatar-url',
    _id: 'user-id',
    matchPassword: vi.fn().mockResolvedValue(true)
  }
  Usuarios.findOne.mockReturnValueOnce({ select: vi.fn().mockResolvedValue(usuario) })

  const req = mockReq({ identifier: 'benchmark@example.com', password: 'Abc123!@' })
  const res = mockRes()
  await authController.login(req, res)
})
