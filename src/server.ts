import http from 'http'
import { Server } from '@overnightjs/core'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { Application } from 'express-serve-static-core'
import * as database from './database'
import logger from './logger'
import { PropertyController } from './controllers/property'
import { UserController } from './controllers/user'
import { UserMongoDBRepository } from './repositories/userMongoDBRepository'
import { PropertyMongoDBRepository } from './repositories/propertyMongoDBRepository'
import { apiErrorValidator } from './middleware/api-error-validator'

export class ServerSetup extends Server{
    private server?: http.Server
    private port: number

    constructor(port: number = 3000) {
        super()
        this.port = port
    }

    public async initializeConnections(): Promise<void> {
        this.initializeMiddleware()
        await this.databaseSetup()
        this.initializeControllers()
        this.InitializeErrorHandler()
    }

    private initializeMiddleware(): void {
        this.app.use(bodyParser.json())
        this.app.use(helmet())
        this.app.use(cors({origin: '*'}))
        this.app.use(morgan('dev'))
    }

    private InitializeErrorHandler(): void {
        this.app.use(apiErrorValidator)
    }

    public getApp(): Application {
        return this.app
    }

    private async databaseSetup(): Promise<void> {
        await database.connect()
    }

    public async close(): Promise<void> {
        await database.close()
        if (this.server) {
            await new Promise((resolve, reject) => {
                this.server?.close((err) => {
                    if (err) {
                        return reject(err)
                    }
                    resolve(true)
                })
            })
        }
    }

    public start(): void {
        this.server = this.app.listen(this.port, () => {
            logger.info('Server listening on port' + this.port)
        })
    }

    private initializeControllers(): void {
        const userController = new UserController(new UserMongoDBRepository());
        const propertyController = new PropertyController(new PropertyMongoDBRepository())
        this.addControllers([userController, propertyController])
    }
}