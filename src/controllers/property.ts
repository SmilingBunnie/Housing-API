import { Controller, Post, Get, Delete, Put, Patch, Middleware } from "@overnightjs/core";
import { Response, Request } from "express";
import { BaseController } from ".";
import { authMiddleware } from "../middleware/auth";
import { PropertyRepository } from "../repositories";
import { StatusCodes } from "http-status-codes";
import logger from "../logger";

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

    @Get(':id')
    @Middleware(authMiddleware)
    public async getSingleProperty(req: Request, res: Response): Promise<Response> {
        try {
            if (!req.user?.id) {
                logger.error('Missing userId');
                return this.sendErrorResponse(res, { code: 500, message: 'Something went wrong' })
            }
            const id  = req.params.id
            const property = await this.propertyRepository.findOneById(id)
            return res.status(StatusCodes.OK).send({ property })
        } catch (error) {
            logger.error(error)
            return this.sendErrorResponse(res, { code: 500, message: 'Something went wrong' })
        }
    }

    @Patch(':id')
    @Middleware(authMiddleware)
    public async updateProperty(req: Request, res: Response): Promise<Response> {
        try {
            if (!req.user?.id) {
                logger.error('Missing userId');
                return this.sendErrorResponse(res, { code: 500, message: 'Something went wrong' })
            }
            const id = req.params.id
            const property = await this.propertyRepository.findByIdAndUpdate({_id: id}, req.body, {new: true, runValidators: true })
            return res.status(StatusCodes.CREATED).send({ property })
        } catch (error) {
            logger.error(error)
            return this.sendErrorResponse(res, { code: 500, message: 'Something went wrong' })
        }
    }

    @Post('')
    @Middleware(authMiddleware)
    public async createProperty(req: Request, res: Response): Promise<Response> {
        try {
            const property = await this.propertyRepository.create({ ...req.body, userId: req.user?.id })
            return res.status(StatusCodes.CREATED).send({property})
        } catch (error) {
            logger.error(error)
            return this.sendErrorResponse(res, { code: 500, message: 'Something went wrong' })
        }
    }

    @Delete(':id')
    @Middleware(authMiddleware)
    public async deleteProperty(req: Request, res: Response): Promise<Response> {
        try {
            if (!req.user?.id) {
                logger.error('Missing userId');
                this.sendErrorResponse(res, { code: 500, message: 'Something went wrong' })
            }
            const id = req.params.id
            await this.propertyRepository.findOneAndDelete({id, userId: req.user?.id})
            return res.status(StatusCodes.OK).send('Deleted')
        } catch (error) {
            logger.error(error)
            return this.sendErrorResponse(res, { code: 500, message: 'Something went wrong' })
        }
    }
}