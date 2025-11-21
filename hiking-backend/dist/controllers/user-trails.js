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
exports.PastTrailsController = void 0;
const User_1 = __importDefault(require("../models/User"));
class PastTrailsController {
    addPastTrail(userId, pastTrailData, images) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const imageObjects = images.map((image) => ({
                    name: image.filename,
                    type: image.mimetype,
                }));
                const query = { _id: userId };
                const update = {
                    $addToSet: {
                        pastTrails: Object.assign(Object.assign({}, pastTrailData), { images: imageObjects }),
                    },
                };
                const options = { upsert: true };
                const response = yield User_1.default.updateOne(query, update, options);
                if (response.modifiedCount === 1) {
                    const user = yield User_1.default.findById(userId);
                    if (user) {
                        const newTrail = user.pastTrails.find((trail) => trail.name === pastTrailData.name);
                        return newTrail;
                    }
                    else {
                        throw new Error('User not found');
                    }
                }
                else {
                    throw new Error('Failed to add past trail');
                }
            }
            catch (error) {
                console.error('Error adding past trail:', error);
                throw new Error('Failed to add past trail');
            }
        });
    }
    removePastTrail(userId, trailId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = { _id: userId };
                const update = {
                    $pull: { pastTrails: { _id: trailId } },
                };
                const response = yield User_1.default.updateOne(query, update);
                return response;
            }
            catch (error) {
                console.error('Error removing past trail:', error);
                throw new Error('Failed to remove past trail');
            }
        });
    }
    getPastTrails(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield User_1.default.findById(userId);
            return response === null || response === void 0 ? void 0 : response.pastTrails;
        });
    }
    getSingleTrail(userId, trailId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            const trail = user.pastTrails.find((trail) => String(trail._id) === trailId);
            if (!trail) {
                throw new Error('Trail not found');
            }
            return trail;
        });
    }
}
exports.PastTrailsController = PastTrailsController;
//# sourceMappingURL=user-trails.js.map