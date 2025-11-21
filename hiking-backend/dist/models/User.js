"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const image_model_1 = __importDefault(require("./image.model"));
const User = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (email) => {
                return /\S+@\S+\.\S+/.test(email);
            },
            message: 'Invalid email address',
        },
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: (password) => {
                return password.length >= 8;
            },
            message: 'Password must be at least 8 characters long',
        },
    },
    description: {
        type: String,
        default: null
    },
    profileImg: {
        type: image_model_1.default,
        // default: null,
    },
    age: {
        type: Number,
        min: [1, 'Age cannot be less than 1'],
        max: [150, 'Age cannot be greater than 150'],
        default: null
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        default: null
    },
    location: {
        type: String,
        default: null
    },
    availability: {
        type: String,
        default: null
    },
    skillLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: null
    },
    interests: {
        type: [String],
        default: null
    },
    phoneNumber: {
        type: String,
        default: null
    },
    socialMedia: {
        facebook: {
            type: String,
            default: null
        },
        twitter: {
            type: String,
            default: null
        },
        instagram: {
            type: String,
            default: null
        },
    },
    equipment: {
        type: [String],
        default: null
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    trailFavorites: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Trail',
        },
    ],
    hikeBuddy: {
        type: Boolean,
        default: false,
        validate: {
            validator: (value) => {
                return typeof value === 'boolean';
            },
            message: 'hikeBuddy must be a boolean value',
        },
    },
    pastTrails: [
        {
            name: String,
            country: String,
            emoji: String,
            date: String,
            notes: String,
            position: {
                lat: String,
                lng: String,
            },
            images: {
                type: [image_model_1.default],
            },
        },
    ],
    eventsAttending: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Event'
        }],
    reminders: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Reminder'
        }],
    blogPosts: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Blogs'
        }],
    cart: {
        type: [{
                productId: {
                    type: Number,
                    required: true
                },
                name: {
                    type: String,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                },
                imageUrl: {
                    type: String,
                    required: true
                },
                quantity: {
                    type: Number,
                    default: 1,
                    min: 1
                },
                addedAt: {
                    type: Date,
                    default: Date.now
                }
            }],
        default: []
    }
});
const UserModel = mongoose_1.default.model('User', User);
exports.default = UserModel;
//# sourceMappingURL=User.js.map