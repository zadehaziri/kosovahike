"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Trail = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'moderate', 'hard'],
        required: true
    },
    length: {
        type: String,
        required: true
    },
    elevationGain: {
        type: Number
    },
    duration: {
        type: Number
    },
    routeType: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    },
    description: {
        type: String
    },
    photos: {
        type: [String],
        required: true,
    },
    keyFeatures: {
        type: [String]
    },
    tags: {
        type: [String]
    },
    reviews: [{
            user: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'User'
            },
            rating: {
                type: Number,
                required: true,
                min: 1,
                max: 5
            },
            comment: {
                type: String,
                required: true,
            }
        }],
    events: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Event'
        }]
});
const TrailModel = mongoose_1.default.model("Trail", Trail);
exports.default = TrailModel;
//# sourceMappingURL=Trail.js.map