import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DeviceChartProps {
	modalType: any;
}

export function DeviceChart({ modalType }: DeviceChartProps) {
	const [dynamicData, setDynamicData] = useState([...modalType.data]);

	useEffect(() => {
		const interval = setInterval(() => {
			const currentTime = new Date();

			const newDataPoint = {
				time: currentTime.getHours() + ':' + currentTime.getMinutes()  + ':' +  currentTime.getSeconds(),
				value: Math.floor(Math.random() * 20) + 150
			};
			setDynamicData(prevData => [...prevData, newDataPoint]);
		}, 4000);

		return () => clearInterval(interval);
	}, [dynamicData]);

	return (
		<div className="space-y-4">
			<h4 className="text-lg font-medium">{modalType.title} - Показатели за 24 часа</h4>
			<div className="h-[400px] w-full">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={dynamicData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="time" />
						<YAxis />
						<Tooltip />
						<Line
							type="monotone"
							dataKey="value"
							stroke="#3b82f6"
							strokeWidth={2}
							dot={{ fill: '#3b82f6' }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
