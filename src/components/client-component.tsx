import { Loader } from 'lucide-react'
import { ReactNode, useEffect, useState } from 'react'

export interface ClientComponentProps {
	children?: ReactNode
	fallback?: ReactNode
}

export default function ClientComponent({
	children,
	fallback = <Loader className="animate-spin" />,
}: ClientComponentProps) {
	const [client, setClient] = useState(false)

	useEffect(() => {
		setClient(true)
	}, [])

	if (!client) {
		return fallback
	}

	return children
}
