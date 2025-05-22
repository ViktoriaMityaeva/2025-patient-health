import React from 'react';
import { VitalSignChart, VitalSignChart2 } from '@store/mainState/interface';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Theme } from '@theme/Theme.model';

interface VitalSignsChartProps {
  data: VitalSignChart[] | VitalSignChart2[];
  theme: Theme;
}

export const VitalSignsChart: React.FC<VitalSignsChartProps> = ({ data, theme }) => {
	const formatDate = (dateStr: string) => {
		return format(parseISO(dateStr), 'dd MMM', { locale: ru });
	};

	return (
		<div className="rounded-lg shadow-md p-6 mb-6" style={{ background: theme['--card'], color: theme['--text'] }}>
			<h2 className="text-xl font-semibold mb-4">Динамика показателей</h2>
			<div className="h-[400px]">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="date" tickFormatter={formatDate} />
						<YAxis yAxisId="left" />
						<YAxis yAxisId="right" orientation="right" />
						<Tooltip
							labelFormatter={formatDate}
							formatter={(value: number, name: string) => {
								switch (name) {
								case 'Систолическое':
								case 'Диастолическое':
									return [`${value} мм рт.ст.`, name];
								case 'Пульс':
									return [`${value} уд/мин`, name];
								case 'Глюкоза':
									return [`${value} ммоль/л`, name];
								default:
									return [value, name];
								}
							}}
						/>
						<Legend />
						<Line
							yAxisId="left"
							type="monotone"
							dataKey="usersCount"
							name="Активные пациенты"
							stroke="#ef4444"
							dot={false}
						/>
						<Line
							yAxisId="left"
							type="monotone"
							dataKey="criticalUsersCount"
							name="Критические показатели"
							stroke="#f97316"
							dot={false}
						/>
						{/*<Line*/}
						{/*	yAxisId="right"*/}
						{/*	type="monotone"*/}
						{/*	dataKey="glucoseLevel"*/}
						{/*	name="Глюкоза"*/}
						{/*	stroke="#10b981"*/}
						{/*	dot={false}*/}
						{/*/>*/}
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};
