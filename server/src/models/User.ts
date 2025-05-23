import mongoose, { Document, Schema } from 'mongoose'; // Mongoose for MongoDB object modeling
import { IUser, UserRole } from '../types'; // Import user-related types and enums
import bcrypt from 'bcrypt'; // Library for password hashing

// Defines the structure of a User document in MongoDB, extending Mongoose's Document.
// It also includes a custom method `comparePassword` for authentication.
export interface UserDocument extends Omit<IUser, '_id'>, Document {
  comparePassword(candidatePassword: string): Promise<boolean>; // Method to verify a password attempt.
}

// Mongoose schema for the User model.
// This defines the shape, data types, validation, and defaults for user documents.
const userSchema = new Schema<UserDocument>(
  {
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
      enum: Object.values(UserRole), // Role must be one of the values from UserRole enum.
      default: UserRole.USER, // Default role is 'user' if not specified.
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields.
  },
);

// Mongoose pre-save middleware to hash the password before saving a user document.
// This ensures that plain text passwords are not stored in the database.
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new).
  if (!this.isModified('password')) return next();

  try {
    const saltRounds = 10; // Cost factor for bcrypt hashing (higher is more secure but slower).
    const salt = await bcrypt.genSalt(saltRounds); // Generate a salt.
    this.password = await bcrypt.hash(this.password, salt); // Hash the password with the salt.
    next(); // Proceed to save the document.
  } catch (error: any) {
    // If an error occurs during hashing, pass it to the next middleware (error handler).
    next(error);
  }
});

// Instance method on the User model to compare a candidate password with the stored hashed password.
// Used during the login process to verify user credentials.
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  // `bcrypt.compare` securely compares the plain text candidate password with the stored hash.
  return bcrypt.compare(candidatePassword, this.password);
};

// Create and export the Mongoose model for Users.
// This model provides an interface to the 'users' collection in MongoDB.
export const User = mongoose.model<UserDocument>('User', userSchema);
