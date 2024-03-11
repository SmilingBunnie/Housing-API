import pino from "pino";
import config, { IConfig } from 'config'


const logger: IConfig = config.get('App.logger')
export default pino({
    enabled: logger.get('enabled'),
    level: logger.get('level')
})