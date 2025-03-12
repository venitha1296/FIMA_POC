import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface for TypeScript
interface IUser extends Document {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  resetToken?: string | null;
  tokenExpiry?: Date | null;
}

// Define the schema
const UserSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true, // Remove leading/trailing spaces
    },
    resetToken: {
      type: String,
      trim: true, // Remove leading/trailing spaces
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);


// Create the model
const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;
