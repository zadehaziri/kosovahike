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
exports.ReviewController = void 0;
const Review_1 = __importDefault(require("../models/Review"));
class ReviewController {
    getReviews() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reviews = yield Review_1.default.find();
                return reviews;
            }
            catch (error) {
                console.error('Error:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
    getReviewById(reviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const review = yield Review_1.default.findById(reviewId);
                return review;
            }
            catch (error) {
                console.error('Error:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
    saveReview(reviewData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newReview = yield Review_1.default.create(reviewData);
                return newReview;
            }
            catch (error) {
                console.error('Error:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
    deleteReview(reviewId, authorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteReview = yield Review_1.default.findOneAndDelete({ _id: reviewId, author: authorId });
                if (!deleteReview) {
                    throw new Error('Review not found or you are not authorized to delete this review');
                }
                return deleteReview;
            }
            catch (error) {
                console.error('Error:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
    updateReview(reviewId, updatedReview) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateReview = yield Review_1.default.findByIdAndUpdate(reviewId, updatedReview, { new: true });
                if (!updateReview) {
                    throw new Error('Review not found');
                }
                return updateReview;
            }
            catch (error) {
                console.error('Error:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
}
exports.ReviewController = ReviewController;
//# sourceMappingURL=review.js.map