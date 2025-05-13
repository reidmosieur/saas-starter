export const defaultUserSelect = {
	firstName: true,
	lastName: true,
	email: true,
	onboarded: true,
	avatar: {
		select: {
			src: true,
		},
	},
	organization: {
		select: {
			name: true,
		},
	},
	roles: {
		select: {
			permissions: true,
		},
	},
}
