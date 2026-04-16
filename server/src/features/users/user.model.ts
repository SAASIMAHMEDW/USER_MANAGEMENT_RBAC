import mongoose, { Document, Model, Schema } from 'mongoose';
import { comparePassword, hashPassword } from '../../shared/utils/password.utils';
import { ROLES, Role } from '../../shared/constants/roles';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  status: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret.password;
        return ret;
      },
    },
    toObject: {
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret.password;
        return ret;
      },
    },
  }
);

userSchema.index({ role: 1, status: 1 });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await hashPassword(this.password);
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return comparePassword(candidatePassword, this.password);
};

export const User = mongoose.model<IUser, UserModel>('User', userSchema);
