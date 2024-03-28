import mongoose from "mongoose";

const { Schema } = mongoose;

// Profile Model
const profileSchema = new Schema({
  userId: { type: String, unique: true },
  name: String,
  imageUrl: String,
  email: String,
  bashes: [{ type: Schema.Types.ObjectId, ref: 'Bash' }],
  members: [{ type: Schema.Types.ObjectId, ref: 'Member' }],
  channels: [{ type: Schema.Types.ObjectId, ref: 'Channel' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Bash Model
const bashSchema = new Schema({
  name: String,
  imageUrl: String,
  inviteCode: { type: String, unique: true },
  profile: { type: Schema.Types.ObjectId, ref: 'Profile' },
  members: [{ type: Schema.Types.ObjectId, ref: 'Member' }],
  channels: [{ type: Schema.Types.ObjectId, ref: 'Channel' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Member Model
const memberSchema = new Schema({
  role: { type: String, enum: ['ADMIN', 'MODERATOR', 'GUEST'], default: 'GUEST' },
  profile: { type: Schema.Types.ObjectId, ref: 'Profile' },
  bash: { type: Schema.Types.ObjectId, ref: 'Bash' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Channel Model
const channelSchema = new Schema({
  name: String,
  type: { type: String, enum: ['SYSTEM', 'TEXT', 'AUDIO', 'VIDEO'], default: 'TEXT' },
  profile: { type: Schema.Types.ObjectId, ref: 'Profile' },
  bash: { type: Schema.Types.ObjectId, ref: 'Bash' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);
const Bash = mongoose.models.Bash || mongoose.model('Bash', bashSchema);
const Member = mongoose.models.Member || mongoose.model('Member', memberSchema);
const Channel = mongoose.models.Channel || mongoose.model('Channel', channelSchema);

export { Profile, Bash, Member, Channel };


