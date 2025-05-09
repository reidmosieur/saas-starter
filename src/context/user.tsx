'use client'

import { User } from '@/generated/prisma'
import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useState,
} from 'react'

interface UserContext {
	user: Partial<User> | null
	setUser: Dispatch<SetStateAction<Partial<User> | null>>
}

export const UserContext = createContext<UserContext | null>(null)

export function UserContextProvider({
	defaultValues,
	children,
}: {
	defaultValues: Partial<User>
	children?: ReactNode
}) {
	const [user, setUser] = useState<Partial<User> | null>(defaultValues)
	return <UserContext value={{ user, setUser }}>{children}</UserContext>
}

export function useUser() {
	const context = useContext(UserContext)
	if (context === null) {
		throw new Error('useUser must be used within a SidebarProvider')
	}
	return context
}
