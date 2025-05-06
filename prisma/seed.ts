import { PrismaClient } from '@/generated/prisma'
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
	const permission = await prisma.permission.create({
		data: {
			action: 'read',
			access: 'granted',
			entity: 'dashboard',
		},
	})

	// Create role
	const role = await prisma.role.create({
		data: {
			organization: { connect: { id: org.id } },
			permissions: {
				connect: { id: permission.id },
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

	// Create user
	await prisma.user.create({
		data: {
			email: 'john.doe@example.com',
			username: 'johndoe',
			firstName: 'John',
			lastName: 'Doe',
			organization: { connect: { id: org.id } },
			password: { connect: { id: password.id } },
			phoneNumber: { connect: { id: phoneNumber.id } },
			roles: { connect: { id: role.id } },
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
							createdAt: new Date('2025-04-20T08:30:00Z'),
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
