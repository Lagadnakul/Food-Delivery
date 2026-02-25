/**
 * Run this script ONCE to grant admin rights to an existing user.
 * 
 * Usage (from /backend directory):
 *   node scripts/makeAdmin.js admin@hungerhive.com
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userModel from '../models/userModel.js';

dotenv.config();
dotenv.config({ path: './.env.local' });

const email = process.argv[2];
if (!email) {
  console.error('Usage: node scripts/makeAdmin.js <email>');
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);

const user = await userModel.findOne({ email });
if (!user) {
  console.error(`No user found with email: ${email}`);
  process.exit(1);
}

user.isAdmin = true;
await user.save();

console.log(`✅ ${user.name} (${email}) is now an admin.`);
process.exit(0);
