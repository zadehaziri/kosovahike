"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpRequestHandlers = void 0;
const user_1 = require("../controllers/user");
const http_status_codes_1 = require("../enums/http-status-codes");
const user_trails_1 = require("../controllers/user-trails");
const trail_1 = require("../controllers/trail");
const Event_1 = __importDefault(require("../models/Event"));
const event_1 = require("../controllers/event");
const mongoose_1 = __importDefault(require("mongoose"));
const stream_1 = require("stream");
const blogs_1 = require("../controllers/blogs");
const Blogs_1 = __importDefault(require("../models/Blogs"));
const reminder_1 = require("../controllers/reminder");
const review_1 = require("../controllers/review");
const Review_1 = __importDefault(require("../models/Review"));
class HttpRequestHandlers {
}
exports.HttpRequestHandlers = HttpRequestHandlers;
_a = HttpRequestHandlers;
HttpRequestHandlers.data = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userController = new user_1.UserController();
        const users = yield userController.getUsers();
        return res.status(http_status_codes_1.HTTP_CODE.OK).json(users);
    }
    catch (error) {
        console.error('Get users error:', error);
        return res.status(http_status_codes_1.HTTP_CODE.InternalServerError).json({
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Internal Server Error'
        });
    }
});
HttpRequestHandlers.getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(http_status_codes_1.HTTP_CODE.BadRequest).json({
                error: 'User ID is required'
            });
        }
        const userController = new user_1.UserController();
        const user = yield userController.getUserById(userId);
        if (!user) {
            return res.status(http_status_codes_1.HTTP_CODE.NotFound).json({
                message: `User ${userId} not found`
            });
        }
        return res.status(http_status_codes_1.HTTP_CODE.OK).json(user);
    }
    catch (error) {
        console.error('Get user error:', error);
        return res.status(http_status_codes_1.HTTP_CODE.InternalServerError).json({
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Internal Server Error'
        });
    }
});
HttpRequestHandlers.signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userObj = req.body;
        console.log('Signup request:', { email: userObj === null || userObj === void 0 ? void 0 : userObj.email, firstName: userObj === null || userObj === void 0 ? void 0 : userObj.firstName });
        const userController = new user_1.UserController();
        const result = yield userController.signup(userObj);
        return res.status(http_status_codes_1.HTTP_CODE.Created).json(result);
    }
    catch (err) {
        console.error('Signup error:', err);
        const statusCode = (err === null || err === void 0 ? void 0 : err.code) || http_status_codes_1.HTTP_CODE.InternalServerError;
        const errorMessage = (err === null || err === void 0 ? void 0 : err.message) || 'Internal Server Error';
        return res.status(statusCode).json({
            error: errorMessage
        });
    }
});
HttpRequestHandlers.deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(http_status_codes_1.HTTP_CODE.BadRequest).json({
                error: 'User ID is required'
            });
        }
        const userController = new user_1.UserController();
        yield userController.deleteUser(userId);
        return res.status(http_status_codes_1.HTTP_CODE.OK).json({
            message: `User ${userId} deleted successfully`
        });
    }
    catch (error) {
        console.error('Delete user error:', error);
        return res.status(http_status_codes_1.HTTP_CODE.InternalServerError).json({
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Internal Server Error'
        });
    }
});
HttpRequestHandlers.getUserByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userEmail = req.params.email;
        if (!userEmail) {
            return res.status(http_status_codes_1.HTTP_CODE.BadRequest).json({
                error: 'User email is required'
            });
        }
        const userController = new user_1.UserController();
        const user = yield userController.getUserByEmail(userEmail);
        if (!user) {
            return res.status(http_status_codes_1.HTTP_CODE.NotFound).json({
                message: `User ${userEmail} not found`
            });
        }
        return res.status(http_status_codes_1.HTTP_CODE.OK).json(user);
    }
    catch (error) {
        console.error('Get user by email error:', error);
        return res.status(http_status_codes_1.HTTP_CODE.InternalServerError).json({
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Internal Server Error'
        });
    }
});
HttpRequestHandlers.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Express tashmë ka lexuar body-n me express.json() middleware
        const { email, password } = req.body;
        console.log('Login request:', { email, password: password ? '***' : 'missing' });
        if (!email || !password) {
            return res.status(http_status_codes_1.HTTP_CODE.BadRequest).json({
                error: 'Email dhe password janë të nevojshme!'
            });
        }
        const userController = new user_1.UserController();
        const result = yield userController.login(email, password);
        console.log('Login result:', { statusCode: result.statusCode, hasUser: !!result.data.user });
        return res.status(result.statusCode).json(result.data);
    }
    catch (err) {
        console.error('Login error:', err);
        console.error('Error message:', err === null || err === void 0 ? void 0 : err.message);
        console.error('Error code:', err === null || err === void 0 ? void 0 : err.code);
        const statusCode = (err === null || err === void 0 ? void 0 : err.code) || http_status_codes_1.HTTP_CODE.InternalServerError;
        const errorMessage = (err === null || err === void 0 ? void 0 : err.message) || 'Internal Server Error';
        return res.status(statusCode).json({
            error: errorMessage
        });
    }
});
HttpRequestHandlers.addFavoriteTrail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, trailId } = req.params;
        const userController = new user_1.UserController();
        yield userController.addFavoriteTrail(userId, trailId);
        res
            .status(http_status_codes_1.HTTP_CODE.OK)
            .json({ message: 'Favorite trail added successfully' });
    }
    catch (error) {
        console.error('Error adding favorite trail:', error);
        res
            .status(http_status_codes_1.HTTP_CODE.InternalServerError)
            .json({ error: 'Failed to add favorite trail' });
    }
});
HttpRequestHandlers.removeFavoriteTrail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, trailId } = req.params;
        const userController = new user_1.UserController();
        yield userController.removeFavoriteTrail(userId, trailId);
        res
            .status(http_status_codes_1.HTTP_CODE.OK)
            .json({ message: 'Favorite trail removed successfully' });
    }
    catch (error) {
        console.error('Error removing favorite trail:', error);
        res
            .status(http_status_codes_1.HTTP_CODE.InternalServerError)
            .json({ error: 'Failed to remove favorite trail' });
    }
});
HttpRequestHandlers.readFavoriteTrails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const userController = new user_1.UserController();
        const response = yield userController.readFavoriteTrails(userId);
        console.log('Response sent:', response);
        res.status(http_status_codes_1.HTTP_CODE.OK).json(response);
    }
    catch (error) {
        res.status(http_status_codes_1.HTTP_CODE.InternalServerError).json({ error: 'Failed' });
    }
});
HttpRequestHandlers.updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const updatedFields = req.body;
        if (!userId) {
            return res.status(http_status_codes_1.HTTP_CODE.BadRequest).json({
                error: 'User ID is required'
            });
        }
        console.log('Update user request:', { userId, fields: Object.keys(updatedFields) });
        const userController = new user_1.UserController();
        const result = yield userController.updateUser(userId, updatedFields);
        return res.status(http_status_codes_1.HTTP_CODE.OK).json(result);
    }
    catch (err) {
        console.error('Update user error:', err);
        const statusCode = (err === null || err === void 0 ? void 0 : err.code) || http_status_codes_1.HTTP_CODE.InternalServerError;
        const errorMessage = (err === null || err === void 0 ? void 0 : err.message) || 'Internal Server Error';
        return res.status(statusCode).json({
            error: errorMessage
        });
    }
});
HttpRequestHandlers.getAllReminders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reminderController = new reminder_1.ReminderController();
        const reminders = yield reminderController.getAllReminders();
        return res.status(http_status_codes_1.HTTP_CODE.OK).json(reminders);
    }
    catch (error) {
        console.error('Get all reminders error:', error);
        return res.status(http_status_codes_1.HTTP_CODE.InternalServerError).json({
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Internal Server Error'
        });
    }
});
HttpRequestHandlers.getReminderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reminderId } = req.params;
        if (!reminderId) {
            return res.status(http_status_codes_1.HTTP_CODE.BadRequest).json({
                error: 'Reminder ID is required'
            });
        }
        const reminderController = new reminder_1.ReminderController();
        const reminder = yield reminderController.getReminderById(reminderId);
        if (!reminder) {
            return res.status(http_status_codes_1.HTTP_CODE.NotFound).json({
                message: `Reminder ${reminderId} not found`
            });
        }
        return res.status(http_status_codes_1.HTTP_CODE.OK).json(reminder);
    }
    catch (error) {
        console.error('Get reminder by ID error:', error);
        return res.status(http_status_codes_1.HTTP_CODE.InternalServerError).json({
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Internal Server Error'
        });
    }
});
HttpRequestHandlers.getUserReminders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(http_status_codes_1.HTTP_CODE.BadRequest).json({
                error: 'User ID is required'
            });
        }
        const reminderController = new reminder_1.ReminderController();
        const reminders = yield reminderController.getUserReminders(userId);
        if (!reminders || reminders.length === 0) {
            return res.status(http_status_codes_1.HTTP_CODE.OK).json([]);
        }
        return res.status(http_status_codes_1.HTTP_CODE.OK).json(reminders);
    }
    catch (error) {
        console.error('Get user reminders error:', error);
        return res.status(http_status_codes_1.HTTP_CODE.InternalServerError).json({
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Internal Server Error'
        });
    }
});
HttpRequestHandlers.addPastTrail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const pastTrailData = req.body;
        const images = req.files;
        console.log(images);
        const bucket = new mongoose_1.default.mongo.GridFSBucket(mongoose_1.default.connection.db, {
            bucketName: 'images',
        });
        for (const file of images) {
            const existingFile = yield bucket
                .find({ filename: file.filename })
                .toArray();
            if (existingFile && existingFile.length > 0) {
                continue;
            }
            const uploadStream = bucket.openUploadStream(file.filename);
            const readableStream = new stream_1.Readable();
            readableStream.push(file.buffer);
            readableStream.push(null);
        }
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        const trailController = new user_trails_1.PastTrailsController();
        const result = yield trailController.addPastTrail(userId, pastTrailData, images);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Error adding past trail:', error);
        res.status(500).json({ error: 'Failed to add past trail' });
    }
});
HttpRequestHandlers.getPastTrailImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { imageId } = req.params;
        const bucket = new mongoose_1.default.mongo.GridFSBucket(mongoose_1.default.connection.db, {
            bucketName: 'images',
        });
        const file = yield bucket.find({ filename: imageId }).toArray();
        if (!file || file.length === 0) {
            return res.status(404).send('Image not found');
        }
        res.set('Access-Control-Allow-Origin', '*');
        res.contentType('image/png');
        const downloadStream = bucket.openDownloadStreamByName(imageId);
        downloadStream.pipe(res);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
HttpRequestHandlers.removePastTrail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, trailId } = req.params;
        if (!userId || !trailId) {
            return res.status(http_status_codes_1.HTTP_CODE.BadRequest).json({
                error: 'User ID and Trail ID are required'
            });
        }
        const trailController = new user_trails_1.PastTrailsController();
        yield trailController.removePastTrail(userId, trailId);
        return res.status(http_status_codes_1.HTTP_CODE.OK).json({
            message: 'Past trail removed successfully'
        });
    }
    catch (error) {
        console.error('Error removing past trail:', error);
        return res.status(http_status_codes_1.HTTP_CODE.InternalServerError).json({
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Failed to remove past trail'
        });
    }
});
HttpRequestHandlers.getPastTrails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const userController = new user_trails_1.PastTrailsController();
        const trails = yield userController.getPastTrails(userId);
        res.status(http_status_codes_1.HTTP_CODE.OK).json({ trails: trails });
    }
    catch (error) {
        console.error('Error reading past trails:', error);
        res
            .status(http_status_codes_1.HTTP_CODE.InternalServerError)
            .json({ error: 'Failed to read past trails' });
    }
});
HttpRequestHandlers.getSinglePastTrail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, trailId } = req.params;
        const trailController = new user_trails_1.PastTrailsController();
        const trail = yield trailController.getSingleTrail(userId, trailId);
        if (!trail) {
            res
                .status(http_status_codes_1.HTTP_CODE.NotFound)
                .json({ message: `Trail ${trailId} not found` });
        }
        else {
            res.status(http_status_codes_1.HTTP_CODE.OK).json(trail);
        }
    }
    catch (error) {
        console.error('Error retrieving single past trail:', error);
        res
            .status(http_status_codes_1.HTTP_CODE.InternalServerError)
            .json({ error: 'Failed to retrieve past trail' });
    }
});
HttpRequestHandlers.getAllTrails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trailController = new trail_1.TrailController();
        const trails = yield trailController.getAllTrails();
        return res.status(http_status_codes_1.HTTP_CODE.OK).json(trails);
    }
    catch (error) {
        console.error('Get all trails error:', error);
        return res.status(http_status_codes_1.HTTP_CODE.InternalServerError).json({
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Internal Server Error'
        });
    }
});
HttpRequestHandlers.getTrail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trailId = req.params.trailId;
        if (!trailId) {
            return res.status(http_status_codes_1.HTTP_CODE.BadRequest).json({
                error: 'Trail ID is required'
            });
        }
        const trailController = new trail_1.TrailController();
        const trail = yield trailController.getTrailById(trailId);
        if (!trail) {
            return res.status(http_status_codes_1.HTTP_CODE.NotFound).json({
                message: `Trail ${trailId} not found`
            });
        }
        return res.status(http_status_codes_1.HTTP_CODE.OK).json(trail);
    }
    catch (error) {
        console.error('Get trail error:', error);
        return res.status(http_status_codes_1.HTTP_CODE.InternalServerError).json({
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Internal Server Error'
        });
    }
});
HttpRequestHandlers.getTrailByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trailName = req.params.trailName;
        if (!trailName) {
            return res.status(http_status_codes_1.HTTP_CODE.BadRequest).json({
                error: 'Trail name is required'
            });
        }
        const trailController = new trail_1.TrailController();
        const trail = yield trailController.getTrailByName(trailName);
        if (!trail) {
            return res.status(http_status_codes_1.HTTP_CODE.NotFound).json({
                message: `Trail ${trailName} not found`
            });
        }
        return res.status(http_status_codes_1.HTTP_CODE.OK).json(trail);
    }
    catch (error) {
        console.error('Get trail by name error:', error);
        return res.status(http_status_codes_1.HTTP_CODE.InternalServerError).json({
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Internal Server Error'
        });
    }
});
HttpRequestHandlers.deleteTrail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trailId = req.params.trailId;
        if (!trailId) {
            return res.status(http_status_codes_1.HTTP_CODE.BadRequest).json({
                error: 'Trail ID is required'
            });
        }
        const trailController = new trail_1.TrailController();
        yield trailController.deleteTrail(trailId);
        return res.status(http_status_codes_1.HTTP_CODE.OK).json({
            message: `Trail ${trailId} deleted successfully`
        });
    }
    catch (error) {
        console.error('Delete trail error:', error);
        return res.status(http_status_codes_1.HTTP_CODE.InternalServerError).json({
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Internal Server Error'
        });
    }
});
HttpRequestHandlers.createTrail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trailObj = req.body;
        console.log('Create trail request:', { name: trailObj === null || trailObj === void 0 ? void 0 : trailObj.name });
        const trailController = new trail_1.TrailController();
        const result = yield trailController.createTrail(trailObj);
        return res.status(http_status_codes_1.HTTP_CODE.Created).json(result);
    }
    catch (err) {
        console.error('Create trail error:', err);
        const statusCode = (err === null || err === void 0 ? void 0 : err.code) || http_status_codes_1.HTTP_CODE.InternalServerError;
        return res.status(statusCode).json({
            error: (err === null || err === void 0 ? void 0 : err.message) || 'Internal Server Error',
        });
    }
});
HttpRequestHandlers.updateTrail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trailId = req.params.trailId;
        const updatedFields = req.body;
        if (!trailId) {
            return res.status(http_status_codes_1.HTTP_CODE.BadRequest).json({
                error: 'Trail ID is required'
            });
        }
        console.log('Update trail request:', { trailId, fields: Object.keys(updatedFields) });
        const trailController = new trail_1.TrailController();
        const result = yield trailController.updateTrail(trailId, updatedFields);
        return res.status(http_status_codes_1.HTTP_CODE.OK).json(result);
    }
    catch (err) {
        console.error('Update trail error:', err);
        const statusCode = (err === null || err === void 0 ? void 0 : err.code) || http_status_codes_1.HTTP_CODE.InternalServerError;
        return res.status(statusCode).json({
            error: (err === null || err === void 0 ? void 0 : err.message) || 'Internal Server Error',
        });
    }
});
HttpRequestHandlers.rateAndReviewTrail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trailId = req.params.trailId;
        const userId = req.params.userId;
        const { rating, comment } = req.body;
        if (!trailId || !userId || !rating || !comment) {
            return res.status(http_status_codes_1.HTTP_CODE.BadRequest).json({
                error: 'Trail ID, User ID, Rating, and Comment are required',
            });
        }
        console.log('Rate and review trail:', { trailId, userId, rating });
        const trailController = new trail_1.TrailController();
        const result = yield trailController.rateAndReviewTrail(trailId, userId, rating, comment);
        return res.status(http_status_codes_1.HTTP_CODE.OK).json(result);
    }
    catch (error) {
        console.error('Rate and review error:', error);
        const statusCode = (error === null || error === void 0 ? void 0 : error.code) || http_status_codes_1.HTTP_CODE.InternalServerError;
        return res.status(statusCode).json({
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Internal Server Error'
        });
    }
});
HttpRequestHandlers.updateRateAndReviewTrail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trailId = req.params.trailId;
        const userId = req.params.userId;
        const { rating, comment } = req.body;
        if (!trailId || !userId || !rating || !comment) {
            return res.status(http_status_codes_1.HTTP_CODE.BadRequest).json({
                error: 'Trail ID, User ID, Rating, and Comment are required',
            });
        }
        console.log('Update rate and review:', { trailId, userId, rating });
        const trailController = new trail_1.TrailController();
        const result = yield trailController.updateRateAndReviewTrail(trailId, userId, rating, comment);
        return res.status(http_status_codes_1.HTTP_CODE.OK).json(result);
    }
    catch (error) {
        console.error('Update rate and review error:', error);
        const statusCode = (error === null || error === void 0 ? void 0 : error.code) || http_status_codes_1.HTTP_CODE.InternalServerError;
        return res.status(statusCode).json({
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Internal Server Error'
        });
    }
});
HttpRequestHandlers.deleteReviewTrail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, trailId } = req.params;
        const trailController = new trail_1.TrailController();
        yield trailController.deleteReview(trailId, userId);
        res.status(http_status_codes_1.HTTP_CODE.OK).json({ message: 'Review deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting review:', error);
        res
            .status(http_status_codes_1.HTTP_CODE.InternalServerError)
            .json({ error: 'Failed to delete review' });
    }
});
HttpRequestHandlers.getAllReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trailId = req.params.trailId;
        const trailController = new trail_1.TrailController();
        const reviews = yield trailController.getAllReivews(trailId);
        res.status(http_status_codes_1.HTTP_CODE.OK).json(reviews);
    }
    catch (error) {
        console.error('Error:', error);
        res
            .status(http_status_codes_1.HTTP_CODE.InternalServerError)
            .json({ error: 'Internal Server Error' });
    }
});
HttpRequestHandlers.getHikeBuddies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userController = new user_1.UserController();
        const users = yield userController.getAllHikeBuddies();
        return res.status(http_status_codes_1.HTTP_CODE.OK).json(users);
    }
    catch (error) {
        console.error('Get hike buddies error:', error);
        return res.status(http_status_codes_1.HTTP_CODE.InternalServerError).json({
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Internal Server Error'
        });
    }
});
HttpRequestHandlers.searchHikeBuddies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, location, skillLevel, gender } = req.body;
        console.log('Search hike buddies:', { fullName, location, skillLevel, gender });
        const userController = new user_1.UserController();
        const hikeBuddies = yield userController.searchForHikeBuddies({
            fullName,
            location,
            skillLevel,
            gender,
        });
        return res.status(http_status_codes_1.HTTP_CODE.OK).json(hikeBuddies);
    }
    catch (error) {
        console.error('Search hike buddies error:', error);
        return res.status(http_status_codes_1.HTTP_CODE.InternalServerError).json({
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Internal Server Error'
        });
    }
});
// Import your models
HttpRequestHandlers.getAllEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allEvents = yield Event_1.default.find().populate('creator', 'firstName lastName');
        return res.status(http_status_codes_1.HTTP_CODE.OK).json(allEvents);
    }
    catch (error) {
        console.error('Get all events error:', error);
        return res.status(http_status_codes_1.HTTP_CODE.InternalServerError).json({
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Internal Server Error'
        });
    }
});
HttpRequestHandlers.getEventById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventId = req.params.eventId;
        if (!eventId) {
            return res.status(http_status_codes_1.HTTP_CODE.BadRequest).json({
                error: 'Event ID is required'
            });
        }
        const eventController = new event_1.EventController();
        const event = yield eventController.getEventById(eventId);
        if (!event) {
            return res.status(http_status_codes_1.HTTP_CODE.NotFound).json({
                error: 'Event not found'
            });
        }
        return res.status(http_status_codes_1.HTTP_CODE.OK).json(event);
    }
    catch (error) {
        console.error('Get event by ID error:', error);
        return res.status(http_status_codes_1.HTTP_CODE.InternalServerError).json({
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Internal Server Error'
        });
    }
});
HttpRequestHandlers.saveEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trailId = req.params.trailId;
        const creatorId = req.params.creatorId;
        const eventObj = req.body;
        if (!trailId || !creatorId) {
            return res.status(http_status_codes_1.HTTP_CODE.BadRequest).json({
                error: 'Trail ID and Creator ID are required'
            });
        }
        console.log('Save event:', { trailId, creatorId, eventData: eventObj });
        const eventController = new event_1.EventController();
        const result = yield eventController.saveEvent(eventObj, trailId, creatorId);
        return res.status(http_status_codes_1.HTTP_CODE.Created).json({
            message: 'Event saved successfully',
            result
        });
    }
    catch (err) {
        console.error('Save event error:', err);
        const statusCode = (err === null || err === void 0 ? void 0 : err.code) || http_status_codes_1.HTTP_CODE.InternalServerError;
        return res.status(statusCode).json({
            error: (err === null || err === void 0 ? void 0 : err.message) || 'Internal Server Error',
        });
    }
});
HttpRequestHandlers.deleteEventById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventId, creatorId } = req.params;
        const eventController = new event_1.EventController();
        const event = yield Event_1.default.findById(eventId);
        if (!event) {
            res.status(http_status_codes_1.HTTP_CODE.NotFound).json({ error: 'Event not found' });
            return;
        }
        if (event.creator.toString() !== creatorId.toString()) {
            res
                .status(http_status_codes_1.HTTP_CODE.Forbidden)
                .json({ error: 'You are not authorized to delete this event' });
            return;
        }
        yield eventController.deleteEvent(eventId, creatorId);
        res.status(http_status_codes_1.HTTP_CODE.OK).json({ message: 'Event deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting event:', error);
        res
            .status(http_status_codes_1.HTTP_CODE.InternalServerError)
            .json({ error: 'Internal Server Error' });
    }
});
HttpRequestHandlers.updateEventById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventId, creatorId } = req.params;
        const updatedFields = req.body;
        if (!eventId) {
            return res.status(http_status_codes_1.HTTP_CODE.BadRequest).json({
                error: 'Event ID is required'
            });
        }
        if (!creatorId) {
            return res.status(http_status_codes_1.HTTP_CODE.BadRequest).json({
                error: 'Creator ID is required'
            });
        }
        console.log('Update event:', { eventId, creatorId, fields: Object.keys(updatedFields) });
        const eventController = new event_1.EventController();
        const result = yield eventController.updateEvent(updatedFields, eventId, creatorId);
        return res.status(http_status_codes_1.HTTP_CODE.OK).json(result);
    }
    catch (err) {
        console.error('Update event error:', err);
        const statusCode = (err === null || err === void 0 ? void 0 : err.code) || http_status_codes_1.HTTP_CODE.InternalServerError;
        return res.status(statusCode).json({
            error: (err === null || err === void 0 ? void 0 : err.message) || 'Internal Server Error',
        });
    }
});
HttpRequestHandlers.joinEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventId, userId } = req.params;
        if (!eventId || !userId) {
            return res.status(http_status_codes_1.HTTP_CODE.BadRequest).json({
                error: 'Event ID and User ID are required'
            });
        }
        console.log('Join event request:', { eventId, userId });
        const eventController = new event_1.EventController();
        yield eventController.joinEvent(eventId, userId);
        res
            .status(http_status_codes_1.HTTP_CODE.OK)
            .json({ message: 'User joined event successfully' });
    }
    catch (error) {
        console.error('Error joining to event:', error);
        // Use error code if available, otherwise default to 500
        const statusCode = (error === null || error === void 0 ? void 0 : error.code) || http_status_codes_1.HTTP_CODE.InternalServerError;
        const errorMessage = (error === null || error === void 0 ? void 0 : error.message) || 'Failed to join event';
        res
            .status(statusCode)
            .json({ error: errorMessage });
    }
});
HttpRequestHandlers.leaveEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventId, userId } = req.params;
        const eventController = new event_1.EventController();
        yield eventController.leaveEvent(eventId, userId);
        res
            .status(http_status_codes_1.HTTP_CODE.OK)
            .json({ message: 'User left event successfully' });
    }
    catch (error) {
        console.error('Error leaving event:', error);
        res
            .status(http_status_codes_1.HTTP_CODE.InternalServerError)
            .json({ error: 'Failed to leave event' });
    }
});
HttpRequestHandlers.saveBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorId } = req.params;
        const blogData = req.body;
        const images = req.files;
        if (!authorId) {
            return res.status(400).json({ error: 'Author ID is required' });
        }
        const bucket = new mongoose_1.default.mongo.GridFSBucket(mongoose_1.default.connection.db, {
            bucketName: 'images',
        });
        for (const file of images) {
            const existingFile = yield bucket
                .find({ filename: file.filename })
                .toArray();
            if (existingFile && existingFile.length > 0) {
                continue;
            }
            const uploadStream = bucket.openUploadStream(file.filename);
            const readableStream = new stream_1.Readable();
            readableStream.push(file.buffer);
            readableStream.push(null);
        }
        const blogController = new blogs_1.BlogsController();
        const result = yield blogController.saveBlog(authorId, blogData, images);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Error adding blog post:', error);
        res.status(500).json({ error: 'Failed to add blog post' });
    }
});
HttpRequestHandlers.getAllBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogsController = new blogs_1.BlogsController();
        const blogs = yield blogsController.getBlogs();
        res.writeHead(http_status_codes_1.HTTP_CODE.OK, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(blogs));
    }
    catch (error) {
        console.error('Error:', error);
        res.writeHead(http_status_codes_1.HTTP_CODE.InternalServerError, {
            'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
});
HttpRequestHandlers.getBlogsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const blogId = (_b = req.url) === null || _b === void 0 ? void 0 : _b.split('/')[2];
        if (!blogId) {
            res.writeHead(http_status_codes_1.HTTP_CODE.BadRequest, {
                'Content-Type': 'application/json',
            });
            res.end(JSON.stringify({ error: 'Blog ID is required' }));
            return;
        }
        const blog = yield Blogs_1.default.findById(blogId);
        if (!blog) {
            res.writeHead(http_status_codes_1.HTTP_CODE.NotFound, {
                'Content-Type': 'application/json',
            });
            res.end(JSON.stringify({ message: `Blog ${blogId} not found` }));
        }
        else {
            res.writeHead(http_status_codes_1.HTTP_CODE.OK, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(blog));
        }
    }
    catch (error) {
        console.error('Error:', error);
        res.writeHead(http_status_codes_1.HTTP_CODE.InternalServerError, {
            'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
});
HttpRequestHandlers.updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogId = req.params.blogId;
        const updatedFields = req.body;
        if (!blogId) {
            return res.status(http_status_codes_1.HTTP_CODE.BadRequest).json({
                error: 'Blog ID is required'
            });
        }
        console.log('Update blog:', { blogId, fields: Object.keys(updatedFields) });
        const blogsController = new blogs_1.BlogsController();
        const result = yield blogsController.updateBlog(blogId, updatedFields);
        return res.status(http_status_codes_1.HTTP_CODE.OK).json(result);
    }
    catch (err) {
        console.error('Update blog error:', err);
        const statusCode = (err === null || err === void 0 ? void 0 : err.code) || http_status_codes_1.HTTP_CODE.InternalServerError;
        return res.status(statusCode).json({
            error: (err === null || err === void 0 ? void 0 : err.message) || 'Internal Server Error',
        });
    }
});
HttpRequestHandlers.deleteBlogById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { blogId, authorId } = req.params;
        const blog = yield Blogs_1.default.findById(blogId);
        const blogsController = new blogs_1.BlogsController();
        if (!blog) {
            res.status(http_status_codes_1.HTTP_CODE.NotFound).json({ error: 'Blog not found' });
            return;
        }
        if (blog.author.toString() !== authorId.toString()) {
            res
                .status(http_status_codes_1.HTTP_CODE.Forbidden)
                .json({ error: 'You are not authorized to delete this blog' });
            return;
        }
        yield blogsController.deleteBlog(blogId, authorId);
        res.status(http_status_codes_1.HTTP_CODE.OK).json({ message: 'Blog deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting blog:', error);
        res.status(http_status_codes_1.HTTP_CODE.InternalServerError).json({ error: 'Internal Server Error' });
    }
});
HttpRequestHandlers.getAllReviewsComponent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviewController = new review_1.ReviewController();
        const reviews = yield reviewController.getReviews();
        return res.status(http_status_codes_1.HTTP_CODE.OK).json(reviews);
    }
    catch (error) {
        console.error('Get all reviews error:', error);
        return res.status(http_status_codes_1.HTTP_CODE.InternalServerError).json({
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Internal Server Error'
        });
    }
});
HttpRequestHandlers.getAllReviewsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviewId = req.params.reviewId;
        if (!reviewId) {
            return res.status(http_status_codes_1.HTTP_CODE.BadRequest).json({
                error: 'Review ID is required'
            });
        }
        const blog = yield Blogs_1.default.findById(reviewId);
        if (!blog) {
            return res.status(http_status_codes_1.HTTP_CODE.NotFound).json({
                message: `Review ${reviewId} not found`
            });
        }
        return res.status(http_status_codes_1.HTTP_CODE.OK).json(blog);
    }
    catch (error) {
        console.error('Get review by ID error:', error);
        return res.status(http_status_codes_1.HTTP_CODE.InternalServerError).json({
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Internal Server Error'
        });
    }
});
HttpRequestHandlers.saveReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviewsObj = req.body;
        console.log('Save review:', { reviewData: reviewsObj });
        const reviewController = new review_1.ReviewController();
        const result = yield reviewController.saveReview(reviewsObj);
        return res.status(http_status_codes_1.HTTP_CODE.Created).json(result);
    }
    catch (err) {
        console.error('Save review error:', err);
        const statusCode = (err === null || err === void 0 ? void 0 : err.code) || http_status_codes_1.HTTP_CODE.InternalServerError;
        return res.status(statusCode).json({
            error: (err === null || err === void 0 ? void 0 : err.message) || 'Internal Server Error',
        });
    }
});
HttpRequestHandlers.deleteReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reviewId, authorId } = req.params;
        const review = yield Review_1.default.findById(reviewId);
        const reviewController = new review_1.ReviewController();
        if (!review) {
            res.status(http_status_codes_1.HTTP_CODE.NotFound).json({ error: 'Review not found' });
            return;
        }
        if (review.author.toString() !== authorId.toString()) {
            res.status(http_status_codes_1.HTTP_CODE.Forbidden).json({ error: 'You are not authorized to delete this review' });
            return;
        }
        yield reviewController.deleteReview(reviewId, authorId);
        res.status(http_status_codes_1.HTTP_CODE.OK).json({ message: 'Review deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting blog:', error);
        res.status(http_status_codes_1.HTTP_CODE.InternalServerError).json({ error: 'Internal Server Error' });
    }
});
HttpRequestHandlers.updateReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviewId = req.params.reviewId;
        const updateReview = req.body;
        if (!reviewId) {
            return res.status(http_status_codes_1.HTTP_CODE.BadRequest).json({
                error: 'Review ID is required'
            });
        }
        console.log('Update review:', { reviewId, fields: Object.keys(updateReview) });
        const reviewController = new review_1.ReviewController();
        const result = yield reviewController.updateReview(reviewId, updateReview);
        return res.status(http_status_codes_1.HTTP_CODE.OK).json(result);
    }
    catch (err) {
        console.error('Update review error:', err);
        const statusCode = (err === null || err === void 0 ? void 0 : err.code) || http_status_codes_1.HTTP_CODE.InternalServerError;
        return res.status(statusCode).json({
            error: (err === null || err === void 0 ? void 0 : err.message) || 'Internal Server Error',
        });
    }
});
HttpRequestHandlers.uploadProfilePicture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const image = req.file;
        const bucket = new mongoose_1.default.mongo.GridFSBucket(mongoose_1.default.connection.db, {
            bucketName: 'images',
        });
        const uploadStream = bucket.openUploadStream(image.filename);
        const readableStream = new stream_1.Readable();
        readableStream.push(image.buffer);
        readableStream.push(null);
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        const userController = new user_1.UserController();
        const result = yield userController.uploadProfilePicture(userId, image);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Error handling profile picture upload:', error);
        res.status(500).json({ error: 'Failed to handle profile picture upload' });
    }
});
HttpRequestHandlers.readImageFromBucket = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const filename = req.params.filename;
    const bucket = new mongoose_1.default.mongo.GridFSBucket(mongoose_1.default.connection.db, {
        bucketName: 'images',
    });
    const downloadStream = bucket.openDownloadStreamByName(filename);
    console.log(downloadStream);
    let imageData = Buffer.from([]);
    downloadStream.on('data', (chunk) => {
        imageData = Buffer.concat([imageData, chunk]);
    });
    downloadStream.on('end', () => {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Content-Type', 'image/jpeg');
        res.send(imageData);
    });
    downloadStream.on('error', (error) => {
        console.error('Error reading image from GridFS:', error);
        res.status(500).json({ error: 'Failed to read image' });
    });
});
HttpRequestHandlers.addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const product = req.body;
        if (!userId || !product) {
            return res.status(http_status_codes_1.HTTP_CODE.BadRequest).json({
                error: 'User ID and product are required'
            });
        }
        const userController = new user_1.UserController();
        const cart = yield userController.addToCart(userId, product);
        return res.status(http_status_codes_1.HTTP_CODE.OK).json(cart);
    }
    catch (error) {
        console.error('Add to cart error:', error);
        const statusCode = (error === null || error === void 0 ? void 0 : error.code) || http_status_codes_1.HTTP_CODE.InternalServerError;
        return res.status(statusCode).json({
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Failed to add product to cart'
        });
    }
});
HttpRequestHandlers.getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(http_status_codes_1.HTTP_CODE.BadRequest).json({
                error: 'User ID is required'
            });
        }
        const userController = new user_1.UserController();
        const cart = yield userController.getCart(userId);
        return res.status(http_status_codes_1.HTTP_CODE.OK).json(cart);
    }
    catch (error) {
        console.error('Get cart error:', error);
        const statusCode = (error === null || error === void 0 ? void 0 : error.code) || http_status_codes_1.HTTP_CODE.InternalServerError;
        return res.status(statusCode).json({
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Failed to get cart'
        });
    }
});
HttpRequestHandlers.updateCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const productId = parseInt(req.params.productId);
        const { quantity } = req.body;
        if (!userId || !productId || quantity === undefined) {
            return res.status(http_status_codes_1.HTTP_CODE.BadRequest).json({
                error: 'User ID, product ID, and quantity are required'
            });
        }
        const userController = new user_1.UserController();
        const cart = yield userController.updateCartItem(userId, productId, quantity);
        return res.status(http_status_codes_1.HTTP_CODE.OK).json(cart);
    }
    catch (error) {
        console.error('Update cart item error:', error);
        const statusCode = (error === null || error === void 0 ? void 0 : error.code) || http_status_codes_1.HTTP_CODE.InternalServerError;
        return res.status(statusCode).json({
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Failed to update cart item'
        });
    }
});
HttpRequestHandlers.removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const productId = parseInt(req.params.productId);
        if (!userId || !productId) {
            return res.status(http_status_codes_1.HTTP_CODE.BadRequest).json({
                error: 'User ID and product ID are required'
            });
        }
        const userController = new user_1.UserController();
        const cart = yield userController.removeFromCart(userId, productId);
        return res.status(http_status_codes_1.HTTP_CODE.OK).json(cart);
    }
    catch (error) {
        console.error('Remove from cart error:', error);
        const statusCode = (error === null || error === void 0 ? void 0 : error.code) || http_status_codes_1.HTTP_CODE.InternalServerError;
        return res.status(statusCode).json({
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Failed to remove product from cart'
        });
    }
});
HttpRequestHandlers.clearCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(http_status_codes_1.HTTP_CODE.BadRequest).json({
                error: 'User ID is required'
            });
        }
        const userController = new user_1.UserController();
        const result = yield userController.clearCart(userId);
        return res.status(http_status_codes_1.HTTP_CODE.OK).json(result);
    }
    catch (error) {
        console.error('Clear cart error:', error);
        const statusCode = (error === null || error === void 0 ? void 0 : error.code) || http_status_codes_1.HTTP_CODE.InternalServerError;
        return res.status(statusCode).json({
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Failed to clear cart'
        });
    }
});
HttpRequestHandlers.checkout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const userId = req.params.userId;
        const checkoutData = req.body;
        if (!userId) {
            return res.status(http_status_codes_1.HTTP_CODE.BadRequest).json({
                error: 'User ID is required'
            });
        }
        const userController = new user_1.UserController();
        const result = yield userController.checkout(userId, checkoutData);
        // Send email confirmation (async, don't wait for it)
        try {
            const { sendOrderConfirmationEmail } = yield Promise.resolve().then(() => __importStar(require('../services/emailService')));
            sendOrderConfirmationEmail(result, ((_c = checkoutData.contactInfo) === null || _c === void 0 ? void 0 : _c.email) || '').catch(err => {
                console.error('Failed to send confirmation email:', err);
            });
        }
        catch (emailError) {
            console.error('Email service error:', emailError);
            // Don't fail the checkout if email fails
        }
        return res.status(http_status_codes_1.HTTP_CODE.OK).json(result);
    }
    catch (error) {
        console.error('Checkout error:', error);
        const statusCode = (error === null || error === void 0 ? void 0 : error.code) || http_status_codes_1.HTTP_CODE.InternalServerError;
        return res.status(statusCode).json({
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Failed to process checkout'
        });
    }
});
HttpRequestHandlers.getUserOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(http_status_codes_1.HTTP_CODE.BadRequest).json({
                error: 'User ID is required'
            });
        }
        const userController = new user_1.UserController();
        const orders = yield userController.getUserOrders(userId);
        return res.status(http_status_codes_1.HTTP_CODE.OK).json(orders);
    }
    catch (error) {
        console.error('Get user orders error:', error);
        const statusCode = (error === null || error === void 0 ? void 0 : error.code) || http_status_codes_1.HTTP_CODE.InternalServerError;
        return res.status(statusCode).json({
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Failed to get user orders'
        });
    }
});
HttpRequestHandlers.getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const orderId = req.params.orderId;
        if (!userId || !orderId) {
            return res.status(http_status_codes_1.HTTP_CODE.BadRequest).json({
                error: 'User ID and Order ID are required'
            });
        }
        const userController = new user_1.UserController();
        const order = yield userController.getOrderById(orderId, userId);
        return res.status(http_status_codes_1.HTTP_CODE.OK).json(order);
    }
    catch (error) {
        console.error('Get order error:', error);
        const statusCode = (error === null || error === void 0 ? void 0 : error.code) || http_status_codes_1.HTTP_CODE.InternalServerError;
        return res.status(statusCode).json({
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Failed to get order'
        });
    }
});
HttpRequestHandlers.updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const orderId = req.params.orderId;
        const { status } = req.body;
        if (!userId || !orderId || !status) {
            return res.status(http_status_codes_1.HTTP_CODE.BadRequest).json({
                error: 'User ID, Order ID, and status are required'
            });
        }
        const userController = new user_1.UserController();
        const order = yield userController.updateOrderStatus(orderId, userId, status);
        return res.status(http_status_codes_1.HTTP_CODE.OK).json(order);
    }
    catch (error) {
        console.error('Update order status error:', error);
        const statusCode = (error === null || error === void 0 ? void 0 : error.code) || http_status_codes_1.HTTP_CODE.InternalServerError;
        return res.status(statusCode).json({
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Failed to update order status'
        });
    }
});
//# sourceMappingURL=request-handlers.js.map