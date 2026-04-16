import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { User } from './features/users/user.model';
import { hashPassword } from './shared/utils/password.utils';
import { ROLES } from './shared/constants/roles';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI!;

interface SeedUser {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'user';
}

const seedUsers: SeedUser[] = [
  {
    name: 'Admin User',
    email: 'admin@purplemerit.com',
    password: 'Admin@123',
    role: ROLES.ADMIN,
  },
  {
    name: 'Manager User',
    email: 'manager@purplemerit.com',
    password: 'Manager@123',
    role: ROLES.MANAGER,
  },
  {
    name: 'John Doe',
    email: 'user1@example.com',
    password: 'User@123',
    role: ROLES.USER,
  },
  {
    name: 'Jane Smith',
    email: 'user2@example.com',
    password: 'User@123',
    role: ROLES.USER,
  },
  {
    name: 'Bob Johnson',
    email: 'user3@example.com',
    password: 'User@123',
    role: ROLES.USER,
  },
];

const seed = async (): Promise<void> => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    console.log('Clearing existing users...');
    await User.deleteMany({});

console.log('Creating seed users...');
    const createdUsers = await Promise.all(
      seedUsers.map(async (userData) => {
        const user = await User.create({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role: userData.role,
          status: 'active',
        });
        return user;
      })
    );

    console.log('\n========== SEED COMPLETE ==========\n');
    console.log('Created users:');
    console.log('-----------------------------------');
    createdUsers.forEach((user) => {
      const originalUser = seedUsers.find((u) => u.email === user.email);
      console.log(
        `| ${user.role.padEnd(8)} | ${user.email.padEnd(28)} | ${originalUser!.password} |`
      );
    });
    console.log('-----------------------------------\n');
    console.log('You can now login with any of these credentials.\n');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
