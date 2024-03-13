import { User } from "../models/user"
import { Property } from "..//models/property"

export type FilterOptions = Record<string, unknown> // [key: string]: unknown

export type WithId<T> = { id: string } & T

export interface BaseRepository<T> {
    create(data: T): Promise<WithId<T>>
    findOne(params: FilterOptions): Promise<WithId<T> | undefined>
    find(params: FilterOptions): Promise<WithId<T>[]>
    findByIdAndUpdate(params: FilterOptions, body: FilterOptions, options: FilterOptions): Promise<WithId<T>>
    findOneAndDelete(params: FilterOptions): Promise<void>
    deleteAll(): Promise<void>
}

export interface PropertyRepository extends BaseRepository<Property> {
    findAllPropertiesForUser(userId: string): Promise<WithId<Property>[]>
}

export interface UserRepository extends BaseRepository<User> {
    findOneById(id: string): Promise<WithId<User> | undefined>
    findOneByEmail(email: string): Promise<WithId<User> | undefined>
}