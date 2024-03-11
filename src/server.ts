import http from 'http'
import { Server } from '@overnightjs/core'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { Application } from 'express-serve-static-core'
import * as database from './database'
import logger from './logger'

export class ServerSetup extends Server{
    private server?: http.Server
    private port: number

    constructor(port: number = 3000) {
        super()
        this.port = port
    }

    public async initializeConnections(): Promise<void> {
        //this.initializeMiddleware()
        await this.databaseSetup()
        //this.InitializeErrorHandler()
    }

    private initializeMiddleware(): void {
        this.app.use(bodyParser.json())
        this.app.use(helmet())
        this.app.use(cors({origin: '*'}))
        this.app.use(morgan('dev'))
    }

    private InitializeErrorHandler(): void {
        this.app.use()
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
}