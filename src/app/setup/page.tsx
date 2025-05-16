// app/(setup)/page.tsx

import { CheckCircle2, Circle, AlertCircle } from 'lucide-react'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { setup } from '@/constants/setup'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { loginRoute, signupRoute } from '@/constants/routes'

export default function Page() {
	const { required, optional } = setup
	const { hasAppUrl, hasDatabaseUrl, hasSessionSecret } = required
	const {
		hasGoogleOauthClientId,
		hasGoogleOauthClientSecret,
		hasIpInfo,
		hasStripePublishableKey,
		hasStripeSecretKey,
	} = optional

	const requiredSteps = [
		{ label: 'App URL', complete: hasAppUrl },
		{ label: 'Database URL', complete: hasDatabaseUrl },
		{ label: 'Session Secret', complete: hasSessionSecret },
	]

	const optionalSteps = [
		{ label: 'Google OAuth Client ID', complete: hasGoogleOauthClientId },
		{
			label: 'Google OAuth Client Secret',
			complete: hasGoogleOauthClientSecret,
		},
		{ label: 'IP Info API Key', complete: hasIpInfo },
		{ label: 'Stripe Publishable Key', complete: hasStripePublishableKey },
		{ label: 'Stripe Secret Key', complete: hasStripeSecretKey },
	]

	return (
		<div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
			<div>
				<h1>Setup Progress</h1>
				<p className="text-muted-foreground mt-2">
					This page is for setup only. Use it to confirm which environment
					variables are correctly configured and setup the dependencies. Changes
					reflect after a page refresh.
				</p>
				<p className="text-muted-foreground mt-2">
					If you choose to only set up the required environment variables, you
					won&apos;t be able to use &quot;Sign In With Google&quot;, Stripe, or
					a full session model that&apos;s extend with IPinfo data.
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>
						<h2>Required Environment Variables</h2>
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					{requiredSteps.map((step) => (
						<div key={step.label} className="flex items-center gap-3">
							{step.complete ? (
								<CheckCircle2 className="text-green-600" size={20} />
							) : (
								<AlertCircle className="text-red-500" size={20} />
							)}
							<span
								className={step.complete ? 'text-foreground' : 'text-red-500'}
							>
								{step.label}
							</span>
						</div>
					))}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>
						<h2>Important Information</h2>
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<p>
						Once you&apos;ve set up your required environment variables, follow
						these steps. Note, this assumes you have <code>node v20.12.2</code>{' '}
						and <code>npm 10.5.0</code> or later already set up.
					</p>
					<h3>Auto Setup</h3>
					<p>
						From the project root, run <code>npm run setup</code> in your
						terminal. This will handle installing dependencies, setting up
						Prisma, and running the dev server.
					</p>
					<h3>Manual Setup</h3>
					<ol className="list-decimal pl-4">
						<li>
							<strong>Install dependencies:</strong> From the project root, run{' '}
							<code>npm install</code> in your terminal
						</li>
						<li>
							<strong>Set up prisma:</strong> From the project root, run{' '}
							<code>npx prisma migrate dev && npx prisma db seed</code>
						</li>
						<li>
							<strong>Run the dev server:</strong> From the project root, run{' '}
							<code>npm run dev</code>
						</li>
					</ol>
					<p>
						Once you&apos;ve done that, you can run through signup flows or just
						login. There are two accounts that come out of the box:
					</p>
					<dl className="space-y-4">
						<div>
							<dt>John Doe:</dt>
							<dd>
								Email: <code>john.doe@example.com</code>
							</dd>
							<dd>
								Password: <code>password</code>
							</dd>
						</div>

						<div>
							<dt>Jane Doe:</dt>
							<dd>
								Email: <code>jane.doe@example.com</code>
							</dd>
							<dd>
								Password: <code>password</code>
							</dd>
						</div>
					</dl>
				</CardContent>
				<CardFooter className="justify-end gap-4">
					<Button asChild>
						<Link href={signupRoute}>Signup</Link>
					</Button>
					<Button asChild>
						<Link href={loginRoute}>Login</Link>
					</Button>
				</CardFooter>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>
						<h2>Optional Enhancements</h2>
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					{optionalSteps.map((step) => (
						<div key={step.label} className="flex items-center gap-3">
							{step.complete ? (
								<CheckCircle2 className="text-green-600" size={20} />
							) : (
								<Circle className="text-muted-foreground" size={20} />
							)}
							<span
								className={
									step.complete ? 'text-foreground' : 'text-muted-foreground'
								}
							>
								{step.label}
							</span>
						</div>
					))}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>
						<h2>Resources</h2>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<ul className="list-disc pl-4">
						<li>
							<Link
								href={
									'https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid'
								}
							>
								Google OAuth Setup
							</Link>
						</li>
						<li>
							<Link href={'https://docs.stripe.com/keys'}>Stripe Setup</Link>
						</li>
						<li>
							<Link href={'https://ipinfo.io/developers#authentication'}>
								IPinfo
							</Link>
						</li>
					</ul>
				</CardContent>
			</Card>
		</div>
	)
}
