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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose")); // Mongoose for MongoDB object modeling
const types_1 = require("../types"); // Import user-related types and enums
const bcrypt_1 = __importDefault(require("bcrypt")); // Library for password hashing
// Mongoose schema for the User model.
// This defines the shape, data types, validation, and defaults for user documents.
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'User name is mandatory.'], // Name is a required field.
        trim: true, // Remove whitespace from both ends of the string.
    },
    email: {
        type: String,
        required: [true, 'User email is mandatory.'], // Email is required.
        unique: true, // Ensures email addresses are unique in the collection.
        trim: true,
        lowercase: true, // Store email in lowercase to ensure case-insensitive uniqueness.
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address format.'], // Regex for basic email validation.
    },
    password: {
        type: String,
        required: [true, 'Password is mandatory.'], // Password is required.
        minlength: [6, 'Password must be at least 6 characters long.'],
        // Note: Password is not selected by default in queries to prevent accidental exposure.
        // select: false, // Uncomment this if you want to explicitly hide password by default.
    },
    role: {
        type: String,
        enum: Object.values(types_1.UserRole), // Role must be one of the values from UserRole enum.
        default: types_1.UserRole.USER, // Default role is 'user' if not specified.
    },
}, {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields.
});
// Mongoose pre-save middleware to hash the password before saving a user document.
// This ensures that plain text passwords are not stored in the database.
userSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new).
    if (!this.isModified('password'))
        return next();
    try {
        const saltRounds = 10; // Cost factor for bcrypt hashing (higher is more secure but slower).
        const salt = await bcrypt_1.default.genSalt(saltRounds); // Generate a salt.
        this.password = await bcrypt_1.default.hash(this.password, salt); // Hash the password with the salt.
        next(); // Proceed to save the document.
    }
    catch (error) {
        // If an error occurs during hashing, pass it to the next middleware (error handler).
        next(error);
    }
});
// Instance method on the User model to compare a candidate password with the stored hashed password.
// Used during the login process to verify user credentials.
userSchema.methods.comparePassword = async function (candidatePassword) {
    // `bcrypt.compare` securely compares the plain text candidate password with the stored hash.
    return bcrypt_1.default.compare(candidatePassword, this.password);
};
// Create and export the Mongoose model for Users.
// This model provides an interface to the 'users' collection in MongoDB.
exports.User = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=User.js.map