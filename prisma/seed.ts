import { PrismaClient } from '@/generated/prisma'

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
	const password = await prisma.password.create({
		data: {
			hash: 'hashed_password_goes_here',
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
