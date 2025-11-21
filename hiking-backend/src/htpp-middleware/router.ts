import express from "express";
import { HttpRequestHandlers } from "../htpp-middleware/request-handlers";
import multer from "multer";
import path from "path";
import { GridFsStorage } from "multer-gridfs-storage";
import { authenticate, requireAdmin } from "../middleware/auth.middleware";
import { config } from "../config";
import mongoose from "mongoose";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "src/uploads/profileImages",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
});

// Initialize GridFsStorage with URL (it will manage its own connection)
// Using URL ensures GridFsStorage can connect even if mongoose isn't connected yet
// If GridFsStorage fails, use memory storage as fallback to prevent server crash
let pastTrailImageStorage;
let useGridFS = false;

try {
  pastTrailImageStorage = new GridFsStorage({
    url: config.mongo_uri,
    file: (req, file) => {
      if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/webp"
      ) {
        return {
          bucketName: "images",
          filename: `${Date.now()}_${file.originalname}`,
          metadata: {
            mimetype: file.mimetype,
            originalname: file.originalname
          },
          contentType: file.mimetype
        };
      } else {
        return `${Date.now()}_${file.originalname}`;
      }
    },
  });

  pastTrailImageStorage.on('connection', () => {
    console.log('✅ GridFsStorage connected to MongoDB');
    useGridFS = true;
  });

  pastTrailImageStorage.on('connectionFailed', (err: Error) => {
    console.error('❌ GridFsStorage connection failed:', err.message);
    console.warn('⚠️  Falling back to memory storage for file uploads');
    useGridFS = false;
  });

  useGridFS = true;
} catch (error) {
  console.error('❌ Error initializing GridFsStorage:', error);
  console.warn('⚠️  Using memory storage as fallback. Server will continue but uploads will be in memory.');
  pastTrailImageStorage = multer.memoryStorage();
  useGridFS = false;
}

export const pastTrailImageUpload = multer({ storage: pastTrailImageStorage });
export { useGridFS };

router.get("/users", HttpRequestHandlers.data);
router.get("/users/:userId", HttpRequestHandlers.getUser);
router.post("/users", HttpRequestHandlers.signup);
router.delete("/users/:userId", HttpRequestHandlers.deleteUser);
router.get("/users/email/:email", HttpRequestHandlers.getUserByEmail);
router.post("/login", HttpRequestHandlers.login);
router.post(
  "/users/:userId/favorites/:trailId",
  HttpRequestHandlers.addFavoriteTrail
);
router.delete(
  "/users/:userId/favorites/:trailId",
  HttpRequestHandlers.removeFavoriteTrail
);
router.get("/users/:userId/favorites", HttpRequestHandlers.readFavoriteTrails);
router.put("/users/:userId", HttpRequestHandlers.updateUser);
router.get("/reminders", HttpRequestHandlers.getAllReminders);
router.get("/reminders/:reminderId", HttpRequestHandlers.getReminderById);
router.get("/reminders/user/:userId", HttpRequestHandlers.getUserReminders);
router.get("/reminders", HttpRequestHandlers.getAllReminders);
router.get("/reminders/:reminderId", HttpRequestHandlers.getReminderById);
router.get("/reminders/user/:userId", HttpRequestHandlers.getUserReminders);

router.post(
  "/users/:userId/user-trails",
  pastTrailImageUpload.array("images"),
  HttpRequestHandlers.addPastTrail
);
router.get(
  "/users/:userId/user-trails/:trailId",
  HttpRequestHandlers.getSinglePastTrail
);
router.get("/pastTrailimages/:imageId", HttpRequestHandlers.getPastTrailImage);
router.delete(
  "/users/:userId/user-trails/:trailId",
  HttpRequestHandlers.removePastTrail
);
router.get("/users/:userId/user-trails", HttpRequestHandlers.getPastTrails);

router.get("/trails", HttpRequestHandlers.getAllTrails);
router.get("/trails/:trailId", HttpRequestHandlers.getTrail);
// Create and delete trails require admin authentication
router.post("/trails", authenticate, requireAdmin, HttpRequestHandlers.createTrail);
router.put("/trails/:trailId", HttpRequestHandlers.updateTrail);
router.delete("/trails/:trailId", authenticate, requireAdmin, HttpRequestHandlers.deleteTrail);
router.post(
  "/trails/:trailId/reviews/:userId",
  HttpRequestHandlers.rateAndReviewTrail
);
router.put(
  "/trails/:trailId/reviews/:userId",
  HttpRequestHandlers.updateRateAndReviewTrail
);
router.delete(
  "/trails/:trailId/reviews/:userId",
  HttpRequestHandlers.deleteReviewTrail
);
router.get("/trails/:trailId/reviews", HttpRequestHandlers.getAllReviews);
router.get("/hikeBuddies", HttpRequestHandlers.getHikeBuddies);
router.post("/hikeBuddies/search", HttpRequestHandlers.searchHikeBuddies);

router.get("/trails/trail/:trailName", HttpRequestHandlers.getTrailByName);

router.get("/events", HttpRequestHandlers.getAllEvents);
router.get("/events/:eventId", HttpRequestHandlers.getEventById);
router.post(
  "/events/trailId/:trailId/creatorId/:creatorId",
  HttpRequestHandlers.saveEvent
);
// Delete event - requires authentication (admin or creator can delete)
router.delete(
  "/events/:eventId",
  authenticate,
  HttpRequestHandlers.deleteEventById
);
router.post(
  "/events/:eventId/creatorId/:creatorId",
  HttpRequestHandlers.updateEventById
);
router.post("/events/join/:eventId/:userId", HttpRequestHandlers.joinEvent);
router.delete("/events/leave/:eventId/:userId", HttpRequestHandlers.leaveEvent);

router.get('/blogs', HttpRequestHandlers.getAllBlogs);
router.get('/blogs/:blogsId', HttpRequestHandlers.getBlogsById);
router.post('/blogs/:authorId', pastTrailImageUpload.array("images"), HttpRequestHandlers.saveBlog);
router.delete('/blogs/:blogId/:authorId', HttpRequestHandlers.deleteBlogById);
router.put('/blogs/:blogId/', HttpRequestHandlers.updateBlog);

router.get('/reviews', HttpRequestHandlers.getAllReviewsComponent);
router.get('/reviews/:reviewId', HttpRequestHandlers.getAllReviewsById);
router.post('/reviews', HttpRequestHandlers.saveReviews);
router.delete('/reviews/:reviewId/:authorId', HttpRequestHandlers.deleteReview);
router.put('/reviews/:reviewId', HttpRequestHandlers.updateReview);




// Test endpoint to verify server is receiving requests
router.post('/users/:userId/profilePicture/test', (req, res) => {
  console.log('✅ Test endpoint reached for profile picture upload');
  res.status(200).json({ message: 'Server is receiving POST requests', userId: req.params.userId });
});

router.post(
  '/users/:userId/profilePicture',
  pastTrailImageUpload.single('images'),
  HttpRequestHandlers.uploadProfilePicture
);

router.get('/images/:filename', HttpRequestHandlers.readImageFromBucket);

// Cart routes
router.post('/users/:userId/cart', HttpRequestHandlers.addToCart);
router.get('/users/:userId/cart', HttpRequestHandlers.getCart);
router.put('/users/:userId/cart/:productId', HttpRequestHandlers.updateCartItem);
router.delete('/users/:userId/cart/:productId', HttpRequestHandlers.removeFromCart);
router.delete('/users/:userId/cart', HttpRequestHandlers.clearCart);
router.post('/users/:userId/checkout', HttpRequestHandlers.checkout);

// Order routes
router.get('/users/:userId/orders', HttpRequestHandlers.getUserOrders);
router.get('/users/:userId/orders/:orderId', HttpRequestHandlers.getOrderById);
router.put('/users/:userId/orders/:orderId/status', HttpRequestHandlers.updateOrderStatus);

export default router;
