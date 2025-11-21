"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogsController = void 0;
const Blogs_1 = __importDefault(require("../models/Blogs"));
const User_1 = __importDefault(require("../models/User"));
class BlogsController {
    getBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blogs = yield Blogs_1.default.find();
                return blogs;
            }
            catch (error) {
                console.error('Error:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
    getBlogById(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blog = yield Blogs_1.default.findById(blogId);
                return blog;
            }
            catch (error) {
                console.error('Error:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
    deleteBlog(blogId, authorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedBlog = yield Blogs_1.default.findOneAndDelete({ _id: blogId, author: authorId });
                if (!deletedBlog) {
                    throw new Error('Blog not found or you are not authorized to delete this blog');
                }
                return deletedBlog;
            }
            catch (error) {
                console.error('Error:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
    saveBlog(authorId, blogData, images) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const imageObjects = images.map((image) => ({
                    name: image.filename,
                    type: image.mimetype,
                }));
                const newBlogData = Object.assign(Object.assign({}, blogData), { author: authorId, images: imageObjects });
                const newBlog = yield Blogs_1.default.create(newBlogData);
                yield User_1.default.findByIdAndUpdate(authorId, { $push: { blogPosts: newBlog._id } });
                return newBlog;
            }
            catch (error) {
                console.error('Error adding blog:', error);
                throw new Error('Failed to add blog');
            }
        });
    }
    updateBlog(blogId, updatedFields) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedBlog = yield Blogs_1.default.findByIdAndUpdate(blogId, updatedFields, { new: true });
                if (!updatedBlog) {
                    throw new Error('Blog not found');
                }
                return updatedBlog;
            }
            catch (error) {
                console.error('Error:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
}
exports.BlogsController = BlogsController;
//# sourceMappingURL=blogs.js.map