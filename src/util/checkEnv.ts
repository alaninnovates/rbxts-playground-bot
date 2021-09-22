interface ObjectMap {
	[key: string]: string | undefined;
}

export const checkEnv = () => {
	const envVars = process.env! as ObjectMap;
	const requiredVars = ['DISCORD_TOKEN', 'PREFIX', 'ALLOWED_CHANNELS'];
	for (const variable of requiredVars) {
		if (!envVars[variable])
			throw new Error(`Missing env variable: ${variable}`);
	}
};
