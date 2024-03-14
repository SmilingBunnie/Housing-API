import { DefaultMongoDBRepository } from "./defaultMongoDBRepository";
import { Property } from "../models/property";
import { PropertyRepository } from ".";

export class PropertyMongoDBRepository
extends DefaultMongoDBRepository<Property>
implements PropertyRepository {
    constructor(propertyModel = Property) {
        super(propertyModel)
    }

    async findAllPropertiesForUser(userId: string) {
        return await this.find({userId})
    }
}