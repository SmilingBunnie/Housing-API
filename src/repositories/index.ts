import { User } from "../models/user"
import { Property } from "..//models/property"

export type FilterOptions = Record<string, unknown> // [key: string]: unknown

export type WithId<T> = { id: string } & T

export interface BaseRepository<T> {
    create(data: T): Promise<WithId<T>>
    findOne(options: FilterOptions): Promise<WithId<T> | undefined>
    find(options: FilterOptions): Promise<WithId<T>[]>
    findByIdAndUpdate(options: FilterOptions): Promise<WithId<T>>
    findOneAndDelete(options: FilterOptions): Promise<void>
    deleteAll(): Promise<void>
}

export interface PropertyRepository extends BaseRepository<Property> {
    findAllPropertiesForUser(userId: string): Promise<WithId<Property>[]>
}

export interface userRepository extends BaseRepository<User> {
    findOneById(id: string): Promise<WithId<User> | undefined>
    findOneByEmail(email: string): Promise<WithId<User> | undefined>
}