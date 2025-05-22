import React from 'react';
import { format } from 'date-fns';
import { Check, CircleX, Clock } from 'lucide-react';
import type { Theme } from '@theme/Theme.model';
import type { Medication } from '@store/mainState/interface';

interface Props {
	medications: Medication[];
	theme: Theme;
}

export const MedicationHistory: React.FC<Props> = ({ medications, theme }) => {
	console.log(medications);


	return (
		<div
			className="rounded-xl shadow-md p-6"
			style={{ background: theme['--card'] }}
		>
			<h3
				className="text-lg font-semibold mb-4"
				style={{ color: theme['--text'] }}
			>
				История приёма
			</h3>
			<div className="space-y-3">
				{medications.map(medication => (
					<div key={medication.uid}>
						<div className="space-y-2 flex flex-col gap-2">
							{medication.logs?.map((log) => {
								if (new Date(log.date) > new Date()) return;

								return (
									<div
										key={log.uid} className="flex items-center justify-between p-3 rounded-xl"
										style={{ background: theme['--background'] }}>
										<div className="flex items-center space-x-3">
											<div className="p-2 rounded-full" style={{ background: theme['--button'] }}>
												{log.taken
													? <Check className="w-4 h-4" style={{ color: theme['--white'] }}/>
													: <CircleX className="w-4 h-4" style={{ color: theme['--white'] }} />
												}
											</div>
											<div>
												<p className="font-medium" style={{ color: theme['--text'] }}>
													{medication.name}
												</p>
												<div
													className="flex items-center text-sm"
													style={{ color: theme['--secondary'] }}>
													<Clock className="w-3 h-3 mr-1"/>
													{format(new Date(log.date), 'dd.MM.yyyy HH:mm')}
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				))}

				{medications.every(med => !med.logs || med.logs.length === 0) && (
					<p
						className="text-center py-4"
						style={{ color: theme['--secondary'] }}
					>
						История приёма пуста
					</p>
				)}
			</div>
		</div>
	);
};
