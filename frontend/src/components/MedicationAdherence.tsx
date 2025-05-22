import React from 'react';
import { Check, X, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Theme } from '@theme/Theme.model';

interface MedicationAdherenceProps {
  medications: any[];
  theme: Theme;
}

export const MedicationAdherence: React.FC<MedicationAdherenceProps> = ({ medications, theme }) => {
	return (
		<div className="rounded-lg shadow-md p-6" style={{ background: theme['--card'], color: theme['--text'] }}>
			<h2 className="text-xl font-semibold mb-4">Активность пациентов</h2>
			<div className="space-y-6">
				{medications.map((medication) => (
					<div key={medication.id} className="pb-4 last:border-b-0 last:pb-0">
						<div className="w-max justify-between items-start mb-3">
							<div>
								<h3 className="font-semibold text-lg">{medication.name}</h3>
							</div>
						</div>
						<div className="space-y-2">
							{medication.timesTaken.map((dose: any) => {
								const formattedDate = format(parseISO(dose.date), 'd MMMM', { locale: ru });
								return (
									<div
										key={`${dose.date}-${dose.scheduledTime}`}
										className="flex items-center gap-3 text-sm"
									>
										{dose.taken ? (
											<div className="bg-green-100 p-1 rounded-full">
												<Check className="w-4 h-4 text-green-600" />
											</div>
										) : (
											<div className="bg-red-100 p-1 rounded-full">
												<X className="w-4 h-4 text-red-600" />
											</div>
										)}
										<span className="w-32">{formattedDate}</span>
										<Clock className="w-4 h-4" />
										<span>
                                            План: {dose.scheduledTime}
										</span>
										{dose.actualTime && (
											<>
												<span>•</span>
												<span>
                                                    Факт: {dose.actualTime}
												</span>
											</>
										)}
									</div>
								);
							})}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
