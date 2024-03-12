import mongoose, { Schema } from 'mongoose'
import { BaseModel } from '.'

export interface Property extends BaseModel {
    location: string
    longitude: number
    latitude: number
    type: string
    beds: number
    baths: number
    price: number
    userId: string
    yearBuilt: number
    hasLivingRoom: boolean
    hasBasement: boolean
    hasParking: boolean
    hasHeating: boolean
    hasAC: boolean
    gallery: string[]
}

export interface ExistingProperty extends Property {
    id: string
}

const propertySchema = new mongoose.Schema(
    {
        location: {
            type: String,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        beds: {
            type: Number,
            required: true
        },
        baths: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        yearBuilt: Number,
        hasLivingRoom: Boolean,
        hasBasement: Boolean,
        hasParking: Boolean,
        hasHeating: Boolean,
        hasAC: Boolean,
        gallery: [String]
    },
    {
        toJSON: {
            transform: (_, ret): void => {
                ret.id = ret._id.toString()
                delete ret._id
                delete ret._v
            }
        }
    }
)

const Property = mongoose.model<Property>('Property', propertySchema)

export default Property