import * as dotenv from 'dotenv';
import path, { dirname } from 'path'
import { fileURLToPath } from 'url';
import { RefreshingAuthProvider} from '@twurple/auth';
import { promises as fs } from 'fs';
//@URL https://dev.twitch.tv/ in case of issues. 
//https://twitchtokengenerator.com/

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, './.env') })

const clientId = process.env.CLIENTID
const clientSecret = process.env.CLIENTSECRET
export const botId = process.env.BOTID
export const botUser = process.env.BOTNAME
export const apiKey = process.env.AUTHCODE
export const org = process.env.ORG

const tokenData = JSON.parse(await fs.readFile('./tokens.132881296.json', 'UTF-8'));

export const authProvider = new RefreshingAuthProvider(
	{
		clientId,
		clientSecret,
		onRefresh: async (botId, newTokenData) => await fs.writeFile(`./tokens.132881296.json`, JSON.stringify(newTokenData, null, 4), 'UTF-8'),
	},
);

await authProvider.addUserForToken(tokenData, ['chat']);
