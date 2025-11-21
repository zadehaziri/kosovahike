import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/tokenService';
import UserModel from '../models/User';
import { HTTP_CODE } from '../enums/http-status-codes';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Authentication middleware - verifies JWT token
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      res.status(HTTP_CODE.Unauthorized).json({
        error: 'No token provided. Authorization header is required.'
      });
      return;
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader;

    if (!token) {
      res.status(HTTP_CODE.Unauthorized).json({
        error: 'No token provided.'
      });
      return;
    }

    // Verify token
    const tokenService = new TokenService();
    const decoded: any = await tokenService.verifyToken(token);

    if (!decoded || !decoded.userId) {
      res.status(HTTP_CODE.Unauthorized).json({
        error: 'Invalid or expired token.'
      });
      return;
    }

    // Find user by email (since token contains email as userId)
    const user = await UserModel.findOne({ email: decoded.userId });

    if (!user) {
      res.status(HTTP_CODE.Unauthorized).json({
        error: 'User not found.'
      });
      return;
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error: any) {
    console.error('Authentication error:', error);
    res.status(HTTP_CODE.InternalServerError).json({
      error: 'Authentication failed.'
    });
  }
};

/**
 * Admin authorization middleware - checks if user is admin
 * Must be used after authenticate middleware
 */
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (!req.user) {
      res.status(HTTP_CODE.Unauthorized).json({
        error: 'Authentication required.'
      });
      return;
    }

    if (req.user.role !== 'admin') {
      res.status(HTTP_CODE.Forbidden).json({
        error: 'Access denied. Admin role required.'
      });
      return;
    }

    next();
  } catch (error: any) {
    console.error('Admin authorization error:', error);
    res.status(HTTP_CODE.InternalServerError).json({
      error: 'Authorization check failed.'
    });
  }
};

