import React, { useState } from 'react';
import { MessageCircle, X, Send, User, Check, CheckCheck } from 'lucide-react';
import { ChatMessage } from '@store/mainState/interface';
import type { Theme } from '@theme/Theme.model';
import mainState from '@store/mainState/mainState';
import { observer } from 'mobx-react-lite';

interface Props {
	theme: Theme;
	personName?: string;
	isDoctor: boolean;
}

export const Chat: React.FC<Props> = observer(({ theme, personName = 'Собеседник', isDoctor }) => {
	const { messages, setMessages } = mainState;

	const [isOpen, setIsOpen] = useState(false);
	const [newMessage, setNewMessage] = useState('');

	const handleSend = () => {
		if (!newMessage.trim()) return;

		const message: ChatMessage = {
			id: Date.now().toString(),
			sender: isDoctor ? 'doctor' : 'patient',
			message: newMessage.trim(),
			timestamp: new Date().toISOString(),
			read: false
		};

		setMessages(message);
		setNewMessage('');
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<>
			{!isOpen && (
				<button
					onClick={() => setIsOpen(true)}
					style={{ background: theme['--primary'] }}
					className="fixed bottom-6 right-6 text-white rounded-full p-4 shadow-lg transition-colors"
				>
					<MessageCircle className="w-6 h-6" />
				</button>
			)}

			{isOpen && (
				<div style={{ background: theme['--background'], border: `1px solid ${theme['--card']}` }} className="fixed bottom-6 right-6 w-96 rounded-lg shadow-xl flex flex-col">
					<div className="flex items-center justify-between p-4 border-b" style={{ borderColor: theme['--secondary'] }}>
						<div className="flex items-center gap-2">
							<User className="w-5 h-5" style={{ color: theme['--secondary'] }} />
							<h3 className="font-semibold" style={{ color: theme['--text'] }}>{personName}</h3>
						</div>
						<button
							onClick={() => setIsOpen(false)}
							style={{ color: theme['--text'] }}
						>
							<X className="w-5 h-5" />
						</button>
					</div>

					<div className="p-4 space-y-4 h-96 overflow-y-auto max-h-300">
						{messages.map((msg) => (
							<div
								key={msg.id}
								className={`flex ${
									(isDoctor ? msg.sender === 'doctor' : msg.sender === 'patient') ? 'justify-end' : 'justify-start'
								}`}
							>
								<div
									className={`max-w-[80%] rounded-lg p-3 ${
										(isDoctor ? msg.sender === 'doctor' : msg.sender === 'patient') ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
									}`}
								>
									<p className="text-sm">{msg.message}</p>
									<div className="flex items-center justify-end gap-1 mt-1">
										<span className="text-xs opacity-75">
											{new Date(msg.timestamp).toLocaleTimeString([], {
												hour: '2-digit',
												minute: '2-digit'
											})}
										</span>
										{msg.sender === 'patient' && (
											msg.read ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />
										)}
									</div>
								</div>
							</div>
						))}
					</div>

					<div className="p-4 border-t" style={{ borderColor: theme['--secondary'] }}>
						<div className="flex gap-2">
							<textarea
								value={newMessage}
								onChange={(e) => setNewMessage(e.target.value)}
								onKeyPress={handleKeyPress}
								placeholder="Введите сообщение..."
								className="flex-1 resize-none border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-32"
								style={{
									background: theme['--card'],
									color: theme['--text'],
									border: `1px solid ${theme['--secondary']}`,
								}}
								rows={1}
							/>
							<button
								onClick={handleSend}
								disabled={!newMessage.trim()}
								className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<Send className="w-5 h-5" />
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
});
