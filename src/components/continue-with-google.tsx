import { baseUrl, googleRedirectRoute } from '@/constants/routes'
import { Fragment } from 'react'

const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID

export function ContinueWithGoogle() {
	return (
		<Fragment>
			<div
				id="g_id_onload"
				data-client_id={clientId}
				data-context="signin"
				data-ux_mode="popup"
				data-login_uri={baseUrl + googleRedirectRoute}
				data-auto_prompt="false"
			></div>
			<div
				className="g_id_signin"
				data-type="standard"
				data-shape="rectangular"
				data-theme="outline"
				data-text="continue_with"
				data-size="large"
				data-logo_alignment="left"
			></div>
		</Fragment>
	)
}
