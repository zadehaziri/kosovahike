"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Reminder = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    eventId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    reminderDate: {
        type: Date,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
});
const ReminderModel = mongoose_1.default.model('Reminder', Reminder);
exports.default = ReminderModel;
//# sourceMappingURL=Reminder.js.map