export type IpInfoResponse = {
	ip: string
	hostname: string
	city: string
	region: string
	country: string
	loc: string
	org: string
	postal: string
	timezone: string
}

export interface UserAgent {
	isBot: boolean
	ua: string
	browser: {
		name?: string
		version?: string
		major?: string
	}
	device: {
		model?: string
		type?: string
		vendor?: string
	}
	engine: {
		name?: string
		version?: string
	}
	os: {
		name?: string
		version?: string
	}
	cpu: {
		architecture?: string
	}
}
