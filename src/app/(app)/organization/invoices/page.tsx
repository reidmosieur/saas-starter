import { readInvoices } from '@/app/actions/stripe'
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

	if (!user || !stripeCustomerId) {
		redirect('/logout')
	}

	const invoices = await readInvoices(stripeCustomerId)

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
											{invoice_pdf ? (
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
