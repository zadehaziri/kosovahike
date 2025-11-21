"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Reviews = new mongoose_1.default.Schema({
    rating: {
        type: Number,
        required: true
    },
    trail: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Trail',
        required: true
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    date: {
        type: Date,
    },
});
const ReviewsModel = mongoose_1.default.model("Reviews", Reviews);
exports.default = ReviewsModel;
//# sourceMappingURL=Review.js.map