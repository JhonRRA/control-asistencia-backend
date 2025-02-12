import { CustomError } from '@utils/errors'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import { token } from 'morgan'
import config from 'src/config'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createAccessToken(payload: string | object | Buffer): Promise<any> {
  const secretToken = config.secretToken

  if (typeof secretToken !== 'string') throw new CustomError({ message: 'Secret Token no es una cadena', status: 500 })

  return await new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jwt.sign(payload, secretToken, (err: any, token: any) => {
      if (err !== null) reject(err)
      resolve(token)
    })
  })
}

// Llamada de prueba a la función createAccessToken
// Esto genera un token cuando se inicializa el servidor, lo cual puede ser innecesario y generar ruido en los logs.
// Si es necesario para pruebas, se recomienda moverlo a un archivo de test o ejecutarlo manualmente en desarrollo.

/*
createAccessToken({ id: '111', role: 'ADMINISTRATOR' }).then((token) => {
  console.log('🚀 ~ file: jwt.ts:11 ~ createManualToken ~ token:', token)
})
*/

export const verifyAndDecodeAccessToken = (
  token: string,
): Partial<JwtPayload> & {
  id: string
  role: string
} => {
  const secretToken = config.secretToken

  if (typeof secretToken !== 'string') throw new CustomError({ message: 'Secret Token no es una cadena', status: 500 })

  return jwt.verify(token, secretToken) as Partial<JwtPayload> & {
    id: string
    role: string
  }
}
