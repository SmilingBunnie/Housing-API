import { Response } from "express";
import logger from "../logger";
import { DatabaseError, DatabaseUnknownClientError, DatabaseValidationError, DatabaseInternalError } from "../repositories/repository";
import ApiError, { APIError } from "../utils/errors/api-error";

interface HandleClientErrorsRes {
    code: number
    error: string
}

export abstract class BaseController {
    protected sendCreateUpdateErrorResponse(res: Response, error: unknown): void {
        if (
            error instanceof DatabaseValidationError || error instanceof DatabaseUnknownClientError
        ) {
            const clientErrors = this.handleClientErrors(error)
            logger.warn(`error: ${error.message}`)
            res.status(clientErrors.code).send(
                ApiError.format({code: clientErrors.code, message: clientErrors.error})
            )
        }else if (error instanceof DatabaseInternalError) {
            logger.error(`error: ${error.message}`)
            res.status(500).send(ApiError.format({code: 500, message: error.message}))
        } else {
            logger.error(`error: Something went wrong`)
            res.status(500).send(ApiError.format({code: 500, message: 'Something went wrong!'}))
        }
    }

    private handleClientErrors(error: DatabaseError): HandleClientErrorsRes {
        if (error instanceof DatabaseValidationError) {
            return { code: 409, error: error.message }
        }
        return { code: 400, error: error.message }
    }

    protected sendErrorResponse(res: Response, apiError: APIError): Response {
        return res.status(apiError.code).send(ApiError.format(apiError))
    }
}