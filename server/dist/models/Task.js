"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const types_1 = require("../types");
// Task schema definition
const taskSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
    },
    status: {
        type: String,
        enum: Object.values(types_1.TaskStatus),
        default: types_1.TaskStatus.TODO,
    },
    priority: {
        type: String,
        enum: Object.values(types_1.TaskPriority),
        default: types_1.TaskPriority.MEDIUM,
    },
    dueDate: {
        type: Date,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    assignedTo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});
// Create indexes for common queries
taskSchema.index({ createdBy: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
// Create and export Task model
exports.Task = mongoose_1.default.model('Task', taskSchema);
//# sourceMappingURL=Task.js.map