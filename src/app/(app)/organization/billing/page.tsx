import {
	BillingAddressSettingsForm,
	DiscountSettingsForm,
	PaymentMethodSettingsForm,
	PlanSettingsForm,
} from '@/components/billing/settings'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'

export default function Page() {
	return (
		<TabsContent value="billing" className="py-4 md:py-6">
			<section className="grid grid-cols-6 gap-4 md:gap-6">
				<Card className="col-span-2">
					<CardHeader>
						<CardTitle>Managed By Stripe</CardTitle>
						<CardDescription>
							All payments are fulfilled using Stripe. End-to-end encryption,
							fully secure.
						</CardDescription>
					</CardHeader>
					<CardFooter className="mt-auto">
						<Button className="grow" variant={'link'}>
							Change Plan On Stripe
						</Button>
						<Button className="grow" variant={'link'}>
							Learn More
						</Button>
					</CardFooter>
				</Card>
				<PlanSettingsForm cardProps={{ className: 'col-span-4' }} />
				<PaymentMethodSettingsForm cardProps={{ className: 'col-span-2' }} />
				<BillingAddressSettingsForm cardProps={{ className: 'col-span-2' }} />
				<DiscountSettingsForm cardProps={{ className: 'col-span-2' }} />
			</section>
		</TabsContent>
	)
}
