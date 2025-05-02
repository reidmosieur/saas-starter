import { appName, contact } from '@/data/app'
import Link from 'next/link'

export default function Page() {
	const effectiveDate = new Date().toLocaleDateString()
	const { email: contactEmail } = contact
	return (
		<main>
			<header className="flex gap-4 border-b-2 px-2 py-4 md:px-8">
				<Link href={'/'}>{appName}</Link>
				<Link href={'/login'}>Login</Link>
			</header>
			<section className="max-w-prose space-y-4 px-2 py-4 md:px-8">
				<h1>Privacy Policy</h1>
				<p>
					<strong>Effective Date:</strong> {effectiveDate}
				</p>

				<h2>1. Information We Collect</h2>
				<p>We collect:</p>
				<ul>
					<li>
						<strong>Account Info:</strong> Name, email, password (encrypted)
					</li>
					<li>
						<strong>Usage Data:</strong> Pages visited, actions taken, and
						general app behavior
					</li>
					<li>
						<strong>Optional:</strong> Info you provide during onboarding or via
						integrations
					</li>
				</ul>

				<h2>2. How We Use It</h2>
				<p>We use your data to:</p>
				<ul>
					<li>Provide and improve the Service</li>
					<li>Communicate with you</li>
					<li>Troubleshoot issues</li>
					<li>Enforce our Terms</li>
				</ul>
				<p>
					We <strong>don’t sell</strong> your personal information.
				</p>

				<h2>3. Cookies & Tracking</h2>
				<p>
					We may use cookies or similar technologies to improve user experience
					and analyze usage. You can control cookies via browser settings.
				</p>

				<h2>4. Data Sharing</h2>
				<p>
					We may share data with service providers (e.g., cloud hosting,
					analytics), but only to operate the Service. We require them to
					protect your data.
				</p>

				<h2>5. Security</h2>
				<p>
					We use reasonable security practices to protect your data, but no
					system is 100% secure.
				</p>

				<h2>6. Data Retention</h2>
				<p>
					We retain your data as long as necessary to provide the Services and
					comply with legal obligations.
				</p>

				<h2>7. Your Rights</h2>
				<p>You may:</p>
				<ul>
					<li>Request a copy of your data</li>
					<li>Ask us to delete your account</li>
					<li>Contact us with privacy concerns</li>
				</ul>

				<h2>8. Changes</h2>
				<p>
					We may update this policy. We’ll notify you if changes are
					significant.
				</p>

				<h2>9. Contact</h2>
				<p>
					For privacy-related questions, contact{' '}
					<a href={`mailto:${contactEmail}`}>{contactEmail}</a>
				</p>
			</section>
		</main>
	)
}
