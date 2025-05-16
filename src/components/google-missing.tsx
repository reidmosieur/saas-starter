import { Info } from 'lucide-react'
import {
	Tooltip,
	TooltipProvider,
	TooltipTrigger,
	TooltipContent,
} from './ui/tooltip'
import { stringConcatenator } from '@/lib/utils'

export function GoogleMissing({
	additionalAlert,
}: {
	additionalAlert?: string
}) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger className="inline-flex justify-center">
					<Info className="text-orange-700 dark:text-orange-400" />
				</TooltipTrigger>
				<TooltipContent>
					<p>
						{stringConcatenator(
							[
								`Google API information is missing. You'll need to add it to use this.`,
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
