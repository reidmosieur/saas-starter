import {
	PermissionKey,
	readGrantedDashboard,
	readOrganizationOrganization,
	readOwnUser,
} from './permissions'

export const baseUrl = process.env.NEXT_PUBLIC_APP_URL

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
export const privacyRoute = '/privacy'
export const termsRoute = '/terms'
export const googleRedirectRoute = '/api/auth/google/callback'

// onboarding
export const onboardingRoute = '/onboarding'
export const completedOnboardingRoute = onboardingRoute + '/completed'
export const credentialsOnboardingRoute = onboardingRoute + '/credentials'
export const organizationOnboardingRoute = onboardingRoute + '/organization'
export const personalInfoOnboardingRoute = onboardingRoute + '/personal-info'
export const usernameOnboardingRoute = onboardingRoute + '/username'

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
