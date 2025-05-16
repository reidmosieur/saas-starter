import { Info } from 'lucide-react'
import {
	Tooltip,
	TooltipProvider,
	TooltipTrigger,
	TooltipContent,
} from './ui/tooltip'
import { stringConcatenator } from '@/lib/utils'

export function StripeMissing({
	additionalAlert,
}: {
	additionalAlert?: string
}) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>
					<Info className="text-orange-700 dark:text-orange-400" />
				</TooltipTrigger>
				<TooltipContent>
					<p>
						{stringConcatenator(
							[
								`Stripe API information is missing. You'll need to add it to use this.`,
								additionalAlert,
							],
							' ',
						)}
					</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
