'use server'
import { updateOrganizationOrganization } from '@/constants/permissions'
import { Address } from '@/generated/prisma'
import { checkUserPermissions } from '@/lib/access-control'
import { constructRequiredPermissions } from '@/lib/utils'
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

	const [setupIntent, plans, cards] = await Promise.all([
		await createSetupIntent(stripeCustomerId),
		await readPlans(),
		await readCards(stripeCustomerId),
		await readInvoices(stripeCustomerId),
	])

	return {
		setupIntent,
		plans,
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

		const { unit_amount_decimal, recurring } = price

		return {
			name,
			default_price: {
				unit_amount_decimal,
				recurring: { interval: recurring?.interval },
			},
		}
	})
}

export async function checkForDiscount(code: string) {
	return await stripe.promotionCodes.list({
		code,
		active: true,
	})
}

export async function applyDiscount(code: string) {
	const { data } = await checkForDiscount(code)
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