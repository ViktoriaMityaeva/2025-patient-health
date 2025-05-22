import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { apiPostAuthorize } from '@api/api';
import connectState from '@store/connectState/connectState';
import authorizeState from '@store/authorizeState/authorizeState';
import { UserServer } from '@store/authorizeState/interface';
import { useTheme } from '@theme/Theme.context';
import { useNavigate } from 'react-router-dom';

const schema = yup.object({
	email: yup
		.string()
		.required('Почта обязательна'),
	password: yup
		.string()
		.required('Пароль обязателен')
}).required();

type FormData = yup.InferType<typeof schema>;

const ConnectPage: FC = () => {
	const { theme } = useTheme();
	const { linkLogin } = connectState;

	const navigate = useNavigate();

	const [showPassword, setShowPassword] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({
		resolver: yupResolver(schema),
	});

	const onSubmit = async (data: FormData) => {
		apiPostAuthorize(linkLogin, data, {}).then(({ data, error }) => {
			const { isError } = error;
			if (isError) return;

			const { token, role } = data as UserServer;
			const { setAuthorize, setToken, setIsStaff } = authorizeState;

			const isStaff = role === 'doctor';
			setAuthorize(!!token.length);
			setToken(token);
			setIsStaff(isStaff);
			navigate(isStaff ? '/dashboard' : '/');
		});
	};

	return (
		<div className="min-h-screen bg-gradient-theme transition-all duration-700 flex items-center justify-center p-4">
			<div
				className="backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md"
				style={{ background: theme['--card'] }}
			>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md">
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-text">
							Почта
						</label>
						<div className="mt-1 relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Mail className="h-5 w-5 text-secondary"/>
							</div>
							<input
								{...register('email')}
								type="email"
								id="email"
								className="block w-full pl-10 pr-3 py-2 border border-secondary/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-card text-text"
								placeholder="you@example.com"
							/>
						</div>

						{errors.email && (
							<p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
						)}
					</div>

					<div>
						<label htmlFor="password" className="block text-sm font-medium text-text">
							Пароль
						</label>
						<div className="mt-1 relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Lock className="h-5 w-5 text-secondary"/>
							</div>
							<input
								{...register('password')}
								type={showPassword ? 'text' : 'password'}
								id="password"
								className="block w-full pl-10 pr-10 py-2 border border-secondary/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-card text-text"
								placeholder="••••••••"
							/>
							<button
								type="button"
								className="absolute inset-y-0 right-0 pr-3 flex items-center"
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? (
									<EyeOff className="h-5 w-5 text-secondary"/>
								) : (
									<Eye className="h-5 w-5 text-secondary"/>
								)}
							</button>
						</div>
						{errors.password && (
							<p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
						)}
					</div>

					<div className="flex items-center justify-between">
						<div className="text-sm">
							<a href="#" className="font-medium text-primary hover:text-primary/80" style={{ color: theme['--text'] }}>
								Восстановить пароль
							</a>
						</div>
					</div>

					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-button hover:bg-button/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSubmitting ? 'Вход...' : 'Войти'}
					</button>

					<p className="text-center text-sm text-text">
						<a href="#" style={{ color: theme['--text'] }} className="font-medium text-primary hover:text-primary/80">
							Войти через ЕСИА
						</a>
					</p>
				</form>
			</div>
		</div>
	);
};

export default ConnectPage;
