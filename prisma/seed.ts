import { PrismaClient } from '@/generated/prisma'
import { constructPermissionKey } from '@/lib/utils'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
	console.time('Seed completed!')

	// Create organization
	const org = await prisma.organization.create({
		data: {
			name: 'Acme Inc',
		},
	})

	// Create permission
	const actions = ['create', 'read', 'update', 'delete']
	const accesses = ['own', 'organization'] // organization takes the place of the traditional "any"
	const entities = ['user', 'organization', 'avatar', 'role']
	const permissionsData = actions.flatMap((action) =>
		accesses.flatMap((access) =>
			entities.flatMap((entity) => ({
				name: `${action} ${access} ${entity}`,
				key: constructPermissionKey({ action, access, entity }),
				action,
				access,
				entity,
			})),
		),
	)
	const permissions = await prisma.permission.createManyAndReturn({
		data: [
			{
				// indicates a user is allowed to use the app
				// useful for after onboarding, eg if a users access is revoked
				name: 'view dashboard',
				key: constructPermissionKey({
					action: 'read',
					access: 'granted',
					entity: 'dashboard',
				}),
				action: 'read',
				access: 'granted',
				entity: 'dashboard',
			},
			...permissionsData,
		],
		select: {
			id: true,
		},
	})

	// Create owner role
	const owner = await prisma.role.create({
		data: {
			// standard
			name: 'Organization Owner',
			organization: { connect: { id: org.id } },
			permissions: {
				connect: permissions.map(({ id }) => ({
					id,
				})),
			},
		},
	})

	// Create employee role
	const employeePermissions = await prisma.permission.findMany({
		where: {
			OR: [
				// limited access to manage own user
				{
					AND: {
						action: {
							in: ['read', 'update'],
						},
						access: 'own',
					},
					entity: 'user',
				},
				// full access to manage own avatar
				{
					entity: 'avatar',
					AND: {
						access: 'own',
					},
				},
				// read access to organization
				{
					action: 'read',
					access: 'own',
					entity: 'organization',
				},
				// read access to organization roles
				// for team lists, permission issues, etc
				{
					action: 'read',
					access: 'organization',
					entity: 'role',
				},
			],
		},
	})
	const employee = await prisma.role.create({
		data: {
			name: 'Employee',
			organization: { connect: { id: org.id } },
			permissions: {
				connect: employeePermissions.map(({ id }) => ({ id })),
			},
		},
	})

	// Create password
	const passwordHash = await bcrypt.hash('password', 10)
	const password = await prisma.password.create({
		data: {
			hash: passwordHash,
		},
	})

	// Create phone number
	const phoneNumber = await prisma.phoneNumber.create({
		data: {
			countryCode: '+1',
			number: '5551234567',
		},
	})

	// Dates
	const emailVerified = new Date('2025-04-20T08:30:00Z')
	const onboardingStarted = new Date('2025-04-20T08:32:00Z')
	const credentialsCompleted = new Date('2025-04-20T08:34:00Z')
	const personalInfoCompleted = new Date('2025-04-20T08:35:00Z')
	const organizationCompleted = new Date('2025-04-20T08:36:00Z')
	const onboardingCompleted = new Date('2025-04-20T08:37:00Z')

	// Create owner user
	await prisma.user.create({
		data: {
			email: 'john.doe@example.com',
			emailVerified,
			username: 'johndoe',
			firstName: 'John',
			lastName: 'Doe',
			fullName: 'John Doe',
			organization: { connect: { id: org.id } },
			password: { connect: { id: password.id } },
			phoneNumber: { connect: { id: phoneNumber.id } },
			roles: { connect: { id: owner.id } },
			onboarded: onboardingCompleted,
			onboarding: {
				create: {
					startedAt: onboardingStarted,
					completedAt: onboardingCompleted,
					updatedAt: onboardingCompleted,
					currentStep: 'COMPLETED',
					completedSteps: ['CREDENTIALS', 'PERSONAL_INFO', 'ORGANIZATION'],
					stepTimeStamps: {
						CREDENTIALS: credentialsCompleted,
						PERSONAL_INFO: personalInfoCompleted,
						ORGANIZATION: organizationCompleted,
					},
				},
			},
			sessions: {
				createMany: {
					data: [
						{
							createdAt: new Date('2025-05-01T10:00:00Z'),
							updatedAt: new Date('2025-05-01T10:00:00Z'),
							context: 'email-login',
							ipAddress: '1.1.1.1',
							ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15',
							browserName: 'Safari',
							browserVersion: '16.1',
							browserMajor: '16',
							deviceType: 'desktop',
							osName: 'Mac OS',
							osVersion: '13.3',
							engineName: 'WebKit',
							engineVersion: '605.1.15',
							cpuArchitecture: 'x64',
							isBot: false,
							expiresAt: new Date('2025-06-01T10:00:00Z'),
							hostname: 'cpe-76-169-1-100.socal.res.rr.com',
							city: 'Los Angeles',
							region: 'California',
							country: 'US',
							loc: '34.0522,-118.2437',
							org: 'AS20001 Charter Communications Inc',
							postal: '90001',
							timezone: 'America/Los_Angeles',
						},
						{
							createdAt: emailVerified,
							updatedAt: new Date('2025-04-22T14:15:00Z'),
							context: 'email-signup',
							ipAddress: '1.1.1.1',
							ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:114.0) Gecko/20100101 Firefox/114.0',
							browserName: 'Firefox',
							browserVersion: '114.0',
							browserMajor: '114',
							deviceType: 'desktop',
							osName: 'Windows',
							osVersion: '10',
							engineName: 'Gecko',
							engineVersion: '114.0',
							cpuArchitecture: 'x64',
							isBot: false,
							expiresAt: new Date('2025-05-20T08:30:00Z'),
							hostname: 'ec2-3-88-100-200.compute-1.amazonaws.com',
							city: 'Ashburn',
							region: 'Virginia',
							country: 'US',
							loc: '39.0438,-77.4874',
							org: 'AS14618 Amazon.com, Inc.',
							postal: '20149',
							timezone: 'America/New_York',
						},
					],
				},
			},
			avatar: {
				create: {
					src: '/user-images/johndoe.local.png',
					alt: 'Your avatar',
					height: 500,
					width: 500,
				},
			},
		},
	})

	// Create employee user
	await prisma.user.create({
		data: {
			email: 'jane.doe@example.com',
			emailVerified,
			username: 'janedoe',
			firstName: 'Jane',
			lastName: 'Doe',
			fullName: 'Jane Doe',
			organization: { connect: { id: org.id } },
			password: { connect: { id: password.id } },
			phoneNumber: { connect: { id: phoneNumber.id } },
			roles: { connect: { id: employee.id } },
			onboarded: onboardingCompleted,
			onboarding: {
				create: {
					startedAt: onboardingStarted,
					completedAt: onboardingCompleted,
					updatedAt: onboardingCompleted,
					currentStep: 'COMPLETED',
					completedSteps: ['CREDENTIALS', 'PERSONAL_INFO', 'ORGANIZATION'],
					stepTimeStamps: {
						CREDENTIALS: credentialsCompleted,
						PERSONAL_INFO: personalInfoCompleted,
						ORGANIZATION: organizationCompleted,
					},
				},
			},
			sessions: {
				createMany: {
					data: [
						{
							createdAt: new Date('2025-05-01T10:00:00Z'),
							updatedAt: new Date('2025-05-01T10:00:00Z'),
							context: 'email-login',
							ipAddress: '1.1.1.1',
							ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15',
							browserName: 'Safari',
							browserVersion: '16.1',
							browserMajor: '16',
							deviceType: 'desktop',
							osName: 'Mac OS',
							osVersion: '13.3',
							engineName: 'WebKit',
							engineVersion: '605.1.15',
							cpuArchitecture: 'x64',
							isBot: false,
							expiresAt: new Date('2025-06-01T10:00:00Z'),
							hostname: 'cpe-76-169-1-100.socal.res.rr.com',
							city: 'Los Angeles',
							region: 'California',
							country: 'US',
							loc: '34.0522,-118.2437',
							org: 'AS20001 Charter Communications Inc',
							postal: '90001',
							timezone: 'America/Los_Angeles',
						},
						{
							createdAt: emailVerified,
							updatedAt: new Date('2025-04-22T14:15:00Z'),
							context: 'email-signup',
							ipAddress: '1.1.1.1',
							ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:114.0) Gecko/20100101 Firefox/114.0',
							browserName: 'Firefox',
							browserVersion: '114.0',
							browserMajor: '114',
							deviceType: 'desktop',
							osName: 'Windows',
							osVersion: '10',
							engineName: 'Gecko',
							engineVersion: '114.0',
							cpuArchitecture: 'x64',
							isBot: false,
							expiresAt: new Date('2025-05-20T08:30:00Z'),
							hostname: 'ec2-3-88-100-200.compute-1.amazonaws.com',
							city: 'Ashburn',
							region: 'Virginia',
							country: 'US',
							loc: '39.0438,-77.4874',
							org: 'AS14618 Amazon.com, Inc.',
							postal: '20149',
							timezone: 'America/New_York',
						},
					],
				},
			},
			avatar: {
				create: {
					src: '/user-images/janedoe.local.png',
					alt: 'Your avatar',
					height: 500,
					width: 500,
				},
			},
		},
	})

	console.timeEnd('Seed completed!')
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(() => prisma.$disconnect())
