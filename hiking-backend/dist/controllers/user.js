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
exports.UserController = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const tokenService_1 = require("../services/tokenService");
const http_status_codes_1 = require("../enums/http-status-codes");
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config");
class UserController {
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield User_1.default.find();
                return users;
            }
            catch (error) {
                console.error('Error:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.default.findById(userId);
                return user;
            }
            catch (error) {
                console.error('Error:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
    signup(userObj) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, email, password } = userObj, rest = __rest(userObj, ["firstName", "lastName", "email", "password"]);
            if (!firstName || !lastName) {
                const customError = new Error('First name and last name are required!');
                customError.code = http_status_codes_1.HTTP_CODE.NotFound;
                throw customError;
            }
            const existingUser = yield User_1.default.findOne({ email });
            if (existingUser) {
                const customError = new Error('This email has already been registered!');
                customError.code = http_status_codes_1.HTTP_CODE.NotFound;
                throw customError;
            }
            const hashedPassword = bcrypt_1.default.hashSync(password, 10);
            const newUser = new User_1.default(Object.assign({ firstName,
                lastName,
                email, password: hashedPassword }, rest));
            yield newUser.save();
            return { message: 'User created successfully!' };
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield User_1.default.findByIdAndDelete(userId);
            }
            catch (error) {
                console.error('Error:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.default.findOne({ email });
                return user;
            }
            catch (error) {
                console.error('Error:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({ email });
            if (!user) {
                const customError = new Error('User not found!');
                customError.code = http_status_codes_1.HTTP_CODE.NotFound;
                throw customError;
            }
            const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!passwordMatch) {
                const customError = new Error('Inccorect password!');
                customError.code = http_status_codes_1.HTTP_CODE.Unauthorized;
                throw customError;
            }
            const tokenService = new tokenService_1.TokenService();
            const token = tokenService.generateLoginToken(email);
            const expiresIn = config_1.config.token_expire;
            return {
                statusCode: http_status_codes_1.HTTP_CODE.OK,
                data: { message: 'Login successefully!', user, token, expiresIn }
            };
        });
    }
    addFavoriteTrail(userId, trailId) {
        return __awaiter(this, void 0, void 0, function* () {
            // try {
            const query = { _id: userId }; //find user by ID
            const newFavoriteTrailId = new mongoose_1.default.Types.ObjectId(trailId); //
            const update = {
                $addToSet: { trailFavorites: newFavoriteTrailId }
            };
            const options = { upsert: true }; //do not accept duplification
            console.log("ObjectIdTrailId:", newFavoriteTrailId);
            const response = yield User_1.default.updateOne(query, update, options);
            console.log(response);
            return response;
            // } catch (error) {
            //     console.error('Error adding favorite trail:', error);
            //     throw new Error('Failed to add favorite trail');
            // }
        });
    }
    removeFavoriteTrail(userId, trailId) {
        return __awaiter(this, void 0, void 0, function* () {
            // try {
            console.log({ trailId });
            const query = { _id: userId };
            const trailFavoriteToBeDeleted = new mongoose_1.default.Types.ObjectId(trailId);
            const update = {
                $pull: { trailFavorites: trailFavoriteToBeDeleted }
            };
            const response = yield User_1.default.updateOne(query, update);
            return response;
            // } catch (error) {
            //     console.error('Error removing favorite trail:', error);
            //     throw new Error('Failed to remove favorite trail');
            // }
        });
    }
    readFavoriteTrails(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield User_1.default.findById(userId).populate('trailFavorites');
            return response === null || response === void 0 ? void 0 : response.trailFavorites;
        });
    }
    updateUser(userId, updatedFields) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.default.findById(userId);
                if (!user) {
                    const customError = new Error('User not found!');
                    customError.code = http_status_codes_1.HTTP_CODE.NotFound;
                    throw customError;
                }
                const { email, password, firstName, lastName, age, gender, description, location, availability, skillLevel, interests, phoneNumber, socialMedia, equipment, hikeBuddy } = updatedFields;
                console.log("User before update:", user);
                console.log(updatedFields);
                // Update email
                if (email) {
                    // Validate email format
                    const emailRegex = /\S+@\S+\.\S+/;
                    if (!emailRegex.test(email)) {
                        const customError = new Error('Invalid email address');
                        customError.code = http_status_codes_1.HTTP_CODE.BadRequest;
                        throw customError;
                    }
                    // Check if email is already taken by another user
                    const existingUser = yield User_1.default.findOne({ email, _id: { $ne: userId } });
                    if (existingUser) {
                        const customError = new Error('This email is already registered!');
                        customError.code = http_status_codes_1.HTTP_CODE.BadRequest;
                        throw customError;
                    }
                    user.email = email;
                }
                // Update password
                if (password) {
                    // Validate password length
                    if (password.length < 8) {
                        const customError = new Error('Password must be at least 8 characters long');
                        customError.code = http_status_codes_1.HTTP_CODE.BadRequest;
                        throw customError;
                    }
                    // Hash the new password
                    const hashedPassword = bcrypt_1.default.hashSync(password, 10);
                    user.password = hashedPassword;
                }
                // Update firstName
                if (firstName) {
                    user.firstName = firstName;
                }
                // Update lastName
                if (lastName) {
                    user.lastName = lastName;
                }
                if (age) {
                    if (age < 1 || age > 150) {
                        const customError = new Error('Age must be between 1 and 150');
                        customError.code = http_status_codes_1.HTTP_CODE.BadRequest;
                        throw customError;
                    }
                    user.age = age;
                }
                if (gender) {
                    if (!['male', 'female'].includes(gender)) {
                        const customError = new Error('Gender must be either "male" or "female"');
                        customError.code = http_status_codes_1.HTTP_CODE.BadRequest;
                        throw customError;
                    }
                    user.gender = gender;
                }
                if (location) {
                    user.location = location;
                }
                if (availability) {
                    user.availability = availability;
                }
                if (skillLevel) {
                    if (!['beginner', 'intermediate', 'advanced'].includes(skillLevel)) {
                        const customError = new Error('Skill level must be one of: "beginner", "intermediate", "advanced"');
                        customError.code = http_status_codes_1.HTTP_CODE.BadRequest;
                        throw customError;
                    }
                    user.skillLevel = skillLevel;
                }
                if (interests) {
                    user.interests = interests;
                }
                if (description) {
                    user.description = description;
                }
                if (phoneNumber) {
                    user.phoneNumber = phoneNumber;
                }
                if (user.socialMedia) {
                    if (socialMedia) {
                        if (socialMedia.facebook) {
                            user.socialMedia.facebook = socialMedia.facebook;
                        }
                        if (socialMedia.twitter) {
                            user.socialMedia.twitter = socialMedia.twitter;
                        }
                        if (socialMedia.instagram) {
                            user.socialMedia.instagram = socialMedia.instagram;
                        }
                    }
                }
                if (equipment) {
                    user.equipment = equipment;
                }
                if (hikeBuddy !== undefined) {
                    if (typeof hikeBuddy !== 'boolean') {
                        const customError = new Error('Invalid hikeBuddy value');
                        customError.code = http_status_codes_1.HTTP_CODE.BadRequest;
                        throw customError;
                    }
                    user.hikeBuddy = hikeBuddy;
                }
                console.log("User after update:", user);
                yield user.save();
                return user;
            }
            catch (error) {
                console.error('Error:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
    getAllHikeBuddies() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hikeBuddies = yield User_1.default.find({ hikeBuddy: true });
                return hikeBuddies;
            }
            catch (error) {
                console.error('Error:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
    searchForHikeBuddies(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fullName, location, gender, skillLevel } = filters;
                const query = {};
                if (fullName) {
                    query.$or = [
                        { firstName: { $regex: new RegExp(fullName, "i") } },
                        { lastName: { $regex: new RegExp(fullName, "i") } }
                    ];
                }
                if (location) {
                    query.location = { $regex: new RegExp(location, "i") };
                }
                if (gender) {
                    query.gender = gender;
                }
                if (skillLevel) {
                    query.skillLevel = skillLevel;
                }
                const hikeBuddies = yield User_1.default.find(Object.assign(Object.assign({}, query), { hikeBuddy: true }));
                return hikeBuddies;
            }
            catch (error) {
                console.error('Error:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
    static uploadProfileImg(userId, profileImage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!profileImage) {
                    throw new Error('No profile image provided');
                }
                const user = yield User_1.default.findByIdAndUpdate(userId, { profileImg: profileImage.filename }, { new: true });
                if (!user) {
                    throw new Error('User not found');
                }
                return { message: 'Profile image uploaded successfully', user };
            }
            catch (error) {
                console.error('Error uploading profile image:', error);
                throw new Error('Internal server error');
            }
        });
    }
    uploadProfilePicture(userId, image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const imageObject = {
                    name: image.filename,
                    type: image.mimetype,
                };
                const query = { _id: userId };
                const update = {
                    profileImg: imageObject
                };
                const options = { upsert: true };
                yield User_1.default.updateOne(query, update, options);
                const user = yield User_1.default.findById(userId);
                if (user) {
                    const newProfileImg = user.profileImg;
                    return newProfileImg;
                }
                else {
                    throw new Error('User not found');
                }
            }
            catch (error) {
                console.error('Error uploading profile picture:', error);
                throw new Error('Failed to upload profile picture');
            }
        });
    }
    addToCart(userId, product) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.default.findById(userId);
                if (!user) {
                    const customError = new Error('User not found');
                    customError.code = http_status_codes_1.HTTP_CODE.NotFound;
                    throw customError;
                }
                console.log('Adding product to cart:', { userId, productId: product.id, productName: product.name });
                // Get current cart or initialize as empty array
                const currentCart = user.cart || [];
                const existingItemIndex = currentCart.findIndex((item) => item.productId === product.id);
                let updatedCart;
                if (existingItemIndex !== -1) {
                    // Update existing item quantity
                    const existingItem = currentCart[existingItemIndex];
                    const itemObj = existingItem.toObject ? existingItem.toObject() : existingItem;
                    updatedCart = [...currentCart];
                    updatedCart[existingItemIndex] = Object.assign(Object.assign({}, itemObj), { quantity: itemObj.quantity + 1 });
                    console.log('Updated existing item quantity:', updatedCart[existingItemIndex].quantity);
                }
                else {
                    // Add new item
                    const newItem = {
                        productId: product.id,
                        name: product.name,
                        price: product.price,
                        imageUrl: product.imageUrl,
                        quantity: 1,
                        addedAt: new Date()
                    };
                    updatedCart = [...currentCart, newItem];
                    console.log('Added new item to cart:', newItem);
                }
                // Use updateOne to avoid full document validation
                yield User_1.default.updateOne({ _id: userId }, { $set: { cart: updatedCart } });
                console.log('Cart saved successfully');
                return updatedCart;
            }
            catch (error) {
                console.error('Error adding to cart:', error);
                console.error('Error details:', {
                    message: error.message,
                    stack: error.stack,
                    name: error.name,
                    code: error.code
                });
                if (error.code) {
                    throw error;
                }
                const customError = new Error(`Failed to add product to cart: ${error.message}`);
                customError.code = http_status_codes_1.HTTP_CODE.InternalServerError;
                throw customError;
            }
        });
    }
    getCart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.default.findById(userId);
                if (!user) {
                    const customError = new Error('User not found');
                    customError.code = http_status_codes_1.HTTP_CODE.NotFound;
                    throw customError;
                }
                return user.cart || [];
            }
            catch (error) {
                console.error('Error getting cart:', error);
                if (error.code) {
                    throw error;
                }
                throw new Error('Failed to get cart');
            }
        });
    }
    updateCartItem(userId, productId, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.default.findById(userId);
                if (!user) {
                    const customError = new Error('User not found');
                    customError.code = http_status_codes_1.HTTP_CODE.NotFound;
                    throw customError;
                }
                const currentCart = user.cart || [];
                const itemIndex = currentCart.findIndex((item) => item.productId === productId);
                if (itemIndex === -1) {
                    const customError = new Error('Product not found in cart');
                    customError.code = http_status_codes_1.HTTP_CODE.NotFound;
                    throw customError;
                }
                let updatedCart;
                if (quantity <= 0) {
                    updatedCart = currentCart.filter((item) => item.productId !== productId);
                }
                else {
                    updatedCart = [...currentCart];
                    const item = currentCart[itemIndex];
                    const itemObj = item.toObject ? item.toObject() : item;
                    updatedCart[itemIndex] = Object.assign(Object.assign({}, itemObj), { quantity: quantity });
                }
                yield User_1.default.updateOne({ _id: userId }, { $set: { cart: updatedCart } });
                return updatedCart;
            }
            catch (error) {
                console.error('Error updating cart item:', error);
                if (error.code) {
                    throw error;
                }
                throw new Error('Failed to update cart item');
            }
        });
    }
    removeFromCart(userId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.default.findById(userId);
                if (!user) {
                    const customError = new Error('User not found');
                    customError.code = http_status_codes_1.HTTP_CODE.NotFound;
                    throw customError;
                }
                const currentCart = user.cart || [];
                const updatedCart = currentCart.filter((item) => item.productId !== productId);
                yield User_1.default.updateOne({ _id: userId }, { $set: { cart: updatedCart } });
                return updatedCart;
            }
            catch (error) {
                console.error('Error removing from cart:', error);
                if (error.code) {
                    throw error;
                }
                throw new Error('Failed to remove product from cart');
            }
        });
    }
    clearCart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.default.findById(userId);
                if (!user) {
                    const customError = new Error('User not found');
                    customError.code = http_status_codes_1.HTTP_CODE.NotFound;
                    throw customError;
                }
                yield User_1.default.updateOne({ _id: userId }, { $set: { cart: [] } });
                return { message: 'Cart cleared successfully' };
            }
            catch (error) {
                console.error('Error clearing cart:', error);
                if (error.code) {
                    throw error;
                }
                throw new Error('Failed to clear cart');
            }
        });
    }
    checkout(userId, checkoutData) {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.default.findById(userId);
                if (!user) {
                    const customError = new Error('User not found');
                    customError.code = http_status_codes_1.HTTP_CODE.NotFound;
                    throw customError;
                }
                const cart = user.cart || [];
                if (cart.length === 0) {
                    const customError = new Error('Cart is empty');
                    customError.code = http_status_codes_1.HTTP_CODE.BadRequest;
                    throw customError;
                }
                // Validate required checkout data
                if (!checkoutData.shippingAddress || !checkoutData.paymentMethod) {
                    const customError = new Error('Shipping address and payment method are required');
                    customError.code = http_status_codes_1.HTTP_CODE.BadRequest;
                    throw customError;
                }
                // Calculate total
                const totalAmount = cart.reduce((total, item) => {
                    const itemObj = item.toObject ? item.toObject() : item;
                    return total + (itemObj.price * itemObj.quantity);
                }, 0);
                // Create order items
                const orderItems = cart.map((item) => {
                    const itemObj = item.toObject ? item.toObject() : item;
                    return {
                        productId: itemObj.productId,
                        name: itemObj.name,
                        price: itemObj.price,
                        imageUrl: itemObj.imageUrl,
                        quantity: itemObj.quantity
                    };
                });
                // Import OrderModel
                const { default: OrderModel } = yield Promise.resolve().then(() => __importStar(require('../models/Order')));
                // Prepare payment method data (mask card number for security)
                const paymentData = {
                    type: checkoutData.paymentMethod.type
                };
                // Only store card details if it's a card payment
                if (checkoutData.paymentMethod.type === 'credit_card' || checkoutData.paymentMethod.type === 'debit_card') {
                    if (!checkoutData.paymentMethod.cardNumber || !checkoutData.paymentMethod.cardHolderName ||
                        !checkoutData.paymentMethod.expiryDate || !checkoutData.paymentMethod.cvv) {
                        const customError = new Error('Card details are required for card payments');
                        customError.code = http_status_codes_1.HTTP_CODE.BadRequest;
                        throw customError;
                    }
                    // Mask card number (only store last 4 digits)
                    // Ensure cardNumber is a string
                    const cardNumberStr = String(checkoutData.paymentMethod.cardNumber || '').replace(/\s/g, '');
                    if (cardNumberStr.length < 4) {
                        const customError = new Error('Invalid card number');
                        customError.code = http_status_codes_1.HTTP_CODE.BadRequest;
                        throw customError;
                    }
                    paymentData.cardNumber = `**** **** **** ${cardNumberStr.slice(-4)}`;
                    paymentData.cardHolderName = String(checkoutData.paymentMethod.cardHolderName || '');
                    paymentData.expiryDate = String(checkoutData.paymentMethod.expiryDate || '');
                    // Don't store CVV for security
                }
                // Normalize shipping address to ensure all fields are strings
                const normalizedShippingAddress = {
                    street: String(((_a = checkoutData.shippingAddress) === null || _a === void 0 ? void 0 : _a.street) || ''),
                    city: String(((_b = checkoutData.shippingAddress) === null || _b === void 0 ? void 0 : _b.city) || ''),
                    state: String(((_c = checkoutData.shippingAddress) === null || _c === void 0 ? void 0 : _c.state) || ''),
                    zipCode: String(((_d = checkoutData.shippingAddress) === null || _d === void 0 ? void 0 : _d.zipCode) || ''),
                    country: String(((_e = checkoutData.shippingAddress) === null || _e === void 0 ? void 0 : _e.country) || '')
                };
                // Normalize contact info to ensure all fields are strings
                const normalizedContactInfo = {
                    email: String(((_f = checkoutData.contactInfo) === null || _f === void 0 ? void 0 : _f.email) || ''),
                    phone: String(((_g = checkoutData.contactInfo) === null || _g === void 0 ? void 0 : _g.phone) || '')
                };
                // Create order
                const order = new OrderModel({
                    user: userId,
                    items: orderItems,
                    totalAmount: totalAmount,
                    status: 'pending',
                    orderDate: new Date(),
                    shippingAddress: normalizedShippingAddress,
                    paymentMethod: paymentData,
                    contactInfo: normalizedContactInfo
                });
                yield order.save();
                // Clear cart after successful order
                yield User_1.default.updateOne({ _id: userId }, { $set: { cart: [] } });
                const result = {
                    orderId: order._id.toString(),
                    message: 'Order placed successfully',
                    totalAmount: totalAmount,
                    items: orderItems,
                    shippingAddress: normalizedShippingAddress,
                    contactInfo: normalizedContactInfo,
                    orderDate: order.orderDate,
                    status: order.status
                };
                return result;
            }
            catch (error) {
                console.error('Error during checkout:', error);
                if (error.code) {
                    throw error;
                }
                throw new Error(`Failed to process checkout: ${error.message}`);
            }
        });
    }
    getUserOrders(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { default: OrderModel } = yield Promise.resolve().then(() => __importStar(require('../models/Order')));
                const orders = yield OrderModel.find({ user: userId })
                    .sort({ orderDate: -1 })
                    .exec();
                return orders;
            }
            catch (error) {
                console.error('Error getting user orders:', error);
                if (error.code) {
                    throw error;
                }
                throw new Error(`Failed to get user orders: ${error.message}`);
            }
        });
    }
    getOrderById(orderId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { default: OrderModel } = yield Promise.resolve().then(() => __importStar(require('../models/Order')));
                const order = yield OrderModel.findOne({ _id: orderId, user: userId });
                if (!order) {
                    const customError = new Error('Order not found');
                    customError.code = http_status_codes_1.HTTP_CODE.NotFound;
                    throw customError;
                }
                return order;
            }
            catch (error) {
                console.error('Error getting order:', error);
                if (error.code) {
                    throw error;
                }
                throw new Error(`Failed to get order: ${error.message}`);
            }
        });
    }
    updateOrderStatus(orderId, userId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { default: OrderModel } = yield Promise.resolve().then(() => __importStar(require('../models/Order')));
                const order = yield OrderModel.findOne({ _id: orderId, user: userId });
                if (!order) {
                    const customError = new Error('Order not found');
                    customError.code = http_status_codes_1.HTTP_CODE.NotFound;
                    throw customError;
                }
                const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
                if (!validStatuses.includes(status)) {
                    const customError = new Error('Invalid order status');
                    customError.code = http_status_codes_1.HTTP_CODE.BadRequest;
                    throw customError;
                }
                order.status = status;
                yield order.save();
                return order;
            }
            catch (error) {
                console.error('Error updating order status:', error);
                if (error.code) {
                    throw error;
                }
                throw new Error(`Failed to update order status: ${error.message}`);
            }
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.js.map