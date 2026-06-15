import { describe, it, expect, bench } from 'vitest'
import { calcularEdad } from './calcularEdad.js'

describe('calcularEdad', () => {
  it('debe calcular la edad correcta para una fecha pasada', () => {
    const fecha = new Date('1990-01-01')
    const hoy = new Date()
    let edadEsperada = hoy.getFullYear() - fecha.getFullYear()
    if (hoy.getMonth() < fecha.getMonth() || (hoy.getMonth() === fecha.getMonth() && hoy.getDate() < fecha.getDate())) {
      edadEsperada -= 1
    }

    const edad = calcularEdad('1990-01-01')
    expect(edad).toBe(edadEsperada)
  })

  it('debe restar un año si no ha pasado el cumpleaños', () => {
    const fechaProxima = new Date()
    fechaProxima.setFullYear(fechaProxima.getFullYear() - 25)
    fechaProxima.setMonth(fechaProxima.getMonth() + 1)
    const edad = calcularEdad(fechaProxima.toISOString())
    expect(edad).toBe(24)
  })

  bench('rendimiento de calcularEdad', () => {
    calcularEdad('2000-06-14')
  })
})
