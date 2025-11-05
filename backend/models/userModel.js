import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    // Fields specific to Donar
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: {type: String , required : function() { return this.role === 'user'; } },
    
    role: { type: String, enum: ['user', 'ngo'], required: true },

    // Fields specific to NGO
    logoUrl: { type: String },
    category: { type: String },
    location: { type: String },
    description: { type: String },
    acceptedItems: [{ type: String }],
    isConfigured: { type: Boolean, default: false }
}, { timestamps: true });

// Conditional validation: NGO fields are required only for NGOs
userSchema.pre('validate', function (next) {
    if (this.role === 'ngo') {
        if (!this.category || !this.location || !this.description) {
            return next(new Error('Missing required NGO fields'));
        }
    }
    next();
});

const userModel = mongoose.models.User ||
    mongoose.model('User', userSchema)

export default userModel