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
            const AllProperty = await this.propertyRepository.find({userId: req.user?.id})
            return res.status(StatusCodes.OK).send({AllProperty, count: AllProperty.length})
        } catch (error) {
            logger.error(error)
            return this.sendErrorResponse(res, { code: 500, message: 'Something went wrong' })
        }
    }
}