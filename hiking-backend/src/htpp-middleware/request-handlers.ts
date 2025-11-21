import { UserController } from '../controllers/user';
import { HTTP_CODE } from '../enums/http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { PastTrailsController } from '../controllers/user-trails';
import { TrailController } from '../controllers/trail';
import fs from 'fs';
import { promisify } from 'util';
import EventModel from '../models/Event';
import { EventController } from '../controllers/event';
import mongoose from 'mongoose';
import { Readable } from 'stream';
import { BlogsController } from '../controllers/blogs';
import BlogsModel from '../models/Blogs';
import { ReminderController } from '../controllers/reminder';
import { ReviewController } from '../controllers/review';
import ReviewsModel from '../models/Review';

export class HttpRequestHandlers {
  static data = async (req: Request, res: Response) => {
    try {
      const userController = new UserController();
      const users = await userController.getUsers();
      return res.status(HTTP_CODE.OK).json(users);
    } catch (error: any) {
      console.error('Get users error:', error);
      return res.status(HTTP_CODE.InternalServerError).json({
        error: error?.message || 'Internal Server Error'
      });
    }
  };

  static getUser = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      if (!userId) {
        return res.status(HTTP_CODE.BadRequest).json({
          error: 'User ID is required'
        });
      }

      const userController = new UserController();
      const user = await userController.getUserById(userId);

      if (!user) {
        return res.status(HTTP_CODE.NotFound).json({
          message: `User ${userId} not found`
        });
      }

      return res.status(HTTP_CODE.OK).json(user);
    } catch (error: any) {
      console.error('Get user error:', error);
      return res.status(HTTP_CODE.InternalServerError).json({
        error: error?.message || 'Internal Server Error'
      });
    }
  };

  static signup = async (req: Request, res: Response) => {
    try {
      const userObj: any = req.body;

      console.log('Signup request:', { email: userObj?.email, firstName: userObj?.firstName });

      const userController = new UserController();
      const result = await userController.signup(userObj);

      return res.status(HTTP_CODE.Created).json(result);
    } catch (err: any) {
      console.error('Signup error:', err);

      const statusCode = err?.code || HTTP_CODE.InternalServerError;
      const errorMessage = err?.message || 'Internal Server Error';

      return res.status(statusCode).json({
        error: errorMessage
      });
    }
  };

  static deleteUser = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      if (!userId) {
        return res.status(HTTP_CODE.BadRequest).json({
          error: 'User ID is required'
        });
      }

      const userController = new UserController();
      await userController.deleteUser(userId);

      return res.status(HTTP_CODE.OK).json({
        message: `User ${userId} deleted successfully`
      });
    } catch (error: any) {
      console.error('Delete user error:', error);
      return res.status(HTTP_CODE.InternalServerError).json({
        error: error?.message || 'Internal Server Error'
      });
    }
  };

  static getUserByEmail = async (req: Request, res: Response) => {
    try {
      const userEmail = req.params.email;

      if (!userEmail) {
        return res.status(HTTP_CODE.BadRequest).json({
          error: 'User email is required'
        });
      }

      const userController = new UserController();
      const user = await userController.getUserByEmail(userEmail);

      if (!user) {
        return res.status(HTTP_CODE.NotFound).json({
          message: `User ${userEmail} not found`
        });
      }

      return res.status(HTTP_CODE.OK).json(user);
    } catch (error: any) {
      console.error('Get user by email error:', error);
      return res.status(HTTP_CODE.InternalServerError).json({
        error: error?.message || 'Internal Server Error'
      });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      // Express tashmë ka lexuar body-n me express.json() middleware
      const { email, password } = req.body;

      console.log('Login request:', { email, password: password ? '***' : 'missing' });

      if (!email || !password) {
        return res.status(HTTP_CODE.BadRequest).json({
          error: 'Email dhe password janë të nevojshme!'
        });
      }

      const userController = new UserController();
      const result = await userController.login(email, password);

      console.log('Login result:', { statusCode: result.statusCode, hasUser: !!result.data.user });

      return res.status(result.statusCode).json(result.data);
    } catch (err: any) {
      console.error('Login error:', err);
      console.error('Error message:', err?.message);
      console.error('Error code:', err?.code);

      const statusCode = err?.code || HTTP_CODE.InternalServerError;
      const errorMessage = err?.message || 'Internal Server Error';

      return res.status(statusCode).json({
        error: errorMessage
      });
    }
  };

  static addFavoriteTrail = async (req: Request, res: Response) => {
    try {
      const { userId, trailId } = req.params;
      const userController = new UserController();
      await userController.addFavoriteTrail(userId, trailId);
      res
        .status(HTTP_CODE.OK)
        .json({ message: 'Favorite trail added successfully' });
    } catch (error) {
      console.error('Error adding favorite trail:', error);
      res
        .status(HTTP_CODE.InternalServerError)
        .json({ error: 'Failed to add favorite trail' });
    }
  };
  static removeFavoriteTrail = async (req: Request, res: Response) => {
    try {
      const { userId, trailId } = req.params;
      const userController = new UserController();
      await userController.removeFavoriteTrail(userId, trailId);
      res
        .status(HTTP_CODE.OK)
        .json({ message: 'Favorite trail removed successfully' });
    } catch (error) {
      console.error('Error removing favorite trail:', error);
      res
        .status(HTTP_CODE.InternalServerError)
        .json({ error: 'Failed to remove favorite trail' });
    }
  };
  static readFavoriteTrails = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const userController = new UserController();
      const response = await userController.readFavoriteTrails(userId);
      console.log('Response sent:', response);
      res.status(HTTP_CODE.OK).json(response);
    } catch (error) {
      res.status(HTTP_CODE.InternalServerError).json({ error: 'Failed' });
    }
  };

  static updateUser = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const updatedFields = req.body;

      if (!userId) {
        return res.status(HTTP_CODE.BadRequest).json({
          error: 'User ID is required'
        });
      }

      console.log('Update user request:', { userId, fields: Object.keys(updatedFields) });

      const userController = new UserController();
      const result = await userController.updateUser(userId, updatedFields);

      return res.status(HTTP_CODE.OK).json(result);
    } catch (err: any) {
      console.error('Update user error:', err);

      const statusCode = err?.code || HTTP_CODE.InternalServerError;
      const errorMessage = err?.message || 'Internal Server Error';

      return res.status(statusCode).json({
        error: errorMessage
      });
    }
  };

  static getAllReminders = async (req: Request, res: Response) => {
    try {
      const reminderController = new ReminderController();
      const reminders = await reminderController.getAllReminders();
      return res.status(HTTP_CODE.OK).json(reminders);
    } catch (error: any) {
      console.error('Get all reminders error:', error);
      return res.status(HTTP_CODE.InternalServerError).json({
        error: error?.message || 'Internal Server Error'
      });
    }
  };

  static getReminderById = async (req: Request, res: Response) => {
    try {
      const { reminderId } = req.params;

      if (!reminderId) {
        return res.status(HTTP_CODE.BadRequest).json({
          error: 'Reminder ID is required'
        });
      }

      const reminderController = new ReminderController();
      const reminder = await reminderController.getReminderById(reminderId);

      if (!reminder) {
        return res.status(HTTP_CODE.NotFound).json({
          message: `Reminder ${reminderId} not found`
        });
      }

      return res.status(HTTP_CODE.OK).json(reminder);
    } catch (error: any) {
      console.error('Get reminder by ID error:', error);
      return res.status(HTTP_CODE.InternalServerError).json({
        error: error?.message || 'Internal Server Error'
      });
    }
  };
  static getUserReminders = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(HTTP_CODE.BadRequest).json({
          error: 'User ID is required'
        });
      }

      const reminderController = new ReminderController();
      const reminders = await reminderController.getUserReminders(userId);

      if (!reminders || reminders.length === 0) {
        return res.status(HTTP_CODE.OK).json([]);
      }

      return res.status(HTTP_CODE.OK).json(reminders);
    } catch (error: any) {
      console.error('Get user reminders error:', error);
      return res.status(HTTP_CODE.InternalServerError).json({
        error: error?.message || 'Internal Server Error'
      });
    }
  };

  static addPastTrail = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const pastTrailData = req.body;
      const images = req.files as Express.Multer.File[];

      console.log(images);


      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'images',
      });

      for (const file of images) {
        const existingFile = await bucket
          .find({ filename: file.filename })
          .toArray();
        if (existingFile && existingFile.length > 0) {
          continue;
        }

        const uploadStream = bucket.openUploadStream(file.filename);
        const readableStream = new Readable();
        readableStream.push(file.buffer);
        readableStream.push(null);
      }

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const trailController = new PastTrailsController();
      const result = await trailController.addPastTrail(
        userId,
        pastTrailData,
        images
      );
      res.status(200).json(result);
    } catch (error) {
      console.error('Error adding past trail:', error);
      res.status(500).json({ error: 'Failed to add past trail' });
    }
  };

  static getPastTrailImage = async (req: Request, res: Response) => {
    try {
      const { imageId } = req.params;
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'images',
      });

      const file = await bucket.find({ filename: imageId }).toArray();

      if (!file || file.length === 0) {
        return res.status(404).send('Image not found');
      }

      res.set('Access-Control-Allow-Origin', '*');

      res.contentType('image/png');

      const downloadStream = bucket.openDownloadStreamByName(imageId);
      downloadStream.pipe(res);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  };

  static removePastTrail = async (req: Request, res: Response) => {
    try {
      const { userId, trailId } = req.params;

      if (!userId || !trailId) {
        return res.status(HTTP_CODE.BadRequest).json({
          error: 'User ID and Trail ID are required'
        });
      }

      const trailController = new PastTrailsController();
      await trailController.removePastTrail(userId, trailId);

      return res.status(HTTP_CODE.OK).json({
        message: 'Past trail removed successfully'
      });
    } catch (error: any) {
      console.error('Error removing past trail:', error);
      return res.status(HTTP_CODE.InternalServerError).json({
        error: error?.message || 'Failed to remove past trail'
      });
    }
  };

  static getPastTrails = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const userController = new PastTrailsController();
      const trails = await userController.getPastTrails(userId);
      res.status(HTTP_CODE.OK).json({ trails: trails });
    } catch (error) {
      console.error('Error reading past trails:', error);
      res
        .status(HTTP_CODE.InternalServerError)
        .json({ error: 'Failed to read past trails' });
    }
  };

  static getSinglePastTrail = async (req: Request, res: Response) => {
    try {
      const { userId, trailId } = req.params;
      const trailController = new PastTrailsController();
      const trail = await trailController.getSingleTrail(userId, trailId);

      if (!trail) {
        res
          .status(HTTP_CODE.NotFound)
          .json({ message: `Trail ${trailId} not found` });
      } else {
        res.status(HTTP_CODE.OK).json(trail);
      }
    } catch (error) {
      console.error('Error retrieving single past trail:', error);
      res
        .status(HTTP_CODE.InternalServerError)
        .json({ error: 'Failed to retrieve past trail' });
    }
  };

  static getAllTrails = async (req: Request, res: Response) => {
    try {
      const trailController = new TrailController();
      const trails = await trailController.getAllTrails();
      return res.status(HTTP_CODE.OK).json(trails);
    } catch (error: any) {
      console.error('Get all trails error:', error);
      return res.status(HTTP_CODE.InternalServerError).json({
        error: error?.message || 'Internal Server Error'
      });
    }
  };

  static getTrail = async (req: Request, res: Response) => {
    try {
      const trailId = req.params.trailId;

      if (!trailId) {
        return res.status(HTTP_CODE.BadRequest).json({
          error: 'Trail ID is required'
        });
      }

      const trailController = new TrailController();
      const trail = await trailController.getTrailById(trailId);

      if (!trail) {
        return res.status(HTTP_CODE.NotFound).json({
          message: `Trail ${trailId} not found`
        });
      }

      return res.status(HTTP_CODE.OK).json(trail);
    } catch (error: any) {
      console.error('Get trail error:', error);
      return res.status(HTTP_CODE.InternalServerError).json({
        error: error?.message || 'Internal Server Error'
      });
    }
  };

  static getTrailByName = async (req: Request, res: Response) => {
    try {
      const trailName = req.params.trailName;

      if (!trailName) {
        return res.status(HTTP_CODE.BadRequest).json({
          error: 'Trail name is required'
        });
      }

      const trailController = new TrailController();
      const trail = await trailController.getTrailByName(trailName);

      if (!trail) {
        return res.status(HTTP_CODE.NotFound).json({
          message: `Trail ${trailName} not found`
        });
      }

      return res.status(HTTP_CODE.OK).json(trail);
    } catch (error: any) {
      console.error('Get trail by name error:', error);
      return res.status(HTTP_CODE.InternalServerError).json({
        error: error?.message || 'Internal Server Error'
      });
    }
  };

  static deleteTrail = async (req: Request, res: Response) => {
    try {
      const trailId = req.params.trailId;

      if (!trailId) {
        return res.status(HTTP_CODE.BadRequest).json({
          error: 'Trail ID is required'
        });
      }

      const trailController = new TrailController();
      await trailController.deleteTrail(trailId);

      return res.status(HTTP_CODE.OK).json({
        message: `Trail ${trailId} deleted successfully`
      });
    } catch (error: any) {
      console.error('Delete trail error:', error);
      return res.status(HTTP_CODE.InternalServerError).json({
        error: error?.message || 'Internal Server Error'
      });
    }
  };

  static createTrail = async (req: Request, res: Response) => {
    try {
      const trailObj: any = req.body;
      console.log('Create trail request:', { name: trailObj?.name });

      const trailController = new TrailController();
      const result = await trailController.createTrail(trailObj);

      return res.status(HTTP_CODE.Created).json(result);
    } catch (err: any) {
      console.error('Create trail error:', err);
      const statusCode = err?.code || HTTP_CODE.InternalServerError;
      return res.status(statusCode).json({
        error: err?.message || 'Internal Server Error',
      });
    }
  };
  static updateTrail = async (req: Request, res: Response) => {
    try {
      const trailId = req.params.trailId;
      const updatedFields = req.body;

      if (!trailId) {
        return res.status(HTTP_CODE.BadRequest).json({
          error: 'Trail ID is required'
        });
      }

      console.log('Update trail request:', { trailId, fields: Object.keys(updatedFields) });

      const trailController = new TrailController();
      const result = await trailController.updateTrail(trailId, updatedFields);

      return res.status(HTTP_CODE.OK).json(result);
    } catch (err: any) {
      console.error('Update trail error:', err);
      const statusCode = err?.code || HTTP_CODE.InternalServerError;
      return res.status(statusCode).json({
        error: err?.message || 'Internal Server Error',
      });
    }
  };

  static rateAndReviewTrail = async (req: Request, res: Response) => {
    try {
      const trailId = req.params.trailId;
      const userId = req.params.userId;
      const { rating, comment } = req.body;

      if (!trailId || !userId || !rating || !comment) {
        return res.status(HTTP_CODE.BadRequest).json({
          error: 'Trail ID, User ID, Rating, and Comment are required',
        });
      }

      console.log('Rate and review trail:', { trailId, userId, rating });

      const trailController = new TrailController();
      const result = await trailController.rateAndReviewTrail(
        trailId,
        userId,
        rating,
        comment
      );

      return res.status(HTTP_CODE.OK).json(result);
    } catch (error: any) {
      console.error('Rate and review error:', error);
      const statusCode = error?.code || HTTP_CODE.InternalServerError;
      return res.status(statusCode).json({
        error: error?.message || 'Internal Server Error'
      });
    }
  };

  static updateRateAndReviewTrail = async (req: Request, res: Response) => {
    try {
      const trailId = req.params.trailId;
      const userId = req.params.userId;
      const { rating, comment } = req.body;

      if (!trailId || !userId || !rating || !comment) {
        return res.status(HTTP_CODE.BadRequest).json({
          error: 'Trail ID, User ID, Rating, and Comment are required',
        });
      }

      console.log('Update rate and review:', { trailId, userId, rating });

      const trailController = new TrailController();
      const result = await trailController.updateRateAndReviewTrail(
        trailId,
        userId,
        rating,
        comment
      );

      return res.status(HTTP_CODE.OK).json(result);
    } catch (error: any) {
      console.error('Update rate and review error:', error);
      const statusCode = error?.code || HTTP_CODE.InternalServerError;
      return res.status(statusCode).json({
        error: error?.message || 'Internal Server Error'
      });
    }
  };

  static deleteReviewTrail = async (req: Request, res: Response) => {
    try {
      const { userId, trailId } = req.params;
      const trailController = new TrailController();
      await trailController.deleteReview(trailId, userId);
      res.status(HTTP_CODE.OK).json({ message: 'Review deleted successfully' });
    } catch (error) {
      console.error('Error deleting review:', error);
      res
        .status(HTTP_CODE.InternalServerError)
        .json({ error: 'Failed to delete review' });
    }
  };

  static getAllReviews = async (req: Request, res: Response) => {
    try {
      const trailId = req.params.trailId;
      const trailController = new TrailController();
      const reviews = await trailController.getAllReivews(trailId);
      res.status(HTTP_CODE.OK).json(reviews);
    } catch (error) {
      console.error('Error:', error);
      res
        .status(HTTP_CODE.InternalServerError)
        .json({ error: 'Internal Server Error' });
    }
  };

  static getHikeBuddies = async (req: Request, res: Response) => {
    try {
      const userController = new UserController();
      const users = await userController.getAllHikeBuddies();
      return res.status(HTTP_CODE.OK).json(users);
    } catch (error: any) {
      console.error('Get hike buddies error:', error);
      return res.status(HTTP_CODE.InternalServerError).json({
        error: error?.message || 'Internal Server Error'
      });
    }
  };

  static searchHikeBuddies = async (req: Request, res: Response) => {
    try {
      const { fullName, location, skillLevel, gender } = req.body;

      console.log('Search hike buddies:', { fullName, location, skillLevel, gender });

      const userController = new UserController();
      const hikeBuddies = await userController.searchForHikeBuddies({
        fullName,
        location,
        skillLevel,
        gender,
      });

      return res.status(HTTP_CODE.OK).json(hikeBuddies);
    } catch (error: any) {
      console.error('Search hike buddies error:', error);
      return res.status(HTTP_CODE.InternalServerError).json({
        error: error?.message || 'Internal Server Error'
      });
    }
  };

  // Import your models

  static getAllEvents = async (req: Request, res: Response) => {
    try {
      const eventController = new EventController();
      const allEvents = await eventController.getEvents();
      return res.status(HTTP_CODE.OK).json(allEvents);
    } catch (error: any) {
      console.error('Get all events error:', error);
      return res.status(HTTP_CODE.InternalServerError).json({
        error: error?.message || 'Internal Server Error'
      });
    }
  };

  static getEventById = async (req: Request, res: Response) => {
    try {
      const eventId = req.params.eventId;
      if (!eventId) {
        return res.status(HTTP_CODE.BadRequest).json({
          error: 'Event ID is required'
        });
      }

      const eventController = new EventController();
      const event = await eventController.getEventById(eventId);

      if (!event) {
        return res.status(HTTP_CODE.NotFound).json({
          error: 'Event not found'
        });
      }

      return res.status(HTTP_CODE.OK).json(event);
    } catch (error: any) {
      console.error('Get event by ID error:', error);
      return res.status(HTTP_CODE.InternalServerError).json({
        error: error?.message || 'Internal Server Error'
      });
    }
  };
  static saveEvent = async (req: Request, res: Response) => {
    try {
      const trailId = req.params.trailId;
      const creatorId = req.params.creatorId;
      const eventObj: any = req.body;

      if (!trailId || !creatorId) {
        return res.status(HTTP_CODE.BadRequest).json({
          error: 'Trail ID and Creator ID are required'
        });
      }

      console.log('Save event:', { trailId, creatorId, eventData: eventObj });

      const eventController = new EventController();
      const result = await eventController.saveEvent(
        eventObj,
        trailId,
        creatorId
      );

      return res.status(HTTP_CODE.Created).json({
        message: 'Event saved successfully',
        result
      });
    } catch (err: any) {
      console.error('Save event error:', err);
      const statusCode = err?.code || HTTP_CODE.InternalServerError;
      return res.status(statusCode).json({
        error: err?.message || 'Internal Server Error',
      });
    }
  };
  static deleteEventById = async (req: Request, res: Response) => {
    try {
      const { eventId } = req.params;
      const eventController = new EventController();

      // req.user is set by authenticate middleware
      const userId = req.user?._id?.toString();
      const isAdmin = req.user?.role === 'admin';

      if (!userId) {
        return res.status(HTTP_CODE.Unauthorized).json({
          error: 'Authentication required'
        });
      }

      const event = await EventModel.findById(eventId);

      if (!event) {
        return res.status(HTTP_CODE.NotFound).json({ error: 'Event not found' });
      }

      // Allow deletion if user is admin OR if user is the creator
      if (!isAdmin && event.creator.toString() !== userId.toString()) {
        return res
          .status(HTTP_CODE.Forbidden)
          .json({ error: 'You are not authorized to delete this event' });
      }

      await eventController.deleteEvent(eventId, userId, isAdmin);
      return res.status(HTTP_CODE.OK).json({ message: 'Event deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting event:', error);
      const statusCode = error?.code || HTTP_CODE.InternalServerError;
      return res.status(statusCode).json({
        error: error?.message || 'Internal Server Error'
      });
    }
  };

  static updateEventById = async (req: Request, res: Response) => {
    try {
      const { eventId, creatorId } = req.params;
      const updatedFields = req.body;

      if (!eventId) {
        return res.status(HTTP_CODE.BadRequest).json({
          error: 'Event ID is required'
        });
      }
      if (!creatorId) {
        return res.status(HTTP_CODE.BadRequest).json({
          error: 'Creator ID is required'
        });
      }

      console.log('Update event:', { eventId, creatorId, fields: Object.keys(updatedFields) });

      const eventController = new EventController();
      const result = await eventController.updateEvent(
        updatedFields,
        eventId,
        creatorId
      );

      return res.status(HTTP_CODE.OK).json(result);
    } catch (err: any) {
      console.error('Update event error:', err);
      const statusCode = err?.code || HTTP_CODE.InternalServerError;
      return res.status(statusCode).json({
        error: err?.message || 'Internal Server Error',
      });
    }
  };
  static joinEvent = async (req: Request, res: Response) => {
    try {
      const { eventId, userId } = req.params;

      if (!eventId || !userId) {
        return res.status(HTTP_CODE.BadRequest).json({
          error: 'Event ID and User ID are required'
        });
      }

      console.log('Join event request:', { eventId, userId });

      const eventController = new EventController();
      await eventController.joinEvent(eventId, userId);

      res
        .status(HTTP_CODE.OK)
        .json({ message: 'User joined event successfully' });
    } catch (error: any) {
      console.error('Error joining to event:', error);

      // Use error code if available, otherwise default to 500
      const statusCode = error?.code || HTTP_CODE.InternalServerError;
      const errorMessage = error?.message || 'Failed to join event';

      res
        .status(statusCode)
        .json({ error: errorMessage });
    }
  };
  static leaveEvent = async (req: Request, res: Response) => {
    try {
      const { eventId, userId } = req.params;
      const eventController = new EventController();
      await eventController.leaveEvent(eventId, userId);
      res
        .status(HTTP_CODE.OK)
        .json({ message: 'User left event successfully' });
    } catch (error) {
      console.error('Error leaving event:', error);
      res
        .status(HTTP_CODE.InternalServerError)
        .json({ error: 'Failed to leave event' });
    }
  };

  static saveBlog = async (req: Request, res: Response) => {
    try {
      const { authorId } = req.params;
      const blogData = req.body;
      const images = req.files as Express.Multer.File[];

      if (!authorId) {
        return res.status(400).json({ error: 'Author ID is required' });
      }

      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'images',
      });

      for (const file of images) {
        const existingFile = await bucket
          .find({ filename: file.filename })
          .toArray();
        if (existingFile && existingFile.length > 0) {
          continue;
        }

        const uploadStream = bucket.openUploadStream(file.filename);
        const readableStream = new Readable();
        readableStream.push(file.buffer);
        readableStream.push(null);
      }


      const blogController = new BlogsController();
      const result = await blogController.saveBlog(
        authorId,
        blogData,
        images
      );
      res.status(200).json(result);
    } catch (error) {
      console.error('Error adding blog post:', error);
      res.status(500).json({ error: 'Failed to add blog post' });
    }
  };
  static getAllBlogs = async (req: Request, res: Response) => {
    try {
      const blogsController = new BlogsController();
      const blogs = await blogsController.getBlogs();
      res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(blogs));
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(HTTP_CODE.InternalServerError, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  };
  static getBlogsById = async (req: Request, res: Response) => {
    try {
      const blogId = req.url?.split('/')[2];
      if (!blogId) {
        res.writeHead(HTTP_CODE.BadRequest, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ error: 'Blog ID is required' }));
        return;
      }
      const blog = await BlogsModel.findById(blogId);

      if (!blog) {
        res.writeHead(HTTP_CODE.NotFound, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ message: `Blog ${blogId} not found` }));
      } else {
        res.writeHead(HTTP_CODE.OK, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(blog));
      }
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(HTTP_CODE.InternalServerError, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  };
  static updateBlog = async (req: Request, res: Response) => {
    try {
      const blogId = req.params.blogId;
      const updatedFields = req.body;

      if (!blogId) {
        return res.status(HTTP_CODE.BadRequest).json({
          error: 'Blog ID is required'
        });
      }

      console.log('Update blog:', { blogId, fields: Object.keys(updatedFields) });

      const blogsController = new BlogsController();
      const result = await blogsController.updateBlog(blogId, updatedFields);

      return res.status(HTTP_CODE.OK).json(result);
    } catch (err: any) {
      console.error('Update blog error:', err);
      const statusCode = err?.code || HTTP_CODE.InternalServerError;
      return res.status(statusCode).json({
        error: err?.message || 'Internal Server Error',
      });
    }
  };



  static deleteBlogById = async (req: Request, res: Response) => {
    try {
      const { blogId, authorId } = req.params;
      const blog = await BlogsModel.findById(blogId);
      const blogsController = new BlogsController();

      if (!blog) {
        res.status(HTTP_CODE.NotFound).json({ error: 'Blog not found' });
        return;
      }

      if (blog.author.toString() !== authorId.toString()) {
        res
          .status(HTTP_CODE.Forbidden)
          .json({ error: 'You are not authorized to delete this blog' });
        return;
      }
      await blogsController.deleteBlog(blogId, authorId);
      res.status(HTTP_CODE.OK).json({ message: 'Blog deleted successfully' });
    } catch (error) {
      console.error('Error deleting blog:', error);
      res.status(HTTP_CODE.InternalServerError).json({ error: 'Internal Server Error' });
    }
  };

  static getAllReviewsComponent = async (req: Request, res: Response) => {
    try {
      const reviewController = new ReviewController();
      const reviews = await reviewController.getReviews();
      return res.status(HTTP_CODE.OK).json(reviews);
    } catch (error: any) {
      console.error('Get all reviews error:', error);
      return res.status(HTTP_CODE.InternalServerError).json({
        error: error?.message || 'Internal Server Error'
      });
    }
  };

  static getAllReviewsById = async (req: Request, res: Response) => {
    try {
      const reviewId = req.params.reviewId;

      if (!reviewId) {
        return res.status(HTTP_CODE.BadRequest).json({
          error: 'Review ID is required'
        });
      }

      const blog = await BlogsModel.findById(reviewId);

      if (!blog) {
        return res.status(HTTP_CODE.NotFound).json({
          message: `Review ${reviewId} not found`
        });
      }

      return res.status(HTTP_CODE.OK).json(blog);
    } catch (error: any) {
      console.error('Get review by ID error:', error);
      return res.status(HTTP_CODE.InternalServerError).json({
        error: error?.message || 'Internal Server Error'
      });
    }
  };

  static saveReviews = async (req: Request, res: Response) => {
    try {
      const reviewsObj: any = req.body;

      console.log('Save review:', { reviewData: reviewsObj });

      const reviewController = new ReviewController();
      const result = await reviewController.saveReview(reviewsObj);

      return res.status(HTTP_CODE.Created).json(result);
    } catch (err: any) {
      console.error('Save review error:', err);
      const statusCode = err?.code || HTTP_CODE.InternalServerError;
      return res.status(statusCode).json({
        error: err?.message || 'Internal Server Error',
      });
    }
  };

  static deleteReview = async (req: Request, res: Response) => {
    try {
      const { reviewId, authorId } = req.params;
      const review = await ReviewsModel.findById(reviewId);
      const reviewController = new ReviewController();

      if (!review) {
        res.status(HTTP_CODE.NotFound).json({ error: 'Review not found' });
        return;
      }

      if (review.author.toString() !== authorId.toString()) {
        res.status(HTTP_CODE.Forbidden).json({ error: 'You are not authorized to delete this review' });
        return;
      }
      await reviewController.deleteReview(reviewId, authorId);
      res.status(HTTP_CODE.OK).json({ message: 'Review deleted successfully' });

    } catch (error) {
      console.error('Error deleting blog:', error);
      res.status(HTTP_CODE.InternalServerError).json({ error: 'Internal Server Error' });
    }
  };


  static updateReview = async (req: Request, res: Response) => {
    try {
      const reviewId = req.params.reviewId;
      const updateReview = req.body;

      if (!reviewId) {
        return res.status(HTTP_CODE.BadRequest).json({
          error: 'Review ID is required'
        });
      }

      console.log('Update review:', { reviewId, fields: Object.keys(updateReview) });

      const reviewController = new ReviewController();
      const result = await reviewController.updateReview(reviewId, updateReview);

      return res.status(HTTP_CODE.OK).json(result);
    } catch (err: any) {
      console.error('Update review error:', err);
      const statusCode = err?.code || HTTP_CODE.InternalServerError;
      return res.status(statusCode).json({
        error: err?.message || 'Internal Server Error',
      });
    }
  };

  static uploadProfilePicture = async (req: Request, res: Response) => {
    try {
      console.log('=== Profile Picture Upload Request ===');
      console.log('Params:', req.params);
      console.log('File:', req.file ? {
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        originalname: req.file.originalname,
        buffer: req.file.buffer ? `${req.file.buffer.length} bytes` : 'no buffer'
      } : 'No file');

      const { userId } = req.params;
      const image = req.file as Express.Multer.File;

      if (!userId) {
        console.error('User ID missing');
        return res.status(400).json({ error: 'User ID is required' });
      }

      if (!image) {
        console.error('Image file missing');
        return res.status(400).json({ error: 'Image file is required' });
      }

      // If using memory storage (GridFS failed), we need to manually upload to GridFS
      let finalFilename = image.filename;
      if (image.buffer && (!image.filename || image.buffer.length > 0)) {
        console.log('Using memory storage or buffer detected - manually uploading to GridFS...');
        console.log('Image filename before:', image.filename);
        console.log('Image buffer size:', image.buffer ? image.buffer.length : 'no buffer');

        finalFilename = image.filename || `${Date.now()}_${image.originalname}`;

        // Only upload if buffer exists and filename is missing or different
        if (image.buffer && (!image.filename || !mongoose.connection.db)) {
          console.log('Manual GridFS upload needed...');
          const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: 'images',
          });

          const readableStream = new Readable();
          readableStream.push(image.buffer);
          readableStream.push(null);

          const uploadStream = bucket.openUploadStream(finalFilename, {
            metadata: {
              mimetype: image.mimetype,
              originalname: image.originalname
            },
            contentType: image.mimetype
          });

          readableStream.pipe(uploadStream);

          await new Promise<void>((resolve, reject) => {
            uploadStream.on('finish', () => {
              console.log('✅ Image uploaded to GridFS manually:', finalFilename);
              resolve();
            });
            uploadStream.on('error', (error) => {
              console.error('❌ GridFS upload error:', error);
              reject(error);
            });
          });
        }
      }

      finalFilename = finalFilename || image.filename;

      if (!finalFilename) {
        console.error('Image filename missing after processing');
        return res.status(400).json({ error: 'Image filename is missing' });
      }

      // Ensure image.filename is set
      image.filename = finalFilename;

      console.log('Final image filename:', finalFilename);
      console.log('Updating user profile picture reference...');

      const userController = new UserController();
      const result = await userController.uploadProfilePicture(userId, image);
      console.log('✅ Profile picture upload complete, returning result:', result);
      res.status(200).json(result);
    } catch (error) {
      console.error('❌ Error handling profile picture upload:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to handle profile picture upload', details: error instanceof Error ? error.message : 'Unknown error' });
      }
    }
  };


  static readImageFromBucket = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filename = req.params.filename;
      console.log('Reading image from GridFS:', filename);

      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'images',
      });

      // First, find the file to get its metadata (mimetype)
      const files = await bucket.find({ filename: filename }).toArray();

      if (!files || files.length === 0) {
        console.error('Image not found in GridFS:', filename);
        return res.status(404).json({ error: 'Image not found' });
      }

      const file = files[0];
      const mimetype = file.metadata?.mimetype || file.contentType || file.metadata?.type || 'image/jpeg';

      console.log('Image found, mimetype:', mimetype, 'filename:', filename);

      const downloadStream = bucket.openDownloadStreamByName(filename);

      let imageData = Buffer.from([]);
      let hasError = false;

      downloadStream.on('data', (chunk) => {
        imageData = Buffer.concat([imageData, chunk]);
      });

      downloadStream.on('end', () => {
        if (!hasError && imageData.length > 0) {
          console.log('Image read successfully, size:', imageData.length, 'bytes');
          res.set('Access-Control-Allow-Origin', '*');
          res.set('Content-Type', mimetype);
          res.set('Content-Length', imageData.length.toString());
          res.set('Cache-Control', 'public, max-age=31536000');
          res.send(imageData);
        }
      });

      downloadStream.on('error', (error) => {
        hasError = true;
        console.error('Error reading image from GridFS:', error);
        console.error('Filename:', filename);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to read image' });
        }
      });
    } catch (error) {
      console.error('Error in readImageFromBucket:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to read image' });
      }
    }
  };

  static addToCart = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const product = req.body;

      if (!userId || !product) {
        return res.status(HTTP_CODE.BadRequest).json({
          error: 'User ID and product are required'
        });
      }

      const userController = new UserController();
      const cart = await userController.addToCart(userId, product);

      return res.status(HTTP_CODE.OK).json(cart);
    } catch (error: any) {
      console.error('Add to cart error:', error);
      const statusCode = error?.code || HTTP_CODE.InternalServerError;
      return res.status(statusCode).json({
        error: error?.message || 'Failed to add product to cart'
      });
    }
  };

  static getCart = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;

      if (!userId) {
        return res.status(HTTP_CODE.BadRequest).json({
          error: 'User ID is required'
        });
      }

      const userController = new UserController();
      const cart = await userController.getCart(userId);

      return res.status(HTTP_CODE.OK).json(cart);
    } catch (error: any) {
      console.error('Get cart error:', error);
      const statusCode = error?.code || HTTP_CODE.InternalServerError;
      return res.status(statusCode).json({
        error: error?.message || 'Failed to get cart'
      });
    }
  };

  static updateCartItem = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const productId = parseInt(req.params.productId);
      const { quantity } = req.body;

      if (!userId || !productId || quantity === undefined) {
        return res.status(HTTP_CODE.BadRequest).json({
          error: 'User ID, product ID, and quantity are required'
        });
      }

      const userController = new UserController();
      const cart = await userController.updateCartItem(userId, productId, quantity);

      return res.status(HTTP_CODE.OK).json(cart);
    } catch (error: any) {
      console.error('Update cart item error:', error);
      const statusCode = error?.code || HTTP_CODE.InternalServerError;
      return res.status(statusCode).json({
        error: error?.message || 'Failed to update cart item'
      });
    }
  };

  static removeFromCart = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const productId = parseInt(req.params.productId);

      if (!userId || !productId) {
        return res.status(HTTP_CODE.BadRequest).json({
          error: 'User ID and product ID are required'
        });
      }

      const userController = new UserController();
      const cart = await userController.removeFromCart(userId, productId);

      return res.status(HTTP_CODE.OK).json(cart);
    } catch (error: any) {
      console.error('Remove from cart error:', error);
      const statusCode = error?.code || HTTP_CODE.InternalServerError;
      return res.status(statusCode).json({
        error: error?.message || 'Failed to remove product from cart'
      });
    }
  };

  static clearCart = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;

      if (!userId) {
        return res.status(HTTP_CODE.BadRequest).json({
          error: 'User ID is required'
        });
      }

      const userController = new UserController();
      const result = await userController.clearCart(userId);

      return res.status(HTTP_CODE.OK).json(result);
    } catch (error: any) {
      console.error('Clear cart error:', error);
      const statusCode = error?.code || HTTP_CODE.InternalServerError;
      return res.status(statusCode).json({
        error: error?.message || 'Failed to clear cart'
      });
    }
  };

  static checkout = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const checkoutData = req.body;

      if (!userId) {
        return res.status(HTTP_CODE.BadRequest).json({
          error: 'User ID is required'
        });
      }

      const userController = new UserController();
      const result = await userController.checkout(userId, checkoutData);

      // Send email confirmation (async, don't wait for it)
      try {
        const { sendOrderConfirmationEmail } = await import('../services/emailService');
        sendOrderConfirmationEmail(result, checkoutData.contactInfo?.email || '').catch(err => {
          console.error('Failed to send confirmation email:', err);
        });
      } catch (emailError) {
        console.error('Email service error:', emailError);
        // Don't fail the checkout if email fails
      }

      return res.status(HTTP_CODE.OK).json(result);
    } catch (error: any) {
      console.error('Checkout error:', error);
      const statusCode = error?.code || HTTP_CODE.InternalServerError;
      return res.status(statusCode).json({
        error: error?.message || 'Failed to process checkout'
      });
    }
  };

  static getUserOrders = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;

      if (!userId) {
        return res.status(HTTP_CODE.BadRequest).json({
          error: 'User ID is required'
        });
      }

      const userController = new UserController();
      const orders = await userController.getUserOrders(userId);

      return res.status(HTTP_CODE.OK).json(orders);
    } catch (error: any) {
      console.error('Get user orders error:', error);
      const statusCode = error?.code || HTTP_CODE.InternalServerError;
      return res.status(statusCode).json({
        error: error?.message || 'Failed to get user orders'
      });
    }
  };

  static getOrderById = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const orderId = req.params.orderId;

      if (!userId || !orderId) {
        return res.status(HTTP_CODE.BadRequest).json({
          error: 'User ID and Order ID are required'
        });
      }

      const userController = new UserController();
      const order = await userController.getOrderById(orderId, userId);

      return res.status(HTTP_CODE.OK).json(order);
    } catch (error: any) {
      console.error('Get order error:', error);
      const statusCode = error?.code || HTTP_CODE.InternalServerError;
      return res.status(statusCode).json({
        error: error?.message || 'Failed to get order'
      });
    }
  };

  static updateOrderStatus = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const orderId = req.params.orderId;
      const { status } = req.body;

      if (!userId || !orderId || !status) {
        return res.status(HTTP_CODE.BadRequest).json({
          error: 'User ID, Order ID, and status are required'
        });
      }

      const userController = new UserController();
      const order = await userController.updateOrderStatus(orderId, userId, status);

      return res.status(HTTP_CODE.OK).json(order);
    } catch (error: any) {
      console.error('Update order status error:', error);
      const statusCode = error?.code || HTTP_CODE.InternalServerError;
      return res.status(statusCode).json({
        error: error?.message || 'Failed to update order status'
      });
    }
  };
}
