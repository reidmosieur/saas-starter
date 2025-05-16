import { getUserFromSession } from '@/app/actions/user'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function GET() {
	const user = await getUserFromSession({ id: true })
	const userId = user?.id

	if (!user || !userId) {
		redirect('/logout')
	}

	// todo: implement verification of required onboarding information

	await prisma.user.update({
		where: {
			id: user.id,
		},
		data: {
			onboarded: new Date(),
		},
	})

	return redirect('/')
}
