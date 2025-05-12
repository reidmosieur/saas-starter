import {
	PermissionKey,
	readGrantedDashboard,
	readOrganizationOrganization,
	readOwnUser,
} from './permissions'

// app
export const rootRoute = '/'

// organization settings
export const organizationSettingsRoute = '/organization'
export const billingSettingsRoute = '/organization/billing'
export const invoicesRoute = '/organization/invoices'

// user settings
export const settingsRoute = '/settings'
export const securitySettingsRoute = '/settings/security'

// auth
export const logoutRoute = '/logout'
export const loginRoute = '/login'
export const signupRoute = '/signup'
export const forgotPasswordRoute = '/forgot-password'
export const resetPasswordRoute = '/reset-password'
export const verifyRoute = '/verify'
export const verifyCodeRoute = '/verify-code'
export const onboardingRoute = '/onboarding'
export const privacyRoute = '/privacy'
export const termsRoute = '/terms'

export const protectedRoutes = [
	rootRoute,
	organizationSettingsRoute,
	billingSettingsRoute,
	invoicesRoute,
	settingsRoute,
	securitySettingsRoute,
	logoutRoute,
]
export const publicRoutes = [
	loginRoute,
	signupRoute,
	forgotPasswordRoute,
	resetPasswordRoute,
	verifyRoute,
	verifyCodeRoute,
	privacyRoute,
	termsRoute,
]

type RoutePermissions = Array<{
	route: string
	permissions: Array<PermissionKey>
}>

export const routePermissions: RoutePermissions = [
	{
		route: rootRoute,
		permissions: [readGrantedDashboard].map(({ key }) => key),
	},
	{
		route: organizationSettingsRoute,
		permissions: [readOrganizationOrganization].map(({ key }) => key),
	},
	// billing settings and invoice could have a more granular permission like read:organization:billing
	// but this works for most simple apps
	{
		route: billingSettingsRoute,
		permissions: [readOrganizationOrganization].map(({ key }) => key),
	},
	{
		route: invoicesRoute,
		permissions: [readOrganizationOrganization].map(({ key }) => key),
	},
	{
		route: settingsRoute,
		permissions: [readOwnUser].map(({ key }) => key),
	},
	{
		route: securitySettingsRoute,
		permissions: [readOwnUser].map(({ key }) => key),
	},
]
