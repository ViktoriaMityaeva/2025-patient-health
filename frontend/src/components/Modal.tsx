import React from 'react';
import { X } from 'lucide-react';
import { Theme } from '@theme/Theme.model';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  theme: Theme;
}

export function Modal({ isOpen, onClose, children, title, theme }: ModalProps) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center" >
			<div className="fixed inset-0 bg-black/50" onClick={onClose} />
			<div className="relative z-50 w-full max-w-2xl rounded-lg shadow-xl" style={{ background: theme['--background'] }}>
				<div className="flex items-center justify-between p-4">
					<h3 className="text-xl font-semibold" style={{ color: theme['--text'] }}>{title}</h3>
					<button
						onClick={onClose}
						className="p-1 hover:bg-gray-100 rounded-full transition-colors"
					>
						<X className="w-5 h-5" style={{ color: theme['--text'] }}/>
					</button>
				</div>
				<div className="p-6" style={{ color: theme['--text'] }}>{children}</div>
			</div>
		</div>
	);
}
