import jwt from 'jsonwebtoken'
import config from 'config'
import bcrypt from 'bcrypt'

export const getToken = function(id: string, name: string) {
    const token = jwt.sign({id, name}, config.get('App.token.jwt_secret') as string, {expiresIn: config.get('App.token.jwt_lifetime')})
    return token
}

export const comparePasswords = async function(candidatePassword: string, userPassword: string) {
    const isMatch = await bcrypt.compare(candidatePassword, userPassword)
    return isMatch
}