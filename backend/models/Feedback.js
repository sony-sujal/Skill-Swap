import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  swap: { type: mongoose.Schema.Types.ObjectId, ref: 'Swap', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String }
}, { timestamps: true });

export default mongoose.model('Feedback', feedbackSchema);
