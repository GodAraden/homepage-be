import { config } from 'dotenv';
import { LoginDto } from './dto/login.dto';

const { parsed } = config({ path: '.env.local' });

export const userInfo = JSON.parse(parsed.USERINFO) as LoginDto;
export const xApiKey = parsed.X_API_KEY;
