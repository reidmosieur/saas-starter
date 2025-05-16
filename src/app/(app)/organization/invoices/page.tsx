import { readInvoices } from '@/app/actions/stripe'
import { hideStripeDependents } from '@/components/stripe-elements-provider'
import { StripeMissing } from '@/components/stripe-missing'
import { Button } from '@/components/ui/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { TabsContent } from '@/components/ui/tabs'
import { readOrganizationOrganization } from '@/constants/permissions'
import { checkUserPermissions } from '@/lib/access-control'
import { constructRequiredPermissions } from '@/lib/utils'
import { Download } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const requiredPermissions = constructRequiredPermissions([
	readOrganizationOrganization,
])
const additionalSelect = {
	organization: {
		select: {
			stripeCustomerId: true,
		},
	},
}

export default async function Page() {
	const { permitted, user } = await checkUserPermissions({
		requiredPermissions,
		additionalSelect,
	})

	const stripeCustomerId = user?.organization?.stripeCustomerId

	if (!permitted) {
		redirect('/')
	}

	if (!user) {
		redirect('/logout')
	}

	const invoices = hideStripeDependents
		? [
				{
					id: 'in_001',
					invoice_pdf: 'https://example.com/invoices/in_001.pdf',
					amount_paid: 2000,
					description: 'Pro Plan - Monthly Subscription',
					period_start: 1714521600, // May 1, 2024
					period_end: 1717199999, // May 31, 2024
					status: 'paid',
				},
				{
					id: 'in_002',
					invoice_pdf: 'https://example.com/invoices/in_002.pdf',
					amount_paid: 2000,
					description: 'Pro Plan - Monthly Subscription',
					period_start: 1711939200, // April 1, 2024
					period_end: 1714521599, // April 30, 2024
					status: 'paid',
				},
				{
					id: 'in_003',
					invoice_pdf: null,
					amount_paid: 0,
					description: 'Pro Plan - Monthly Subscription',
					period_start: 1709356800, // March 1, 2024
					period_end: 1711939199, // March 31, 2024
					status: 'open',
				},
			]
		: await readInvoices(stripeCustomerId!)

	return (
		<TabsContent value="invoices" className="py-4 md:py-6">
			<section>
				<div className="rounded-xl border p-2">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Description</TableHead>
								<TableHead>Start Date</TableHead>
								<TableHead>End Date</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Amount</TableHead>
								<TableHead />
							</TableRow>
						</TableHeader>
						<TableBody>
							{invoices.map(
								({
									id,
									invoice_pdf,
									amount_paid,
									description,
									period_start,
									period_end,
									status,
								}) => (
									<TableRow key={id}>
										<TableCell>{description}</TableCell>
										<TableCell>
											{new Date(period_start * 1000).toLocaleString()}
										</TableCell>
										<TableCell>
											{new Date(period_end * 1000).toLocaleString()}
										</TableCell>
										<TableCell>{status}</TableCell>
										<TableCell>${amount_paid / 100}</TableCell>
										<TableCell align="right">
											{hideStripeDependents ? (
												<StripeMissing />
											) : invoice_pdf ? (
												<Button variant={'ghost'} size={'icon'} asChild>
													<Link href={invoice_pdf} download>
														<Download />
													</Link>
												</Button>
											) : null}
										</TableCell>
									</TableRow>
								),
							)}
						</TableBody>
					</Table>
				</div>
			</section>
		</TabsContent>
	)
}
