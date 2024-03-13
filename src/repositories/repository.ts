import { BaseRepository, FilterOptions, WithId } from "."

export class DatabaseError extends Error {
    constructor(message: string) {
        super(message)
    }
}

export class DatabaseValidatorError extends DatabaseError {}

export class DatabaseUnknownClientError extends DatabaseError {}

export class DatabaseInternalError extends DatabaseError {}

export abstract class Repository<T> implements BaseRepository<T> {
    public abstract create(data: T): Promise<WithId<T>>
    public abstract findOne(options: FilterOptions): Promise<WithId<T> | undefined>
    public abstract find(options: FilterOptions): Promise<WithId<T>[]>
    public abstract deleteAll(): Promise<void>
    public abstract findByIdAndUpdate(options: FilterOptions): Promise<WithId<T>>
    public abstract findOneAndDelete(options: FilterOptions): Promise<void>
}
