import { GalleryVerticalEnd } from 'lucide-react'

import { Signup } from '@/components/auth/signup'
import Link from 'next/link'
import { appName } from '@/data/app'
import { Fragment } from 'react'
import Script from 'next/script'

export default function Page() {
	return (
		<Fragment>
			<Script src="https://accounts.google.com/gsi/client" async />
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
					<Signup />
				</div>
			</div>
		</Fragment>
	)
}
