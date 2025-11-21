"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pastTrailImageUpload = void 0;
const express_1 = __importDefault(require("express"));
const request_handlers_1 = require("../htpp-middleware/request-handlers");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const multer_gridfs_storage_1 = require("multer-gridfs-storage");
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: "src/uploads/profileImages",
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
});
const upload = (0, multer_1.default)({
    storage: storage,
});
const pastTrailImageStorage = new multer_gridfs_storage_1.GridFsStorage({
    url: "mongodb+srv://root:root@cluster0.ybirikr.mongodb.net/hiking-app?retryWrites=true&w=majority" ||
        "",
    file: (req, file) => {
        if (file.mimetype === "image/jpeg" ||
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpg") {
            return {
                bucketName: "images",
                filename: `${Date.now()}_${file.originalname}`,
            };
        }
        else {
            return `${Date.now()}_${file.originalname}`;
        }
    },
});
exports.pastTrailImageUpload = (0, multer_1.default)({ storage: pastTrailImageStorage });
router.get("/users", request_handlers_1.HttpRequestHandlers.data);
router.get("/users/:userId", request_handlers_1.HttpRequestHandlers.getUser);
router.post("/users", request_handlers_1.HttpRequestHandlers.signup);
router.delete("/users/:userId", request_handlers_1.HttpRequestHandlers.deleteUser);
router.get("/users/email/:email", request_handlers_1.HttpRequestHandlers.getUserByEmail);
router.post("/login", request_handlers_1.HttpRequestHandlers.login);
router.post("/users/:userId/favorites/:trailId", request_handlers_1.HttpRequestHandlers.addFavoriteTrail);
router.delete("/users/:userId/favorites/:trailId", request_handlers_1.HttpRequestHandlers.removeFavoriteTrail);
router.get("/users/:userId/favorites", request_handlers_1.HttpRequestHandlers.readFavoriteTrails);
router.put("/users/:userId", request_handlers_1.HttpRequestHandlers.updateUser);
router.get("/reminders", request_handlers_1.HttpRequestHandlers.getAllReminders);
router.get("/reminders/:reminderId", request_handlers_1.HttpRequestHandlers.getReminderById);
router.get("/reminders/user/:userId", request_handlers_1.HttpRequestHandlers.getUserReminders);
router.get("/reminders", request_handlers_1.HttpRequestHandlers.getAllReminders);
router.get("/reminders/:reminderId", request_handlers_1.HttpRequestHandlers.getReminderById);
router.get("/reminders/user/:userId", request_handlers_1.HttpRequestHandlers.getUserReminders);
router.post("/users/:userId/user-trails", exports.pastTrailImageUpload.array("images"), request_handlers_1.HttpRequestHandlers.addPastTrail);
router.get("/users/:userId/user-trails/:trailId", request_handlers_1.HttpRequestHandlers.getSinglePastTrail);
router.get("/pastTrailimages/:imageId", request_handlers_1.HttpRequestHandlers.getPastTrailImage);
router.delete("/users/:userId/user-trails/:trailId", request_handlers_1.HttpRequestHandlers.removePastTrail);
router.get("/users/:userId/user-trails", request_handlers_1.HttpRequestHandlers.getPastTrails);
router.get("/trails", request_handlers_1.HttpRequestHandlers.getAllTrails);
router.get("/trails/:trailId", request_handlers_1.HttpRequestHandlers.getTrail);
router.post("/trails", request_handlers_1.HttpRequestHandlers.createTrail);
router.put("/trails/:trailId", request_handlers_1.HttpRequestHandlers.updateTrail);
router.delete("/trails/:trailId", request_handlers_1.HttpRequestHandlers.deleteTrail);
router.post("/trails/:trailId/reviews/:userId", request_handlers_1.HttpRequestHandlers.rateAndReviewTrail);
router.put("/trails/:trailId/reviews/:userId", request_handlers_1.HttpRequestHandlers.updateRateAndReviewTrail);
router.delete("/trails/:trailId/reviews/:userId", request_handlers_1.HttpRequestHandlers.deleteReviewTrail);
router.get("/trails/:trailId/reviews", request_handlers_1.HttpRequestHandlers.getAllReviews);
router.get("/hikeBuddies", request_handlers_1.HttpRequestHandlers.getHikeBuddies);
router.post("/hikeBuddies/search", request_handlers_1.HttpRequestHandlers.searchHikeBuddies);
router.get("/trails/trail/:trailName", request_handlers_1.HttpRequestHandlers.getTrailByName);
router.get("/events", request_handlers_1.HttpRequestHandlers.getAllEvents);
router.get("/events/:eventId", request_handlers_1.HttpRequestHandlers.getEventById);
router.post("/events/trailId/:trailId/creatorId/:creatorId", request_handlers_1.HttpRequestHandlers.saveEvent);
router.delete("/events/:eventId/:creatorId", request_handlers_1.HttpRequestHandlers.deleteEventById);
router.post("/events/:eventId/creatorId/:creatorId", request_handlers_1.HttpRequestHandlers.updateEventById);
router.post("/events/join/:eventId/:userId", request_handlers_1.HttpRequestHandlers.joinEvent);
router.delete("/events/leave/:eventId/:userId", request_handlers_1.HttpRequestHandlers.leaveEvent);
router.get('/blogs', request_handlers_1.HttpRequestHandlers.getAllBlogs);
router.get('/blogs/:blogsId', request_handlers_1.HttpRequestHandlers.getBlogsById);
router.post('/blogs/:authorId', exports.pastTrailImageUpload.array("images"), request_handlers_1.HttpRequestHandlers.saveBlog);
router.delete('/blogs/:blogId/:authorId', request_handlers_1.HttpRequestHandlers.deleteBlogById);
router.put('/blogs/:blogId/', request_handlers_1.HttpRequestHandlers.updateBlog);
router.get('/reviews', request_handlers_1.HttpRequestHandlers.getAllReviewsComponent);
router.get('/reviews/:reviewId', request_handlers_1.HttpRequestHandlers.getAllReviewsById);
router.post('/reviews', request_handlers_1.HttpRequestHandlers.saveReviews);
router.delete('/reviews/:reviewId/:authorId', request_handlers_1.HttpRequestHandlers.deleteReview);
router.put('/reviews/:reviewId', request_handlers_1.HttpRequestHandlers.updateReview);
router.post('/users/:userId/profilePicture', exports.pastTrailImageUpload.single('images'), request_handlers_1.HttpRequestHandlers.uploadProfilePicture);
router.get('/images/:filename', request_handlers_1.HttpRequestHandlers.readImageFromBucket);
router.post('/users/:userId/profilePicture', exports.pastTrailImageUpload.single('images'), request_handlers_1.HttpRequestHandlers.uploadProfilePicture);
router.get('/images/:filename', request_handlers_1.HttpRequestHandlers.readImageFromBucket);
// Cart routes
router.post('/users/:userId/cart', request_handlers_1.HttpRequestHandlers.addToCart);
router.get('/users/:userId/cart', request_handlers_1.HttpRequestHandlers.getCart);
router.put('/users/:userId/cart/:productId', request_handlers_1.HttpRequestHandlers.updateCartItem);
router.delete('/users/:userId/cart/:productId', request_handlers_1.HttpRequestHandlers.removeFromCart);
router.delete('/users/:userId/cart', request_handlers_1.HttpRequestHandlers.clearCart);
router.post('/users/:userId/checkout', request_handlers_1.HttpRequestHandlers.checkout);
// Order routes
router.get('/users/:userId/orders', request_handlers_1.HttpRequestHandlers.getUserOrders);
router.get('/users/:userId/orders/:orderId', request_handlers_1.HttpRequestHandlers.getOrderById);
router.put('/users/:userId/orders/:orderId/status', request_handlers_1.HttpRequestHandlers.updateOrderStatus);
exports.default = router;
//# sourceMappingURL=router.js.map