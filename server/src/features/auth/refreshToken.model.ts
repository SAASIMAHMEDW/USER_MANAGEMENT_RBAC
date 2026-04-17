import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IRefreshToken extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  revoked: boolean;
}

interface IRefreshTokenMethods {
  isExpired(): boolean;
  isRevoked(): boolean;
}

type RefreshTokenModel = Model<IRefreshToken, {}, IRefreshTokenMethods>;

const refreshTokenSchema = new Schema<IRefreshToken, RefreshTokenModel, IRefreshTokenMethods>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfter: 0 },
    },
    revoked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

refreshTokenSchema.methods.isExpired = function (): boolean {
  return new Date() > this.expiresAt;
};

refreshTokenSchema.methods.isRevoked = function (): boolean {
  return this.revoked;
};

export const RefreshToken = mongoose.model<IRefreshToken, RefreshTokenModel>('RefreshToken', refreshTokenSchema);