import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String},
  userEmail: {type:String},
  userPhoneNumber: { type: String },
  itemName: { type: String, required: true },
  description: { type: String },
  userAddress: { type: String, required: true },
  // pdfUrl: { type: String },
  images: [{type:String}],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

const donationModel = mongoose.models.donation ||
                      mongoose.model('donation', donationSchema)

export default donationModel;