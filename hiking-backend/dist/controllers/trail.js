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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrailController = void 0;
const Trail_1 = __importDefault(require("../models/Trail"));
const http_status_codes_1 = require("../enums/http-status-codes");
class TrailController {
    getAllTrails() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trails = yield Trail_1.default.find();
                return trails;
            }
            catch (error) {
                console.error('Error:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
    getTrailById(trailId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trail = yield Trail_1.default.findById(trailId);
                return trail;
            }
            catch (error) {
                console.error('Error:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
    getTrailByName(trailName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //console.log(' Trail name: ',trailName);
                const formattedTrailName = trailName.replace(/-/g, ' ');
                // console.log(' Formated Trail name: ',formattedTrailName);
                const trail = yield Trail_1.default.findOne({ name: formattedTrailName });
                return trail;
            }
            catch (error) {
                console.error('Error:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
    createTrail(trailObj) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, location, difficulty, length, photos } = trailObj, rest = __rest(trailObj, ["name", "location", "difficulty", "length", "photos"]);
            if (!name || !location || !difficulty || !length || !photos) {
                const customError = new Error('Please check the required fields!');
                customError.code = http_status_codes_1.HTTP_CODE.NotFound;
                throw customError;
            }
            const newTrail = new Trail_1.default(Object.assign({ name,
                location,
                difficulty,
                length,
                photos }, rest));
            yield newTrail.save();
            return { message: "Trail created succesfully!" };
        });
    }
    deleteTrail(trailId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Trail_1.default.findByIdAndDelete(trailId);
            }
            catch (error) {
                console.error('Error:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
    updateTrail(trailId, updatedFields) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trail = yield Trail_1.default.findById(trailId);
                if (!trail) {
                    const customError = new Error('Trail not found!');
                    customError.code = http_status_codes_1.HTTP_CODE.NotFound;
                    throw customError;
                }
                const { name, location, difficulty, length, elevationGain, duration, routeType, status, description, photos, keyFeatures, tags } = updatedFields;
                if (name)
                    trail.name = name;
                if (location)
                    trail.location = location;
                if (difficulty)
                    trail.difficulty = difficulty;
                if (length)
                    trail.length = length;
                if (elevationGain)
                    trail.elevationGain = elevationGain;
                if (duration)
                    trail.duration = duration;
                if (routeType)
                    trail.routeType = routeType;
                if (status !== undefined)
                    trail.status = status;
                if (description)
                    trail.description = description;
                if (photos)
                    trail.photos = photos;
                if (keyFeatures)
                    trail.keyFeatures = keyFeatures;
                if (tags)
                    trail.tags = tags;
                yield trail.save();
                return { message: "Trail updated successfully!" };
            }
            catch (error) {
                console.error('Error:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
    rateAndReviewTrail(trailId, userId, rating, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trail = yield Trail_1.default.findById(trailId);
                if (!trail) {
                    const customError = new Error('Trail not found!');
                    customError.code = http_status_codes_1.HTTP_CODE.NotFound;
                    throw customError;
                }
                const existingReview = trail.reviews.findIndex(index => { var _a; return ((_a = index.user) === null || _a === void 0 ? void 0 : _a.toString()) === userId; });
                if (existingReview !== -1) {
                    throw new Error('User has already rated or reviewed this trail.');
                }
                trail.reviews.push({ user: userId, rating, comment });
                yield trail.save();
                return { message: "Trail rated and reviewed successfully!" };
            }
            catch (error) {
                console.error('Error:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
    updateRateAndReviewTrail(trailId, userId, rating, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trail = yield Trail_1.default.findById(trailId);
                if (!trail) {
                    const customError = new Error('Trail not found!');
                    customError.code = http_status_codes_1.HTTP_CODE.NotFound;
                    throw customError;
                }
                const existingReview = trail.reviews.findIndex(index => { var _a; return ((_a = index.user) === null || _a === void 0 ? void 0 : _a.toString()) === userId; });
                if (existingReview === -1) {
                    throw new Error('User has not rated or reviewed this trail yet.');
                }
                trail.reviews[existingReview].rating = rating;
                trail.reviews[existingReview].comment = comment;
                yield trail.save();
                return { message: "Trail review updated successfully!" };
            }
            catch (error) {
                console.error('Error:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
    deleteReview(trailId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trail = yield Trail_1.default.findById(trailId);
                if (!trail) {
                    const customError = new Error('Trail not found!');
                    customError.code = http_status_codes_1.HTTP_CODE.NotFound;
                    throw customError;
                }
                const existingReview = trail.reviews.findIndex(review => { var _a; return ((_a = review.user) === null || _a === void 0 ? void 0 : _a.toString()) === userId; });
                if (existingReview === -1) {
                    throw new Error('Review not found for this user and trail.');
                }
                trail.reviews.splice(existingReview, 1);
                yield trail.save();
                return { message: "Review deleted successfully!" };
            }
            catch (error) {
                console.error('Error:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
    getAllReivews(trailId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trail = yield Trail_1.default.findById(trailId);
                if (!trail) {
                    const customError = new Error('Trail not found!');
                    customError.code = http_status_codes_1.HTTP_CODE.NotFound;
                    throw customError;
                }
                const reviews = trail.reviews;
                return reviews;
            }
            catch (error) {
                console.error('Error:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
}
exports.TrailController = TrailController;
;
//# sourceMappingURL=trail.js.map