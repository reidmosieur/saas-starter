'use client'

import { baseUrl, googleRedirectRoute } from '@/constants/routes'
import { useTheme } from 'next-themes'
import ClientComponent, { ClientComponentProps } from './client-component'
import { Skeleton } from './ui/skeleton'
import Script from 'next/script'
import { ComponentProps } from 'react'
import { cn } from '@/lib/utils'
import { GoogleMissing } from './google-missing'

const clientId = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID

export function ContinueWithGoogle({
	clientComponentProps = {
		fallback: <Skeleton className="h-10 w-full" />,
	},
	googleButtonProps,
}: {
	clientComponentProps?: ClientComponentProps
	googleButtonProps?: GoogleButtonProps
}) {
	if (!clientId) {
		return <GoogleMissing />
	}

	return (
		<ClientComponent {...clientComponentProps}>
			<Script src="https://accounts.google.com/gsi/client" async />
			<GoogleButton {...googleButtonProps} />
		</ClientComponent>
	)
}

interface GoogleButtonProps extends ComponentProps<'div'> {
	type?: 'standard' | 'icon'
	shape?: 'rectangular' | 'square'
	loginUri?: string
}

function GoogleButton({
	type = 'standard',
	shape = 'rectangular',
	loginUri = baseUrl + googleRedirectRoute,
	...props
}: GoogleButtonProps) {
	const { resolvedTheme } = useTheme()
	const dataTheme = resolvedTheme === 'dark' ? 'filled_black' : 'outline'
	return (
		<div {...props} className={cn('h-10', props.className)}>
			<div
				id="g_id_onload"
				data-client_id={clientId}
				data-context="signin"
				data-ux_mode="popup"
				data-login_uri={loginUri}
				data-auto_prompt="false"
			></div>
			<div
				className="g_id_signin"
				data-type={type}
				data-shape={shape}
				data-theme={dataTheme}
				data-text="continue_with"
				data-size="large"
				data-logo_alignment="left"
			></div>
		</div>
	)
}
