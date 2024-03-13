import { Controller, Post, Get, Middleware } from "@overnightjs/core"
import { Response, Request } from "express"
import { BaseController } from '.'
import { userRepository } from "../repositories"


@Controller('api/users')
export class UserController extends BaseController {
    constructor(private userRepository: userRepository) {
        super()
    }

    @Post('register')
    public async create(req: Request, res: Response): Promise<void> {
        try {
            const newUser = await this.userRepository.create(req.body)
            res.status(201).send({ newUser, token: newUser.getToken() })
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
        const isPasswordCorrect = await user.comparePasswords(req.body.password)
        if (!isPasswordCorrect) {
            return this.sendErrorResponse(res, { code: 401, message: 'Password not correct' })
        }
        const token = user.getToken()

        return res.send({ ...user, ...{ token } })
    }

}