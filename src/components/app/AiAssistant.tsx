import React, { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiX, FiSend } from 'react-icons/fi';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { apiService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

interface Message {
	role: 'user' | 'assistant';
	text: string;
}

const SUGGESTIONS = [
	'What did I spend the most on this month?',
	'Show me my recent income transactions',
	'What is my current account balance?',
	'How much have I spent on food?',
];

const AiAssistant: React.FC = () => {
	const { currentUser } = useAuth();
	const [open, setOpen] = useState(false);
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// Scroll to latest message
	useEffect(() => {
		if (open) {
			messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages, open]);

	// Focus input when chat opens
	useEffect(() => {
		if (open) {
			setTimeout(() => inputRef.current?.focus(), 100);
		}
	}, [open]);

	const sendMessage = async (question: string) => {
		const trimmed = question.trim();
		if (!trimmed || loading) return;

		setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
		setInput('');
		setLoading(true);
		setError(null);

		try {
			const answer = await apiService.askAI(trimmed);
			setMessages((prev) => [...prev, { role: 'assistant', text: answer }]);
		} catch (err: any) {
			setError(err.message || 'Something went wrong. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		sendMessage(input);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage(input);
		}
	};

	if (!currentUser) return null;

	return (
		<>
			{/* Floating button */}
			<button
				onClick={() => setOpen((prev) => !prev)}
				className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
				aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
			>
				{open ? <FiX className="h-5 w-5" /> : <FiMessageSquare className="h-5 w-5" />}
			</button>

			{/* Chat panel */}
			{open && (
				<div
					className="fixed bottom-20 right-6 z-50 flex w-80 sm:w-96 flex-col rounded-2xl border bg-card shadow-2xl overflow-hidden"
					style={{ maxHeight: '75vh' }}
				>
					{/* Header */}
					<div className="flex items-center justify-between border-b bg-primary px-4 py-3">
						<div className="flex items-center gap-2">
							<FiMessageSquare className="h-4 w-4 text-primary-foreground" />
							<span className="font-semibold text-sm text-primary-foreground">
								AI Assistant
							</span>
						</div>
						<button
							onClick={() => setOpen(false)}
							className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
							aria-label="Close"
						>
							<FiX className="h-4 w-4" />
						</button>
					</div>

					{/* Messages area */}
					<div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: '200px' }}>
						{messages.length === 0 && (
							<div className="space-y-3">
								<p className="text-sm text-muted-foreground text-center">
									Ask me anything about your finances!
								</p>
								<div className="space-y-2">
									{SUGGESTIONS.map((s) => (
										<button
											key={s}
											onClick={() => sendMessage(s)}
											className="w-full text-left text-xs rounded-lg border px-3 py-2 bg-background hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
										>
											{s}
										</button>
									))}
								</div>
							</div>
						)}

						{messages.map((msg, i) => (
							<div
								key={i}
								className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
							>
								<div
									className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
										msg.role === 'user'
											? 'bg-primary text-primary-foreground rounded-br-sm'
											: 'bg-muted text-foreground rounded-bl-sm'
									}`}
								>
									{msg.text}
								</div>
							</div>
						))}

						{loading && (
							<div className="flex justify-start">
								<div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-2">
									<span className="flex gap-1 items-center">
										<span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
										<span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
										<span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
									</span>
								</div>
							</div>
						)}

						{error && (
							<div className="text-xs text-destructive text-center px-2">
								{error}
							</div>
						)}

						<div ref={messagesEndRef} />
					</div>

					{/* Input area */}
					<form
						onSubmit={handleSubmit}
						className="flex items-center gap-2 border-t p-3 bg-background"
					>
						<Input
							ref={inputRef}
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="Ask about your finances..."
							className="flex-1 text-sm h-9"
							disabled={loading}
							autoComplete="off"
						/>
						<Button
							type="submit"
							size="icon"
							className="h-9 w-9 flex-shrink-0"
							disabled={loading || !input.trim()}
							aria-label="Send"
						>
							<FiSend className="h-4 w-4" />
						</Button>
					</form>
				</div>
			)}
		</>
	);
};

export default AiAssistant;
