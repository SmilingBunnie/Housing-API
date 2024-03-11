import mongoose from "mongoose"
import config, { IConfig } from 'config'
import logger from "./logger"


const database: IConfig = config.get('App.database')

export const connect = async (): Promise<void> => {
    await mongoose.connect(database.get('mongo_url'))
    logger.info('Connected to database')
}

export const close = (): Promise<void> => mongoose.connection.close()