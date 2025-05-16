import { ChartAreaInteractive } from '@/components/dashboard-demo/chart-area-interactive'
import { DataTable } from '@/components/dashboard-demo/data-table'
import { SectionCards } from '@/components/dashboard-demo/section-cards'
import data from '@/data/dashboard.json'

export default async function Home() {
	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-2">
				<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
					<SectionCards />
					<div className="px-4 lg:px-6">
						<ChartAreaInteractive />
					</div>
					<DataTable data={data} />
				</div>
			</div>
		</div>
	)
}
