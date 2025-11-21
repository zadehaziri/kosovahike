"use strict";
// import { HTTP_CODE } from "../enums/http-status-codes";
// import ReminderModel from "../models/Reminder";
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
exports.ReminderController = void 0;
// const Reminder = require('../models/Reminder');
// export class ReminderController {
//     async getReminders(location?:string) {
//         try {
//             let query={};
//             if(location){
//                 query={location:new RegExp(location,'i')}
//             }
//             const reminders = await ReminderModel.find(query);
//             return reminders;
//         } catch (error) {
//             console.error('Error:', error);
//             throw new Error('Internal Server Error');
//         }
//     }
//     async saveReminder(userObj: any) {
//         const { date, location, description } = userObj;
//         const newReminder = new ReminderModel({
//             date,
//             // time,
//             location,
//             description
//         });
//         await newReminder.save();
//         if (!date) {
//             const customError: any = new Error('Date and Time are required to be fullfilled');
//             customError.code = HTTP_CODE.NotFound;
//             throw customError
//         }
//         const existingReminder = await ReminderModel.findOne({ Reminder });
//         if (existingReminder) {
//             const customError: any = new Error('This reminder already exists for this profile');
//             customError.code = HTTP_CODE.NotFound
//             throw customError
//         }
//     }
//     async deleteReminder(reminderId: string) {
//         try {
//             await ReminderModel.findByIdAndDelete(reminderId);
//         } catch (error) {
//             console.error('Error:', error);
//             throw new Error('Internal Server Error');
//         }
//     }
//     async updateReminder(userObj: any) {
//         try {
//             const { id, date, location, description } = userObj;
//             if (!date) {
//                 const customError: any = new Error('Date and Time are required to be fulfilled');
//                 customError.code = HTTP_CODE.NotFound;
//                 throw customError;
//             }
//             const existingReminder = await ReminderModel.findById(id);
//             if (!existingReminder) {
//                 const customError: any = new Error('Reminder not found');
//                 customError.code = HTTP_CODE.NotFound;
//                 throw customError;
//             }
//             existingReminder.date = date;
//             existingReminder.location = location;
//             existingReminder.description = description;
//             await existingReminder.save();
//             return existingReminder;
//         } catch (error) {
//             console.error('Error updating reminder:', error);
//             throw error;
//         }
//     }
// }
const http_status_codes_1 = require("../enums/http-status-codes");
const Event_1 = __importDefault(require("../models/Event"));
const Reminder_1 = __importDefault(require("../models/Reminder"));
const User_1 = __importDefault(require("../models/User"));
class ReminderController {
    createReminder(reminderData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, eventId, reminderDate, message } = reminderData;
                const user = yield User_1.default.findById(userId);
                const event = yield Event_1.default.findById(eventId);
                if (!user || !event) {
                    const customError = new Error('User or Event not found');
                    customError.code = http_status_codes_1.HTTP_CODE.NotFound;
                    throw customError;
                }
                if (!reminderDate) {
                    const customError = new Error('The time of this reminder is required');
                    customError.code = http_status_codes_1.HTTP_CODE.NotFound;
                    throw customError;
                }
                const newReminder = new Reminder_1.default({
                    userId,
                    eventId,
                    reminderDate,
                    message
                });
                yield newReminder.save();
                user.reminders.push(newReminder._id);
                yield user.save();
                return newReminder;
            }
            catch (error) {
                console.error("Error creating reminder:", error);
                throw new Error("Internal Server Error");
            }
        });
    }
    getReminderById(reminderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reminder = yield Reminder_1.default.findById(reminderId);
                return reminder;
            }
            catch (error) {
                console.error("Error:", error);
                throw new Error("Internal Server Error");
            }
        });
    }
    getUserReminders(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.default.findById(userId).populate("reminders");
                if (!user) {
                    const customError = new Error('User not found');
                    customError.code = http_status_codes_1.HTTP_CODE.NotFound;
                    throw customError;
                }
                return user.reminders;
            }
            catch (error) {
                console.error("Error retrieving user reminders:", error);
                throw new Error("Internal Server Error");
            }
        });
    }
    getAllReminders() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reminders = yield Reminder_1.default.find();
                return reminders;
            }
            catch (error) {
                console.error("Error retrieving all reminders:", error);
                throw new Error("Internal Server Error");
            }
        });
    }
}
exports.ReminderController = ReminderController;
//# sourceMappingURL=reminder.js.map