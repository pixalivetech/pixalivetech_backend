import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import * as TokenManager from "../utils/tokenManager";
import { response } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { Admin } from "../models/admin.model"; // Import Admin Model

const activity = "ADMIN";

/**
 * @description Admin Login using credentials from the database
 */
export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        // Find admin in the database
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return response(req, res, activity, "Level-2", "Login Failed", false, 401, {}, clientError.user.userDontExist, "Admin not found");
        }

        // Compare entered password with stored hashed password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return response(req, res, activity, "Level-2", "Login Failed", false, 401, {}, clientError.auth.invalidCredentials, "Invalid credentials");
        }

        // Generate JWT token
        const token = await TokenManager.CreateJWTToken({
            id: admin._id,
            email: admin.email,
            role: "Admin"
        });

        // Send login response
        response(req, res, activity, "Level-3", "Login Successful", true, 200, { admin, token }, "Admin login successful.");
    } catch (error) {
        console.error("Admin authentication error:", error);
        response(req, res, activity, "Level-4", "Internal Server Error", false, 500, {}, errorMessage.internalServer, error.message);
    }
};
