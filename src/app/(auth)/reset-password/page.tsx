import { GalleryVerticalEnd } from "lucide-react";

import { ResetPassword } from '@/components/auth/reset-password'
import { appName } from "@/data/app";
import Link from "next/link";
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { resetPasswordCookieName } from '@/constants/auth'

export default async function Page() {
	const cookieStore = await cookies()
	const resetCookie = cookieStore.get(resetPasswordCookieName)

	if (!resetCookie) {
		redirect('/forgot-password') // or show error
	}
	return (
		<div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<Link
					href="#"
					className="flex items-center gap-2 self-center font-medium"
				>
					<div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
						<GalleryVerticalEnd className="size-4" />
					</div>
					{appName}
				</Link>
				<ResetPassword />
			</div>
		</div>
	)
}
