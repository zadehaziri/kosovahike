import UserModel from '../models/User';
import bcrypt from 'bcrypt';
import { TokenService } from '../services/tokenService';
import { HTTP_CODE } from '../enums/http-status-codes';
import mongoose from 'mongoose';
import { config } from "../config";

export class UserController {


    async getUsers() {
        try {
            const users = await UserModel.find();
            return users;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }

    async getUserById(userId: string) {
        try {
            const user = await UserModel.findById(userId);
            return user;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }

    async signup(userObj: any) {
        const { firstName, lastName, email, password, ...rest } = userObj;
        if (!firstName || !lastName) {
            const customError: any = new Error('First name and last name are required!');
            customError.code = HTTP_CODE.NotFound;

            throw customError
        }
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            const customError: any = new Error('This email has already been registered!');
            customError.code = HTTP_CODE.NotFound

            throw customError
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = new UserModel({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            ...rest
        });
        await newUser.save();
        return { message: 'User created successfully!' };
    }

    async deleteUser(userId: string) {
        try {
            await UserModel.findByIdAndDelete(userId);
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }

    async getUserByEmail(email: string) {
        try {
            const user = await UserModel.findOne({ email });
            return user;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }

    async login(email: string, password: string) {
        const user = await UserModel.findOne({ email });
        if (!user) {
            const customError: any = new Error('User not found!');
            customError.code = HTTP_CODE.NotFound;

            throw customError
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            const customError: any = new Error('Inccorect password!');
            customError.code = HTTP_CODE.Unauthorized;

            throw customError
        }

        const tokenService = new TokenService();
        const token = tokenService.generateLoginToken(email);
        const expiresIn = config.token_expire;

        return {
            statusCode: HTTP_CODE.OK,
            data: { message: 'Login successefully!', user, token, expiresIn }
        };
    }

    async addFavoriteTrail(userId: string, trailId: string) {

        // try {
        const query = { _id: userId } //find user by ID
        const newFavoriteTrailId = new mongoose.Types.ObjectId(trailId); //
        const update = {
            $addToSet: { trailFavorites: newFavoriteTrailId }
        };
        const options = { upsert: true }; //do not accept duplification
        console.log("ObjectIdTrailId:", newFavoriteTrailId);
        const response = await UserModel.updateOne(query, update, options)
        console.log(response)
        return response
        // } catch (error) {
        //     console.error('Error adding favorite trail:', error);
        //     throw new Error('Failed to add favorite trail');
        // }
    }

    async removeFavoriteTrail(userId: string, trailId: string) {
        // try {
        console.log({ trailId })
        const query = { _id: userId }
        const trailFavoriteToBeDeleted = new mongoose.Types.ObjectId(trailId);
        const update = {
            $pull: { trailFavorites: trailFavoriteToBeDeleted }
        };

        const response = await UserModel.updateOne(query, update)
        return response
        // } catch (error) {
        //     console.error('Error removing favorite trail:', error);
        //     throw new Error('Failed to remove favorite trail');
        // }
    }


    async readFavoriteTrails(userId: string) {

        const response = await UserModel.findById(userId).populate('trailFavorites')

        return response?.trailFavorites

    }

    async updateUser(userId: string, updatedFields: any) {
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                const customError: any = new Error('User not found!');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }
    
            const { email, password, firstName, lastName, age, gender, description, location, availability, skillLevel, interests, phoneNumber, 
                socialMedia, equipment, hikeBuddy } = updatedFields;
    
            console.log("User before update:", user);
            console.log(updatedFields);
    
            // Update email
            if (email) {
                // Validate email format
                const emailRegex = /\S+@\S+\.\S+/;
                if (!emailRegex.test(email)) {
                    const customError: any = new Error('Invalid email address');
                    customError.code = HTTP_CODE.BadRequest;
                    throw customError;
                }
                // Check if email is already taken by another user
                const existingUser = await UserModel.findOne({ email, _id: { $ne: userId } });
                if (existingUser) {
                    const customError: any = new Error('This email is already registered!');
                    customError.code = HTTP_CODE.BadRequest;
                    throw customError;
                }
                user.email = email;
            }

            // Update password
            if (password) {
                // Validate password length
                if (password.length < 8) {
                    const customError: any = new Error('Password must be at least 8 characters long');
                    customError.code = HTTP_CODE.BadRequest;
                    throw customError;
                }
                // Hash the new password
                const hashedPassword = bcrypt.hashSync(password, 10);
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
                    const customError: any = new Error('Age must be between 1 and 150');
                    customError.code = HTTP_CODE.BadRequest;
                    throw customError;
                }
                user.age = age;
            }
            if (gender) {
                if (!['male', 'female'].includes(gender)) {
                    const customError: any = new Error('Gender must be either "male" or "female"');
                    customError.code = HTTP_CODE.BadRequest;
                    throw customError;
                }
                user.gender = gender;
            }
            if (location !== undefined) {
                user.location = location;
            }
            if (availability !== undefined) {
                user.availability = availability;
            }
            if (skillLevel) {
                if (!['beginner', 'intermediate', 'advanced'].includes(skillLevel)) {
                    const customError: any = new Error('Skill level must be one of: "beginner", "intermediate", "advanced"');
                    customError.code = HTTP_CODE.BadRequest;
                    throw customError;
                }
                user.skillLevel = skillLevel;
            }
            if (interests !== undefined) {
                user.interests = interests;
            }
            if (description !== undefined) {
                user.description = description;
            }
            if (phoneNumber !== undefined) {
                user.phoneNumber = phoneNumber;
            }
            if (socialMedia !== undefined) {
                // Ensure socialMedia object exists
                if (!user.socialMedia) {
                    user.socialMedia = { 
                        facebook: null as any, 
                        twitter: null as any, 
                        instagram: null as any 
                    } as any;
                }
                // Update social media fields
                if (socialMedia.facebook !== undefined) {
                    (user.socialMedia as any).facebook = socialMedia.facebook || null;
                }
                if (socialMedia.twitter !== undefined) {
                    (user.socialMedia as any).twitter = socialMedia.twitter || null;
                }
                if (socialMedia.instagram !== undefined) {
                    (user.socialMedia as any).instagram = socialMedia.instagram || null;
                }
            }
            if (equipment !== undefined) {
                user.equipment = equipment;
            }
            if (hikeBuddy !== undefined) {
                if (typeof hikeBuddy !== 'boolean') {
                    const customError: any = new Error('Invalid hikeBuddy value');
                    customError.code = HTTP_CODE.BadRequest;
                    throw customError;
                }
                user.hikeBuddy = hikeBuddy;
            }
    
            console.log("User after update:", user);
    
            await user.save();
    
            return user;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }

    async getAllHikeBuddies() {
        try {
            const hikeBuddies = await UserModel.find({ hikeBuddy: true });
            return hikeBuddies;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }

    async searchForHikeBuddies(filters: any) {
        try {
            const {
                fullName,
                location,
                gender,
                skillLevel
            } = filters;
    
            const query: any = {};
            
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
    
            const hikeBuddies = await UserModel.find({ ...query, hikeBuddy: true });
            return hikeBuddies;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }
    
    static async uploadProfileImg(userId:string, profileImage:any) {
        try {
          if (!profileImage) {
            throw new Error('No profile image provided');
          }
      
          const user = await UserModel.findByIdAndUpdate(
            userId,
            { profileImg: profileImage.filename },
            { new: true }
          );
      
          if (!user) {
            throw new Error('User not found');
          }
      
          return { message: 'Profile image uploaded successfully', user };
        } catch (error) {
          console.error('Error uploading profile image:', error);
          throw new Error('Internal server error');
        }
    }

    async uploadProfilePicture(userId: string, image: any) {
        try {
            console.log('Uploading profile picture for user:', userId);
            console.log('Image filename:', image.filename);
            console.log('Image mimetype:', image.mimetype);
            
            const imageObject = {
                name: image.filename,
                type: image.mimetype,
            };
    
            console.log('Image object to save:', imageObject);
    
            const query = { _id: userId };
            const update = {
                profileImg: imageObject 
            };
            const options = { upsert: true };
    
            const updateResult = await UserModel.updateOne(query, update, options);
            console.log('Update result:', updateResult);
    
            const user = await UserModel.findById(userId);
    
            if (user) {
                const newProfileImg = user.profileImg;
                console.log('User profileImg after update:', newProfileImg);
                return newProfileImg;
            } else {
                throw new Error('User not found');
            }
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            throw new Error('Failed to upload profile picture');
        }
    }

    async addToCart(userId: string, product: any) {
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                const customError: any = new Error('User not found');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }

            console.log('Adding product to cart:', { userId, productId: product.id, productName: product.name });
            
            // Get current cart or initialize as empty array
            const currentCart = user.cart || [];
            const existingItemIndex = currentCart.findIndex((item: any) => item.productId === product.id);
            
            let updatedCart;
            if (existingItemIndex !== -1) {
                // Update existing item quantity
                const existingItem = currentCart[existingItemIndex];
                const itemObj = existingItem.toObject ? existingItem.toObject() : existingItem;
                updatedCart = [...currentCart];
                updatedCart[existingItemIndex] = {
                    ...itemObj,
                    quantity: itemObj.quantity + 1
                };
                console.log('Updated existing item quantity:', updatedCart[existingItemIndex].quantity);
            } else {
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
            await UserModel.updateOne(
                { _id: userId },
                { $set: { cart: updatedCart } }
            );

            console.log('Cart saved successfully');
            return updatedCart;
        } catch (error: any) {
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
            const customError: any = new Error(`Failed to add product to cart: ${error.message}`);
            customError.code = HTTP_CODE.InternalServerError;
            throw customError;
        }
    }

    async getCart(userId: string) {
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                const customError: any = new Error('User not found');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }

            return user.cart || [];
        } catch (error: any) {
            console.error('Error getting cart:', error);
            if (error.code) {
                throw error;
            }
            throw new Error('Failed to get cart');
        }
    }

    async updateCartItem(userId: string, productId: number, quantity: number) {
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                const customError: any = new Error('User not found');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }

            const currentCart = user.cart || [];
            const itemIndex = currentCart.findIndex((item: any) => item.productId === productId);
            
            if (itemIndex === -1) {
                const customError: any = new Error('Product not found in cart');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }

            let updatedCart;
            if (quantity <= 0) {
                updatedCart = currentCart.filter((item: any) => item.productId !== productId);
            } else {
                updatedCart = [...currentCart];
                const item = currentCart[itemIndex];
                const itemObj = item.toObject ? item.toObject() : item;
                updatedCart[itemIndex] = {
                    ...itemObj,
                    quantity: quantity
                };
            }

            await UserModel.updateOne(
                { _id: userId },
                { $set: { cart: updatedCart } }
            );

            return updatedCart;
        } catch (error: any) {
            console.error('Error updating cart item:', error);
            if (error.code) {
                throw error;
            }
            throw new Error('Failed to update cart item');
        }
    }

    async removeFromCart(userId: string, productId: number) {
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                const customError: any = new Error('User not found');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }

            const currentCart = user.cart || [];
            const updatedCart = currentCart.filter((item: any) => item.productId !== productId);

            await UserModel.updateOne(
                { _id: userId },
                { $set: { cart: updatedCart } }
            );

            return updatedCart;
        } catch (error: any) {
            console.error('Error removing from cart:', error);
            if (error.code) {
                throw error;
            }
            throw new Error('Failed to remove product from cart');
        }
    }

    async clearCart(userId: string) {
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                const customError: any = new Error('User not found');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }

            await UserModel.updateOne(
                { _id: userId },
                { $set: { cart: [] } }
            );

            return { message: 'Cart cleared successfully' };
        } catch (error: any) {
            console.error('Error clearing cart:', error);
            if (error.code) {
                throw error;
            }
            throw new Error('Failed to clear cart');
        }
    }

    async checkout(userId: string, checkoutData: any) {
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                const customError: any = new Error('User not found');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }

            const cart = user.cart || [];
            if (cart.length === 0) {
                const customError: any = new Error('Cart is empty');
                customError.code = HTTP_CODE.BadRequest;
                throw customError;
            }

            // Validate required checkout data
            if (!checkoutData.shippingAddress || !checkoutData.paymentMethod) {
                const customError: any = new Error('Shipping address and payment method are required');
                customError.code = HTTP_CODE.BadRequest;
                throw customError;
            }

            // Calculate total
            const totalAmount = cart.reduce((total: number, item: any) => {
                const itemObj = item.toObject ? item.toObject() : item;
                return total + (itemObj.price * itemObj.quantity);
            }, 0);

            // Create order items
            const orderItems = cart.map((item: any) => {
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
            const { default: OrderModel } = await import('../models/Order');
            
            // Prepare payment method data (mask card number for security)
            const paymentData: any = {
                type: checkoutData.paymentMethod.type
            };

            // Only store card details if it's a card payment
            if (checkoutData.paymentMethod.type === 'credit_card' || checkoutData.paymentMethod.type === 'debit_card') {
                if (!checkoutData.paymentMethod.cardNumber || !checkoutData.paymentMethod.cardHolderName || 
                    !checkoutData.paymentMethod.expiryDate || !checkoutData.paymentMethod.cvv) {
                    const customError: any = new Error('Card details are required for card payments');
                    customError.code = HTTP_CODE.BadRequest;
                    throw customError;
                }
                // Mask card number (only store last 4 digits)
                // Ensure cardNumber is a string
                const cardNumberStr = String(checkoutData.paymentMethod.cardNumber || '').replace(/\s/g, '');
                if (cardNumberStr.length < 4) {
                    const customError: any = new Error('Invalid card number');
                    customError.code = HTTP_CODE.BadRequest;
                    throw customError;
                }
                paymentData.cardNumber = `**** **** **** ${cardNumberStr.slice(-4)}`;
                paymentData.cardHolderName = String(checkoutData.paymentMethod.cardHolderName || '');
                paymentData.expiryDate = String(checkoutData.paymentMethod.expiryDate || '');
                // Don't store CVV for security
            }
            
            // Normalize shipping address to ensure all fields are strings
            const normalizedShippingAddress = {
                street: String(checkoutData.shippingAddress?.street || ''),
                city: String(checkoutData.shippingAddress?.city || ''),
                state: String(checkoutData.shippingAddress?.state || ''),
                zipCode: String(checkoutData.shippingAddress?.zipCode || ''),
                country: String(checkoutData.shippingAddress?.country || '')
            };

            // Normalize contact info to ensure all fields are strings
            const normalizedContactInfo = {
                email: String(checkoutData.contactInfo?.email || ''),
                phone: String(checkoutData.contactInfo?.phone || '')
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

            await order.save();

            // Clear cart after successful order
            await UserModel.updateOne(
                { _id: userId },
                { $set: { cart: [] } }
            );

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
        } catch (error: any) {
            console.error('Error during checkout:', error);
            if (error.code) {
                throw error;
            }
            throw new Error(`Failed to process checkout: ${error.message}`);
        }
    }

    async getUserOrders(userId: string) {
        try {
            const { default: OrderModel } = await import('../models/Order');
            const orders = await OrderModel.find({ user: userId })
                .sort({ orderDate: -1 })
                .exec();
            return orders;
        } catch (error: any) {
            console.error('Error getting user orders:', error);
            if (error.code) {
                throw error;
            }
            throw new Error(`Failed to get user orders: ${error.message}`);
        }
    }

    async getOrderById(orderId: string, userId: string) {
        try {
            const { default: OrderModel } = await import('../models/Order');
            const order = await OrderModel.findOne({ _id: orderId, user: userId });
            if (!order) {
                const customError: any = new Error('Order not found');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }
            return order;
        } catch (error: any) {
            console.error('Error getting order:', error);
            if (error.code) {
                throw error;
            }
            throw new Error(`Failed to get order: ${error.message}`);
        }
    }

    async updateOrderStatus(orderId: string, userId: string, status: string) {
        try {
            const { default: OrderModel } = await import('../models/Order');
            const order = await OrderModel.findOne({ _id: orderId, user: userId });
            if (!order) {
                const customError: any = new Error('Order not found');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }

            const validStatuses: ('pending' | 'processing' | 'completed' | 'cancelled')[] = ['pending', 'processing', 'completed', 'cancelled'];
            if (!validStatuses.includes(status as any)) {
                const customError: any = new Error('Invalid order status');
                customError.code = HTTP_CODE.BadRequest;
                throw customError;
            }

            order.status = status as 'pending' | 'processing' | 'completed' | 'cancelled';
            await order.save();

            return order;
        } catch (error: any) {
            console.error('Error updating order status:', error);
            if (error.code) {
                throw error;
            }
            throw new Error(`Failed to update order status: ${error.message}`);
        }
    }
       
}
