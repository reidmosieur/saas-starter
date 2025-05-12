'use client'

import { Organization } from '@/generated/prisma'
import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useState,
} from 'react'

interface OrganizationContext {
	organization: Partial<Organization> | null
	setOrganization: Dispatch<SetStateAction<Partial<Organization> | null>>
}

export const OrganizationContext = createContext<OrganizationContext | null>(
	null,
)

export function OrganizationContextProvider({
	defaultValues,
	children,
}: {
	defaultValues: Partial<Organization>
	children?: ReactNode
}) {
	const [organization, setOrganization] =
		useState<Partial<Organization> | null>(defaultValues)
	return (
		<OrganizationContext value={{ organization, setOrganization }}>
			{children}
		</OrganizationContext>
	)
}

export function useOrganization() {
	const context = useContext(OrganizationContext)
	if (context === null) {
		throw new Error('useOrganization must be used within a SidebarProvider')
	}
	return context
}
