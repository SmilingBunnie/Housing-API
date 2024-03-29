import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from 'config'
import logger from "../logger";


export function authMiddleware( req: Partial<Request>, res: Partial<Response>, next: NextFunction): Response | undefined {
    const authHeader = req.headers?.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status?.(401).send({ code: 401, error: 'Authentication invalid' })
    }

    const token = authHeader?.split(' ')[1]

    try {
        const decoded = jwt.verify(token as string, config.get('App.token.jwt_secret')) as JwtPayload
        const { id, name } = decoded
        req.user = { id, name }
        next()
    } catch (error) {
        if (error instanceof Error) {
            logger.warn(`error: ${error.message}`)
            return res.status?.(401).send({ code: 401, error: error.message })
        } else {
            logger.warn(`error: Unknown authentication error`)
            return res.status?.(401).send({ code: 401, error: 'Unknown authentication error' })
        }
    }
}

