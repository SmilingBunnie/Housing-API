import { Controller, Post, Get, Middleware } from "@overnightjs/core"
import { Response, Request } from "express"
import { BaseController } from '.'
import { UserRepository } from "../repositories"
import { getToken, comparePasswords } from "../services/auth"
import logger from "../logger"


@Controller('api/users')
export class UserController extends BaseController {
    constructor(private userRepository: UserRepository) {
        super()
    }

    @Get('test')
    public test(req: Request, res: Response): void {
        try {
            res.status(200).send('Hello World')
        } catch (error) {
            this.sendCreateUpdateErrorResponse(res, error)
        }
    }

    @Post('register')
    public async create(req: Request, res: Response): Promise<void> {
        try {
            const newUser = await this.userRepository.create(req.body)
            const {id, name} = newUser
            res.status(201).send({ newUser, token: getToken(id, name) })
        } catch (error) {
            this.sendCreateUpdateErrorResponse(res, error)
        }
    }

    @Post('login')
    public async authenticate(req: Request, res: Response): Promise<Response> {
        const user = await this.userRepository.findOneByEmail(req.body.email)
        if (!user) {
            return this.sendErrorResponse(res, {
                code: 401,
                message: 'User not found',
                description: 'Try verifying your email address'
            })
        }
        const {id, name, password} = user
        const isPasswordCorrect = await comparePasswords(req.body.password, password)
        if (!isPasswordCorrect) {
            return this.sendErrorResponse(res, { code: 401, message: 'Password not correct' })
        }
        const token = getToken(id, name)

        return res.send({ ...user, ...{ token } })
    }

}