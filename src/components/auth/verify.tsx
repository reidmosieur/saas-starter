import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from '@/components/ui/input-otp'
import { cn } from '@/lib/utils'

import { Label } from '@/components/ui/label'
import Link from 'next/link'

export function Verify({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Check your email</CardTitle>
					<CardDescription>
						We sent you a code. Please enter it below
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form>
						<div className="grid gap-6">
							<div className="grid gap-6">
								<div className="grid gap-3">
									<Label htmlFor="email">Code</Label>
									<InputOTP maxLength={6} className="w-full">
										<InputOTPGroup className="w-full">
											{Array.from({ length: 6 }).map((_, index) => (
												<InputOTPSlot
													className="w-full"
													key={index}
													index={index}
												/>
											))}
										</InputOTPGroup>
									</InputOTP>
								</div>
								<Button type="submit" className="w-full">
									Reset Password
								</Button>
							</div>
							<div className="text-center text-sm">
								Don&apos;t have an account?{' '}
								<Link href="/signup" className="underline underline-offset-4">
									Sign up
								</Link>
							</div>
						</div>
					</form>
				</CardContent>
			</Card>
			<div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
				By continuing, you agree to our{' '}
				<Link href="/terms">Terms of Service</Link> and{' '}
				<Link href="/privacy">Privacy Policy</Link>.
			</div>
		</div>
	)
}
