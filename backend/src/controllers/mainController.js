import Trip from '../models/Main.js';
import User from '../models/User.js';
// it was an overkill to use crypto for invitation codes, insted we use helper function to generate them
import crypto from 'crypto';
import { generateInvitationCode } from '../utils/generateInvitationCode.js';
