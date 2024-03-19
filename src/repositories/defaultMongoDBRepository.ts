import logger from '../logger'
import { BaseModel } from '../models'
import { CUSTOM_VALIDATION } from '../models/user'
import { Error, Model } from 'mongoose'
import { FilterOptions, WithId } from '.'
import {
    DatabaseInternalError,
    DatabaseUnknownClientError,
    DatabaseValidationError,
    Repository
} from './repository'

export abstract class DefaultMongoDBRepository<T extends BaseModel> extends Repository<T> {
    constructor(private model: Model<T>) {
        super()
    }

    protected handleError(error: unknown): never {
        if (error instanceof Error.ValidationError) {
            const duplicatedKindErrors = Object.values(error.errors).filter(
                (err) =>
                err.name === 'ValidatorError' && err.kind === CUSTOM_VALIDATION.DUPLICATED
            );
            if (duplicatedKindErrors.length) {
                throw new DatabaseValidationError(error.message)
            }
            throw new DatabaseUnknownClientError(error.message)
        }
        throw new DatabaseInternalError('Something unexpected happened to the database')
    }

    async create(data: T) {
        try {
            const model = new this.model(data)
            const createdData = await model.save();
            return createdData.toJSON<WithId<T>>() as Promise<WithId<T>>;
        } catch (error) {
            this.handleError(error)
        }
    }

    async findById(params: FilterOptions) {
        try {
            const data = await this.model.findById(params)
            return data?.toJSON<WithId<T>>() as Promise<WithId<T>>
        } catch (error) {
            this.handleError(error)
        }
    }

    async findOne(params: FilterOptions) {
        try {
            const data = await this.model.findOne(params)
            return data?.toJSON<WithId<T>>() as Promise<WithId<T>>
        } catch (error) {
            this.handleError(error)
        }
    }
    async find(options: FilterOptions) {
        try {
            const data =  await this.model.find(options)
            return (data.map((d) => d.toJSON<WithId<T>>())) as unknown as Promise<WithId<T>[]>
        } catch (error) {
            this.handleError(error)
        }
    }

    async deleteAll() {
        await this.model.deleteMany({})
    }

    async findByIdAndUpdate(params: FilterOptions, body: FilterOptions, options: FilterOptions) {
        try {
            const data = await this.model.findByIdAndUpdate(params, body, options)
            return data?.toJSON<WithId<T>>() as Promise<WithId<T>>
        } catch (error) {
            this.handleError(error)
        }
    }

    async findOneAndDelete(options: FilterOptions) {
        await this.model.findOneAndDelete(options)
    }
}