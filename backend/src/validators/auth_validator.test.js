import { describe, it, expect } from 'vitest'
import { validationResult } from 'express-validator'
import { validarRegistro, validarLogin } from './auth_validator.js'

const runValidators = async (validators, req) => {
  for (const validator of validators) {
    await validator.run(req)
  }
  return validationResult(req)
}

describe('auth_validator', () => {
  it('validarRegistro debe permitir datos válidos', async () => {
    const req = {
      body: {
        nombres: 'Juan',
        apellidos: 'Pérez',
        fechaNacimiento: '2000-01-01',
        provincia: 'Pichincha',
        email: 'juan@example.com',
        username: 'juan_perez',
        password: 'Abcdef1!'
      }
    }

    const result = await runValidators(validarRegistro, req)
    expect(result.isEmpty()).toBe(true)
  })

  it('validarRegistro debe rechazar usuario inválido y contraseña débil', async () => {
    const req = {
      body: {
        nombres: 'Juan',
        apellidos: 'Pérez',
        fechaNacimiento: '2015-01-01',
        provincia: 'Pichincha',
        email: 'juan@example.com',
        username: '_testuser',
        password: 'weak'
      }
    }

    const result = await runValidators(validarRegistro, req)
    expect(result.isEmpty()).toBe(false)
    const errors = result.array().map((error) => error.msg)
    expect(errors).toContain('Debes tener al menos 13 años.')
    expect(errors).toContain('No puede iniciar o terminar con _')
    expect(errors).toContain('Debe tener entre 8 y 30 caracteres.')
  })

  it('validarLogin debe rechazar credenciales vacías', async () => {
    const req = { body: { identifier: '', password: '' } }
    const result = await runValidators(validarLogin, req)
    expect(result.isEmpty()).toBe(false)
    const errors = result.array().map((error) => error.msg)
    expect(errors).toContain('Debes ingresar usuario o correo.')
    expect(errors).toContain('La contraseña es obligatoria.')
  })
})
