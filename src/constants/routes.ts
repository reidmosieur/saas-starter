import {
	PermissionKey,
	readGrantedDashboard,
	readOrganizationOrganization,
	readOwnUser,
} from './permissions'

// app
export const root = '/'

// organization settings
export const organizationSettings = '/organization'
export const billingSettings = '/organization/billing'
export const invoices = '/organization/invoices'

// user settings
export const settings = '/settings'
export const securitySettings = '/settings/security'

// auth
export const logout = '/logout'
export const login = '/login'
export const signup = '/signup'
export const forgotPassword = '/forgot-password'
export const resetPassword = '/reset-password'
export const verifyOtp = '/verify'
export const onboarding = '/onboarding'
export const privacy = '/privacy'
export const terms = '/terms'

export const protectedRoutes = [
	root,
	organizationSettings,
	billingSettings,
	invoices,
	settings,
	securitySettings,
]
export const publicRoutes = [
	logout,
	login,
	signup,
	forgotPassword,
	resetPassword,
	verifyOtp,
	onboarding,
	privacy,
	terms,
]

type RoutePermissions = Array<{
	route: string
	permissions: Array<PermissionKey>
}>

export const routePermissions: RoutePermissions = [
	{
		route: root,
		permissions: [readGrantedDashboard].map(({ key }) => key),
	},
	{
		route: organizationSettings,
		permissions: [readOrganizationOrganization].map(({ key }) => key),
	},
	// billing settings and invoice could have a more granular permission like read:organization:billing
	// but this works for most simple apps
	{
		route: billingSettings,
		permissions: [readOrganizationOrganization].map(({ key }) => key),
	},
	{
		route: invoices,
		permissions: [readOrganizationOrganization].map(({ key }) => key),
	},
	{
		route: settings,
		permissions: [readOwnUser].map(({ key }) => key),
	},
	{
		route: securitySettings,
		permissions: [readOwnUser].map(({ key }) => key),
	},
]
