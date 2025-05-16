export const setup = {
	required: {
		hasAppUrl: typeof process.env.NEXT_PUBLIC_APP_URL !== 'undefined',
		hasDatabaseUrl: typeof process.env.DATABASE_URL !== 'undefined',
		hasSessionSecret: typeof process.env.SESSION_SECRET !== 'undefined',
	},
	optional: {
		hasIpInfo: typeof process.env.IP_INFO_API_KEY !== 'undefined',
		hasGoogleOauthClientId:
			typeof process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID !== 'undefined',
		hasGoogleOauthClientSecret:
			typeof process.env.GOOGLE_OAUTH_CLIENT_SECRET !== 'undefined',
		hasStripePublishableKey:
			typeof process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY !== 'undefined',
		hasStripeSecretKey: typeof process.env.STRIPE_SECRET_KEY !== 'undefined',
	},
}

export const hideStripeDependents = true