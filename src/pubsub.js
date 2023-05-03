/*
import { PubSubClient } from '@twurple/pubsub';
import { RefreshingAuthProvider } from '@twurple/auth';

const clientId = '';
const clientSecret = '';
const tokenData = JSON.parse(await fs.readFile('./tokens.125328655.json', 'UTF-8'));
let userId = '';
const authProvider = new RefreshingAuthProvider(
	{
		clientId,
		clientSecret,
		onRefresh: async (userId, newTokenData) => await fs.writeFile(`./tokens.${userId}.json`, JSON.stringify(newTokenData, null, 4), 'UTF-8')
	}
);
authProvider.addUser('125328655', tokenData);
const pubSubClient = new PubSubClient();
userId = await pubSubClient.registerUserListener(authProvider);
*/