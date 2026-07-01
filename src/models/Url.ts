import mongoose, { Document, Schema } from "mongoose";

export interface IUrl extends Document {
  clicks: number;
  shortUrl: string;
  originalUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const UrlSchema: Schema = new Schema<IUrl>({
   originalUrl: { type: String, required: true },
   shortUrl: { type: String, required: true,unique:true,index:true },
   clicks: { type: Number, default: 0 },
   

  }, { timestamps: true });


UrlSchema.index({ createdAt: -1 });
// UrlSchema.index({ shortUrl: 1 });
export const Url = mongoose.model<IUrl>("Url", UrlSchema);
