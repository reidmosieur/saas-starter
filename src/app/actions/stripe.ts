'use server'
import { updateOrganizationOrganization } from '@/constants/permissions'
import { Address } from '@/generated/prisma'
import { checkUserPermissions } from '@/lib/access-control'
import { constructRequiredPermissions } from '@/lib/utils'
import { CancelSubscriptionFormProps } from '@/schema/organization'
import { redirect } from 'next/navigation'
import { Stripe } from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '')

const requiredPermissions = constructRequiredPermissions([
	updateOrganizationOrganization,
])

export async function instantiateBillingSettings() {
	const { permitted, user } = await checkUserPermissions({
		additionalSelect: {
			organization: {
				select: { stripeCustomerId: true, billingAddresses: true },
			},
		},
		requiredPermissions,
	})

	if (!permitted || !user) {
		return null
	}

	const stripeCustomerId = user.organization?.stripeCustomerId
	const billingAddresses: Array<Address> = user.organization?.billingAddresses

	if (!stripeCustomerId) {
		return null
	}

	const [setupIntent, plans, subscription, cards] = await Promise.all([
		await createSetupIntent(stripeCustomerId),
		await readPlans(),
		await getCurrentPlan(stripeCustomerId),
		await readCards(stripeCustomerId),
	])

	return {
		setupIntent,
		plans,
		subscription,
		cards,
		billingAddresses,
	}
}

export async function createSetupIntent(customerId: string) {
	return await stripe.setupIntents.create({
		usage: 'off_session',
		customer: customerId,
	})
}

export async function readPlans() {
	const products = await stripe.products.list({
		active: true,
	})
	const priceIds = products.data.map(({ default_price }) => default_price)
	const pricesPromises = priceIds.map(
		async (id) => await stripe.prices.retrieve(id),
	)
	const prices = await Promise.all(pricesPromises)

	return products.data.map(({ name, default_price }) => {
		const price = prices.find(({ id }) => id === default_price)

		if (!price) {
			return { name }
		}

		const { unit_amount_decimal, recurring, id } = price

		return {
			name,
			default_price: {
				id,
				unit_amount_decimal,
				recurring: { interval: recurring?.interval },
			},
		}
	})
}

export async function verifyPromoCode(code: string) {
	return await stripe.promotionCodes.list({
		code,
		active: true,
	})
}

export async function addCard(customerId: string, source: string) {
	return await stripe.customers.createSource(customerId, {
		source,
	})
}

export async function readCards(customerId: string) {
	const cards = await stripe.customers.listPaymentMethods(customerId, {
		type: 'card',
	})
	return cards.data.map(({ id, card }) => ({
		id,
		brand: card!.brand,
		exp_month: card!.exp_month,
		exp_year: card!.exp_year,
		last4: card!.last4,
	}))
}

export async function removeCard(id: string) {
	return await stripe.paymentMethods.detach(id)
}

export async function readInvoices(customerId: string) {
	const invoices = await stripe.invoices.list({
		customer: customerId,
	})

	return invoices.data.map(
		({
			id,
			invoice_pdf,
			amount_paid,
			description,
			period_start,
			period_end,
			status,
		}) => ({
			id,
			invoice_pdf,
			amount_paid,
			description,
			period_start,
			period_end,
			status,
		}),
	)
}

export async function startSubscription({
	priceId,
	paymentMethodId,
	promoCode,
}: {
	priceId?: string
	paymentMethodId?: string
	promoCode?: string
}) {
	const { permitted, user } = await checkUserPermissions({
		additionalSelect: {
			organization: {
				select: { stripeCustomerId: true, billingAddresses: true },
			},
		},
		requiredPermissions,
	})

	if (!permitted || !user) {
		return {
			errors: {
				root: {
					message: 'You are not allowed to modify the subscription',
				},
			},
		}
	}

	const customerId = user.organization?.stripeCustomerId

	if (!customerId) {
		return redirect('/logout')
	}

	await stripe.subscriptions.create({
		customer: customerId,
		items: [
			{
				discounts: [
					{
						promotion_code: promoCode,
					},
				],
				price: priceId,
			},
		],
		default_payment_method: paymentMethodId,
	})

	return
}

export async function changeSubscription({
	subscriptionId,
	subscriptionItemId,
	priceId,
	paymentMethodId,
	promoCode,
}: {
	subscriptionId: string
	subscriptionItemId: string
	priceId?: string
	paymentMethodId?: string
	promoCode?: string
}) {
	const { permitted, user } = await checkUserPermissions({
		requiredPermissions,
	})

	if (!permitted || !user) {
		return {
			errors: {
				root: {
					message: 'You are not allowed to modify the subscription',
				},
			},
		}
	}

	if (priceId || promoCode) {
		try {
			await stripe.subscriptionItems.update(subscriptionItemId, {
				price: priceId,
				discounts: [
					{
						promotion_code: promoCode,
					},
				],
			})
		} catch (err) {
			console.error(err)
		}
	}

	if (paymentMethodId) {
		await stripe.subscriptions.update(subscriptionId, {
			default_payment_method: paymentMethodId,
		})
	}

	return
}

export async function getCurrentPlan(customerId: string) {
	const subscriptionList = await stripe.subscriptions.list({
		limit: 1,
		customer: customerId,
	})

	if (subscriptionList.has_more) {
		// there shouldn't be more. Log it
		console.error(
			'There is a user with more than one subscription: ',
			customerId,
		)
	}

	const subscription = subscriptionList.data.at(0)

	if (!subscription) {
		return null
	}

	const { id, items } = subscription
	const subscriptionItem = items.data.at(0)
	const plan = subscriptionItem?.plan

	if (items.data.length > 1) {
		// there shouldn't be more. Log it
		console.error(
			'There is a user with more than one item on their plan: ',
			customerId,
		)
	}

	if (!plan || !subscriptionItem) {
		return {
			errors: {
				root: {
					message: 'There was an error',
				},
			},
		}
	}

	return { id, subscriptionItemId: subscriptionItem.id, planId: plan.id }
}

export async function cancelSubscription({
	subscriptionId,
}: CancelSubscriptionFormProps) {
	try {
		await stripe.subscriptions.cancel(subscriptionId)

		return
	} catch (err) {
		console.error(err)

		return {
			errors: {
				root: {
					message: 'Something went wrong',
				},
			},
		}
	}
}