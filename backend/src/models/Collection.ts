// models/Collection.js
import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICollection extends Document {
  user: Types.ObjectId;
  name: string;
  samples: Types.ObjectId[];
}

const CollectionSchema = new Schema<ICollection>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  samples: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AudioSample' }]
});

export default mongoose.model<ICollection>('Collection', CollectionSchema);