import { cn } from '@/lib/utils'
import { Dispatch, SetStateAction } from 'react'

export function SwitchButton({
	switched,
	setSwitched,
	labelOne,
	labelTwo,
}: {
	switched: boolean
	setSwitched: Dispatch<SetStateAction<boolean>>
	labelOne: string
	labelTwo: string
}) {
	return (
		<div className="bg-muted flex h-fit w-fit gap-1 rounded-md p-2">
			<button
				className={cn(
					'text-muted-foreground rounded-md px-2 py-1',
					!switched && 'bg-background text-foreground',
				)}
				onClick={() => setSwitched((prev) => !prev)}
			>
				{labelOne}
			</button>
			<button
				className={cn(
					'text-muted-foreground rounded-md px-2 py-1',
					switched && 'bg-background text-foreground',
				)}
				onClick={() => setSwitched((prev) => !prev)}
			>
				{labelTwo}
			</button>
		</div>
	)
}
