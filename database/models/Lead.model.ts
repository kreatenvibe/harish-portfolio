import { Schema, model, models, Document, Types } from "mongoose";

export interface ILead {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  business?: string;
  businessDescription?: string;
  improvement?: string;
  currentTools?: string;
  whatToBuild?: string;
  anythingElse?: string;
  read: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILeadDoc extends Omit<ILead, "_id">, Document {}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    business: { type: String },
    businessDescription: { type: String },
    improvement: { type: String },
    currentTools: { type: String },
    whatToBuild: { type: String },
    anythingElse: { type: String },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes
LeadSchema.index({ read: 1 });
LeadSchema.index({ createdAt: -1 });

const Lead = models?.Lead || model<ILead>("Lead", LeadSchema);
export default Lead;
