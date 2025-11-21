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
exports.EventController = void 0;
const Event_1 = __importDefault(require("../models/Event"));
const http_status_codes_1 = require("../enums/http-status-codes");
const Trail_1 = __importDefault(require("../models/Trail"));
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = __importDefault(require("mongoose"));
const reminder_1 = require("./reminder");
class EventController {
    saveEvent(eventObj, trailId, creatorId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("SAVE EVENT");
            try {
                const { date } = eventObj, rest = __rest(eventObj, ["date"]);
                if (!trailId || !creatorId) {
                    const customError = new Error("Creator Id or Trail ID not found!");
                    customError.code = http_status_codes_1.HTTP_CODE.NotFound;
                    throw customError;
                }
                const existingTrail = yield Trail_1.default.findById(trailId);
                if (!existingTrail) {
                    const customError = new Error("Trail not found!");
                    customError.code = http_status_codes_1.HTTP_CODE.NotFound;
                    throw customError;
                }
                const user = yield User_1.default.findById(creatorId);
                if (!user) {
                    const customError = new Error("User not found!");
                    customError.code = http_status_codes_1.HTTP_CODE.NotFound;
                    throw customError;
                }
                const trailIdObj = new mongoose_1.default.Types.ObjectId(trailId);
                const newEvent = new Event_1.default(Object.assign({ trail: trailIdObj, creator: creatorId, date }, rest));
                yield newEvent.save();
                existingTrail.events.push(newEvent._id);
                yield existingTrail.save();
                user.eventsAttending.push(newEvent._id);
                yield user.save();
                const creatorReminderDate = new Date(date);
                creatorReminderDate.setDate(creatorReminderDate.getDate() - 1);
                const creatorMessage = `${newEvent.location} is happening tomorrow.`;
                const reminderController = new reminder_1.ReminderController();
                yield reminderController.createReminder({
                    userId: creatorId,
                    eventId: newEvent._id,
                    reminderDate: creatorReminderDate,
                    message: creatorMessage,
                });
                return newEvent;
            }
            catch (error) {
                console.error("Error saving event:", error);
                throw new Error("Internal Server Error");
            }
        });
    }
    deleteEvent(eventId, creatorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const event = yield Event_1.default.findById(eventId);
                if (!event) {
                    const customError = new Error("Event not found");
                    customError.code = http_status_codes_1.HTTP_CODE.NotFound;
                    throw customError;
                }
                if (event.creator.toString() !== creatorId.toString()) {
                    const customError = new Error("You are not the creator of this event and so you cannot delete it!");
                    customError.code = http_status_codes_1.HTTP_CODE.Forbidden;
                    throw customError;
                }
                yield Event_1.default.findByIdAndDelete(eventId);
                const existingTrail = yield Trail_1.default.findById(event.trail);
                if (!existingTrail) {
                    const customError = new Error("Trail not found");
                    customError.code = http_status_codes_1.HTTP_CODE.NotFound;
                    throw customError;
                }
                existingTrail.events = existingTrail.events.filter((e) => e.toString() !== eventId.toString());
                yield existingTrail.save();
                const user = yield User_1.default.findById(creatorId);
                if (!user) {
                    const customError = new Error("User not found");
                    customError.code = http_status_codes_1.HTTP_CODE.NotFound;
                    throw customError;
                }
                user.eventsAttending = user.eventsAttending.filter((e) => e.toString() !== eventId.toString());
                yield user.save();
                return { message: "Event deleted successfully" };
            }
            catch (error) {
                console.error("Error deleting event:", error);
                throw new Error("Internal Server Error");
            }
        });
    }
    updateEvent(eventObj, eventId, creatorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { attendees, date, time, location, maxAttendees, status, title, description, } = eventObj;
                const existingEvent = yield Event_1.default.findById(eventId);
                if (!existingEvent) {
                    const customError = new Error("Event not found");
                    customError.code = http_status_codes_1.HTTP_CODE.NotFound;
                    throw customError;
                }
                if (existingEvent.creator.toString() !== creatorId.toString()) {
                    const customError = new Error("You are not the creator of this event and so you cannot change it!");
                    customError.code = http_status_codes_1.HTTP_CODE.NotFound;
                    throw customError;
                }
                if (eventObj.trail || eventObj.creator || eventObj.duration) {
                    const customError = new Error("You cannot update the trail, creator, or duration of the event");
                    customError.code = http_status_codes_1.HTTP_CODE.BadRequest;
                    throw customError;
                }
                existingEvent.attendees = attendees;
                existingEvent.date = date;
                // existingEvent.time = time;
                existingEvent.location = location;
                existingEvent.maxAttendees = maxAttendees;
                existingEvent.status = status;
                existingEvent.title = title;
                existingEvent.description = description;
                yield existingEvent.save();
                return existingEvent;
            }
            catch (error) {
                console.error("Error updating event:", error);
                throw error;
            }
        });
    }
    getEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const events = yield Event_1.default.find().populate("attendees");
                return events;
            }
            catch (error) {
                console.error("Error retrieving events:", error);
                throw new Error("Internal Server Error");
            }
        });
    }
    getEventById(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const event = yield Event_1.default.findById(eventId);
                return event;
            }
            catch (error) {
                console.error("Error:", error);
                throw new Error("Internal Server Error");
            }
        });
    }
    joinEvent(eventId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let event = yield Event_1.default.findById(eventId);
                if (!event) {
                    const customError = new Error("Event not found");
                    customError.code = http_status_codes_1.HTTP_CODE.NotFound;
                    throw customError;
                }
                console.log('Looking for user with ID:', userId);
                const user = yield User_1.default.findById(userId);
                if (!user) {
                    console.error('User not found with ID:', userId);
                    // List all users for debugging
                    const allUsers = yield User_1.default.find({}, '_id email firstName lastName');
                    console.log('Available users in database:', allUsers.map(u => ({ id: u._id, email: u.email })));
                    const customError = new Error("User not found");
                    customError.code = http_status_codes_1.HTTP_CODE.NotFound;
                    throw customError;
                }
                console.log('Found user:', { id: user._id, email: user.email });
                const userIdObject = new mongoose_1.default.Types.ObjectId(userId);
                const eventIdObject = new mongoose_1.default.Types.ObjectId(eventId);
                if (event.attendees.find((attendee) => { var _a; return ((_a = attendee._id) === null || _a === void 0 ? void 0 : _a.toString()) === userIdObject.toString(); })) {
                    const customError = new Error("User is already attending the event");
                    customError.code = http_status_codes_1.HTTP_CODE.Forbidden;
                    throw customError;
                }
                if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
                    const customError = new Error("Event is already full");
                    customError.code = http_status_codes_1.HTTP_CODE.Forbidden;
                    throw customError;
                }
                event.attendees.push({
                    _id: user === null || user === void 0 ? void 0 : user._id,
                    firstName: user === null || user === void 0 ? void 0 : user.firstName,
                    lastName: user === null || user === void 0 ? void 0 : user.lastName,
                });
                yield event.save();
                user.eventsAttending.push(eventIdObject);
                yield user.save();
                // Try to create reminder, but don't fail if it doesn't work
                try {
                    const creatorReminderDate = new Date(event.date);
                    creatorReminderDate.setDate(creatorReminderDate.getDate() - 1);
                    const creatorMessage = `${event.location} is happening tomorrow.`;
                    const reminderController = new reminder_1.ReminderController();
                    yield reminderController.createReminder({
                        userId: userId,
                        eventId: eventId,
                        reminderDate: creatorReminderDate,
                        message: creatorMessage,
                    });
                }
                catch (reminderError) {
                    console.warn("Failed to create reminder, but user joined event:", reminderError);
                    // Don't throw error, user still joined successfully
                }
                return { message: "User joined the event successfully", event };
            }
            catch (error) {
                console.error("Error joining event:", error);
                // Re-throw custom errors with their codes
                if (error.code) {
                    throw error;
                }
                // Otherwise throw generic error
                const customError = new Error((error === null || error === void 0 ? void 0 : error.message) || "Internal Server Error");
                customError.code = http_status_codes_1.HTTP_CODE.InternalServerError;
                throw customError;
            }
        });
    }
    leaveEvent(eventId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let event = yield Event_1.default.findById(eventId);
                if (!event) {
                    const customError = new Error("Event not found");
                    customError.code = http_status_codes_1.HTTP_CODE.NotFound;
                    throw customError;
                }
                const user = yield User_1.default.findById(userId);
                if (!user) {
                    const customError = new Error("User not found");
                    customError.code = http_status_codes_1.HTTP_CODE.NotFound;
                    throw customError;
                }
                const userIdObject = new mongoose_1.default.Types.ObjectId(userId);
                const eventIdObject = new mongoose_1.default.Types.ObjectId(eventId);
                if (event.creator.toString() === userIdObject.toString()) {
                    const customError = new Error("You host this event and cannot leave it!");
                    customError.code = http_status_codes_1.HTTP_CODE.Forbidden;
                    throw customError;
                }
                if (!event.attendees.find((attendee) => { var _a; return ((_a = attendee._id) === null || _a === void 0 ? void 0 : _a.toString()) === userIdObject.toString(); })) {
                    const customError = new Error("User is not attending the event");
                    customError.code = http_status_codes_1.HTTP_CODE.Forbidden;
                    throw customError;
                }
                const indexToRemove = event.attendees.findIndex(attendee => { var _a; return ((_a = attendee._id) === null || _a === void 0 ? void 0 : _a.toString()) === userIdObject.toString(); });
                if (indexToRemove !== -1) {
                    event.attendees.splice(indexToRemove, 1);
                }
                yield event.save();
                user.eventsAttending = user.eventsAttending.filter((eventId) => eventId.toString() !== eventIdObject.toString());
                yield user.save();
                return { message: "User left the event successfully", event };
            }
            catch (error) {
                console.error("Error leaving event:", error);
                throw new Error("Internal Server Error");
            }
        });
    }
}
exports.EventController = EventController;
//# sourceMappingURL=event.js.map