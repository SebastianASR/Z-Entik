import { SetMetadata } from '@nestjs/common';

export const BLOCK_DEMO_USERS_KEY = 'blockDemoUsers';

export const BlockDemoUsers = () => SetMetadata(BLOCK_DEMO_USERS_KEY, true);
