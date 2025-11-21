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
const mongoose_1 = __importDefault(require("mongoose"));
const Trail_1 = __importDefault(require("./Trail"));
const User_1 = __importDefault(require("./User"));
const Event = new mongoose_1.default.Schema({
    trail: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Trail",
        required: true,
    },
    creator: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    attendees: [
        {
            _id: String,
            firstName: String,
            lastName: String,
        }
    ],
    date: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
    },
    duration: {
        type: Number,
    },
    maxAttendees: {
        type: Number,
    },
    status: {
        type: String,
        enum: ["active", "canceled", "completed"],
        default: "active",
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
});
Event.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isNew) {
            const trail = yield Trail_1.default.findById(this.trail);
            const user = yield User_1.default.findById(this.creator);
            if (trail) {
                this.duration = trail.duration;
            }
            if (user) {
                this.attendees.push({
                    _id: user._id.toString(),
                    firstName: user.firstName,
                    lastName: user.lastName,
                });
            }
        }
        next();
    });
});
const EventModel = mongoose_1.default.model("Event", Event);
exports.default = EventModel;
//# sourceMappingURL=Event.js.map