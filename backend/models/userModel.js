import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['customer', 'vendor', 'admin'],
    },
    availableRoles: [{
        type: String,
        enum: ['customer', 'vendor', 'admin'],
        default: ['customer']
    }]
}, {
    timestamps: true
});

// Admin Schema
const adminSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true // One admin per user
    },
    permissions: [{
        type: String,
        enum: ["ban_user", "view_reports", "manage_products", "handle_refunds", "view_cashflow"]
    }],
    accessLevel: {
        type: String,
        enum: ["moderator", "super_admin", "support"],
        default: "moderator"
    },
    lastLogin: Date,
    auditLogs: [{
        action: String,
        timestamp: {
            type: Date,
            default: Date.now
        },
        details: mongoose.Schema.Types.Mixed
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Create models
const User = mongoose.model('User', UserSchema);
const Admin = mongoose.model('Admin', adminSchema);

// Export both models
export { User, Admin };