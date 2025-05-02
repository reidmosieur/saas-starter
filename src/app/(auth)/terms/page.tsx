import { appName, contact, location } from '@/data/app'
import Link from 'next/link'

export default function Page() {
	const effectiveDate = new Date().toLocaleDateString()
	const { email: contactEmail } = contact
	const { country, state, county } = location
	return (
		<main>
			<header className="flex gap-4 border-b-2 px-2 py-4 md:px-8">
				<Link href={'/'}>{appName}</Link>
				<Link href={'/login'}>Login</Link>
			</header>
			<section className="max-w-prose space-y-4 px-2 py-4 md:px-8">
				<h1>Terms of Service</h1>
				<p>
					<strong>Effective Date:</strong> {effectiveDate}
				</p>
				<p>
					Welcome to {appName} (“we”, “our”, or “us”). These Terms of Service
					(“Terms”) govern your use of our website and services (“Services”).
				</p>

				<h2>1. Use of Our Service</h2>
				<p>
					By accessing or using our Services, you agree to comply with these
					Terms and any applicable laws. If you do not agree, do not use our
					Services.
				</p>

				<h2>2. Account Registration</h2>
				<p>
					You may need to create an account to use certain features. You’re
					responsible for your account credentials and any activity under your
					account.
				</p>

				<h2>3. Acceptable Use</h2>
				<p>Don’t use our Services to:</p>
				<ul>
					<li>Break the law</li>
					<li>Infringe on intellectual property</li>
					<li>Interfere with the operation of the Services</li>
				</ul>
				<p>
					We reserve the right to suspend or terminate your account for
					violations.
				</p>

				<h2>4. Intellectual Property</h2>
				<p>
					All content and code related to the Services is owned by us or our
					licensors. You may not copy, modify, or distribute it without
					permission.
				</p>

				<h2>5. Availability & Changes</h2>
				<p>
					We may modify, suspend, or discontinue parts of the Services at any
					time, without liability.
				</p>

				<h2>6. Termination</h2>
				<p>
					We may terminate your access at any time for violating these Terms or
					for any reason we determine necessary.
				</p>

				<h2>7. Disclaimer</h2>
				<p>
					The Services are provided “as is” without warranties of any kind. We
					are not liable for any damages arising from your use of the Services.
				</p>

				<h2>8. Governing Law</h2>
				<p>
					These Terms are governed by the laws of {state}, {country}. Any
					disputes will be handled in the courts of {county}.
				</p>

				<h2>9. Contact</h2>
				<p>
					Questions? Email us at{' '}
					<a href={`mailto:${contactEmail}`}>{contactEmail}</a>
				</p>
			</section>
		</main>
	)
}
