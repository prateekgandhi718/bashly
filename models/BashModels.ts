import mongoose, { Document, Schema } from "mongoose";

// Profile Schema
export interface ProfileDocument extends Document {
  userId: string;
  name: string;
  imageUrl: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new Schema<ProfileDocument>({
  userId: { type: String, unique: true },
  name: String,
  imageUrl: String,
  email: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Profile = mongoose.models.Profile || mongoose.model<ProfileDocument>('Profile', profileSchema);

// Bash Schema
export interface BashDocument extends Document {
  name: string;
  imageUrl: string;
  inviteCode: string;
  profile: Schema.Types.ObjectId | ProfileDocument;
  createdAt: Date;
  updatedAt: Date;
}

const bashSchema = new Schema<BashDocument>({
  name: String,
  imageUrl: String,
  inviteCode: { type: String, unique: true },
  profile: { type: Schema.Types.ObjectId, ref: 'Profile' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Bash = mongoose.models.Bash || mongoose.model<BashDocument>('Bash', bashSchema);

// Member Schema
export interface MemberDocument extends Document {
  role: 'ADMIN' | 'MODERATOR' | 'GUEST';
  profile: Schema.Types.ObjectId | ProfileDocument;
  bash: Schema.Types.ObjectId | BashDocument;
  createdAt: Date;
  updatedAt: Date;
}

const memberSchema = new Schema<MemberDocument>({
  role: { type: String, enum: ['ADMIN', 'MODERATOR', 'GUEST'], default: 'GUEST' },
  profile: { type: Schema.Types.ObjectId, ref: 'Profile' },
  bash: { type: Schema.Types.ObjectId, ref: 'Bash' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Member = mongoose.models.Member || mongoose.model<MemberDocument>('Member', memberSchema);

// Channel Schema
export interface ChannelDocument extends Document {
  name: string;
  type: 'SYSTEM' | 'TEXT' | 'AUDIO' | 'VIDEO';
  profile: Schema.Types.ObjectId | ProfileDocument;
  bash: Schema.Types.ObjectId | BashDocument;
  createdAt: Date;
  updatedAt: Date;
}

const channelSchema = new Schema<ChannelDocument>({
  name: String,
  type: { type: String, enum: ['SYSTEM', 'TEXT', 'AUDIO', 'VIDEO'], default: 'TEXT' },
  profile: { type: Schema.Types.ObjectId, ref: 'Profile' },
  bash: { type: Schema.Types.ObjectId, ref: 'Bash' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Channel = mongoose.models.Channel || mongoose.model<ChannelDocument>('Channel', channelSchema);


// Message Schema
export interface MessageDocument extends Document {
  content: string;
  fileUrl?: string;
  memberId: Schema.Types.ObjectId | MemberDocument;
  channelId: Schema.Types.ObjectId | ChannelDocument;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<MessageDocument>({
  content: { type: String, required: true },
  fileUrl: { type: String },
  memberId: { type: Schema.Types.ObjectId, ref: 'Member' },
  channelId: { type: Schema.Types.ObjectId, ref: 'Channel' },
  deleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
 
export const Message = mongoose.models.Message || mongoose.model<MessageDocument>('Message', messageSchema);

// Conversation Schema
interface ConversationDocument extends Document {
  memberOneId: Schema.Types.ObjectId | MemberDocument;
  memberTwoId: Schema.Types.ObjectId | MemberDocument;
}

const conversationSchema = new Schema<ConversationDocument>({
  memberOneId: { type: Schema.Types.ObjectId, ref: 'Member' },
  memberTwoId: { type: Schema.Types.ObjectId, ref: 'Member' },
});

export const Conversation = mongoose.models.Conversation || mongoose.model<ConversationDocument>('Conversation', conversationSchema);


//DM Schema
interface DirectMessageDocument extends Document {
  content: string;
  fileUrl?: string;
  memberId: Schema.Types.ObjectId | MemberDocument;
  conversationId: Schema.Types.ObjectId | ConversationDocument;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const directMessageSchema = new Schema<DirectMessageDocument>({
  content: { type: String, required: true },
  fileUrl: { type: String },
  memberId: { type: Schema.Types.ObjectId, ref: 'Member' },
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation' },
  deleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const DirectMessage = mongoose.models.DirectMessage || mongoose.model<DirectMessageDocument>('DirectMessage', directMessageSchema);