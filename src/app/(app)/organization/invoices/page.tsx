import { Button } from '@/components/ui/button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { TabsContent } from '@/components/ui/tabs'
import { EllipsisVertical } from 'lucide-react'
import { redirect } from 'next/navigation'
import { constructRequiredPermissions } from '@/lib/utils'
import { readOrganizationOrganization } from '@/constants/permissions'
import { checkUserPermissions } from '@/lib/access-control'

const requiredPermissions = constructRequiredPermissions([
	readOrganizationOrganization,
])
const additionalSelect = {
	organization: {
		select: {
			name: true,
			users: {
				select: {
					firstName: true,
					lastName: true,
					email: true,
					roles: true,
					createdAt: true,
				},
			},
			roles: {
				select: {
					name: true,
					users: {
						select: {
							firstName: true,
							lastName: true,
						},
						take: 2,
					},
					permissions: {
						select: {
							name: true,
						},
						take: 2,
					},
					_count: {
						select: {
							users: true,
							permissions: true,
						},
					},
				},
			},
		},
	},
}

export default async function Page() {
	const { permitted, user } = await checkUserPermissions({
		requiredPermissions,
		additionalSelect,
	})

	if (!permitted) {
		redirect('/')
	}

	if (!user) {
		redirect('/logout')
	}
	return (
		<TabsContent value="invoices" className="py-4 md:py-6">
			<section>
				<div className="rounded-xl border p-2">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Date</TableHead>
								<TableHead>Plan</TableHead>
								<TableHead>Total</TableHead>
								<TableHead>Payment Method</TableHead>
								<TableHead />
							</TableRow>
						</TableHeader>
						<TableBody>
							<TableRow>
								<TableCell>April 2025</TableCell>
								<TableCell>Starter</TableCell>
								<TableCell>$20</TableCell>
								<TableCell>Visa **** 4242</TableCell>
								<TableCell align="right">
									<Popover>
										<PopoverTrigger asChild>
											<Button variant={'ghost'}>
												<EllipsisVertical />
											</Button>
										</PopoverTrigger>
										<PopoverContent
											align="end"
											className="flex flex-col gap-2 p-1"
										>
											<Button variant={'ghost'} className="justify-start">
												View
											</Button>
											<Button variant={'ghost'} className="justify-start">
												Download
											</Button>
										</PopoverContent>
									</Popover>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
			</section>
		</TabsContent>
	)
}
