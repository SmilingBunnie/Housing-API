import { Controller, Post, Get, Middleware } from "@overnightjs/core";
import { Response, Request } from "express";
import { BaseController } from ".";
import { authMiddleware } from "../middleware/auth";
import { PropertyRepository } from "../repositories";
import { StatusCodes } from "http-status-codes";
import logger from "src/logger";

@Controller('api/property')
export class PropertyController extends BaseController {
    constructor(private propertyRepository: PropertyRepository) {
        super()
    }

    @Get('')
    @Middleware(authMiddleware)
    public async getAllProperty(req: Request, res: Response): Promise<Response> {
        try {
            if (!req.user?.id) {
                logger.error('Missing userId');
                return this.sendErrorResponse(res, { code: 500, message: 'Something went wrong' })
            }
            const allProperty = await this.propertyRepository.find({userId: req.user?.id})
            return res.status(StatusCodes.OK).send({allProperty, count: allProperty.length})
        } catch (error) {
            logger.error(error)
            return this.sendErrorResponse(res, { code: 500, message: 'Something went wrong' })
        }
    }

    public async getSingleProperty(req: Request, res: Response): Promise<Response> {
        try {
            const id  = req.params.id
            const property = await this.propertyRepository.findOne({ _id: id, userId: req.user?.id })
            return res.status(StatusCodes.OK).send({ property })
        } catch (error) {
            logger.error(error)
            return this.sendErrorResponse(res, { code: 500, message: 'Something went wrong' })
        }
    }
}