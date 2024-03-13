import bcrypt from 'bcrypt'
import mongoose, { Document } from 'mongoose'
import jwt from 'jsonwebtoken'
import config from 'config'
import logger from '../logger'
import { BaseModel } from '.'

export interface User extends BaseModel {
    name: string
    email: string
    password: string
    comparePasswords(CandidatePassword: string): boolean
    getToken(): string
}

export interface ExistingUser extends User {
    id: string
}

export enum CUSTOM_VALIDATION {
    DUPLICATED = 'DUPLICATED',
}

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide valid email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
    },
    }, {
        toJSON: {
            transform: (_, ret): void => {
                ret.id = ret._id.toString()
                delete ret._id
                delete ret._v
            }
        }
    })

    UserSchema.path('email').validate(
        async (email: string) => {
            const emailCount = mongoose.models.User.countDocuments({ email })
            return !emailCount
        },
        `${CUSTOM_VALIDATION.DUPLICATED}!! email`
    );

    UserSchema.pre<User & Document>('save', async function(): Promise<void> {
        if (!this.password || !this.isModified('password')) {
            return
        }
        try {
            const salt = await bcrypt.genSalt(10)
            this.password = await bcrypt.hash(this.password, salt)
        } catch (error) {
            logger.error(`Error hashing the user password ${this.name}`, error)
        }
    })

    UserSchema.methods.getToken = function() {
        const token = jwt.sign({id: this._id, name: this.name}, config.get('App.token.jwt_secret') as string, {expiresIn: config.get('App.token.jwt_lifetime')})
        return token
    }

    UserSchema.methods.comparePasswords = async function(candidatePassword: string) {
        const isMatch = await bcrypt.compare(candidatePassword, this.password)
        return isMatch
    }

    const User = mongoose.model<User>('User', UserSchema)

    export default User
