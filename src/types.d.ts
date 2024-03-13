export {}

type User = {
    id: string
    name: string
}

declare module 'express-serve-static-core' {
    export interface Request extends http.IncomingMessage, Express.Request {
        user?: User
    }
}




/*interface User {
    id: string
    name: string
}

declare global {
    namespace Express {
        export interface Request {
            user?: {id: string }
        }
    }
}*/