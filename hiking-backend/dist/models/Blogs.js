"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const image_model_1 = __importDefault(require("./image.model"));
const Blogs = new mongoose_1.default.Schema({
    date: {
        type: Date,
        default: Date.now,
        required: true,
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    authorName: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
    },
    images: {
        type: [image_model_1.default],
    },
    seenCount: {
        type: Number,
        default: 0,
    },
});
const BlogsModel = mongoose_1.default.model('Blogs', Blogs);
exports.default = BlogsModel;
//# sourceMappingURL=Blogs.js.map