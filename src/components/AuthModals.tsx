import React, { useState } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Typography,
	Box,
	IconButton,
	InputAdornment,
	Alert,
	Divider,
	CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, Close } from '@mui/icons-material';
import { auth } from '../services/firebase';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithPopup,
} from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';

interface AuthModalsProps {
	open: boolean;
	onClose: () => void;
	mode: 'login' | 'register';
	onModeChange?: (mode: 'login' | 'register') => void;
}

const AuthModals: React.FC<AuthModalsProps> = ({ open, onClose, mode, onModeChange }) => {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [googleLoading, setGoogleLoading] = useState(false);

	const handleSuccessfulAuth = () => {
		// Close modal and navigate immediately
		onClose();
		navigate('/dashboard');
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		try {
			if (mode === 'register') {
				await createUserWithEmailAndPassword(auth, email, password);
			} else {
				await signInWithEmailAndPassword(auth, email, password);
			}
			handleSuccessfulAuth();
			// Reset form
			setEmail('');
			setPassword('');
		} catch (error: any) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleSignIn = async () => {
		setError('');
		setGoogleLoading(true);

		try {
			const provider = new GoogleAuthProvider();
			await signInWithPopup(auth, provider);
			handleSuccessfulAuth();
		} catch (error: any) {
			setError(error.message);
		} finally {
			setGoogleLoading(false);
		}
	};

	const handleClose = () => {
		setEmail('');
		setPassword('');
		setError('');
		setShowPassword(false);
		onClose();
	};

	const handleModeToggle = () => {
		const newMode = mode === 'login' ? 'register' : 'login';
		onModeChange?.(newMode);
		setError('');
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			maxWidth="sm"
			fullWidth
			PaperProps={{
				style: {
					borderRadius: '16px',
					background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
				},
			}}
		>
			<DialogTitle
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					pb: 1,
				}}
			>
				<Typography variant="h5" component="span" fontWeight="600">
					{mode === 'login' ? 'Welcome Back' : 'Create Account'}
				</Typography>
				<IconButton onClick={handleClose} size="small">
					<Close />
				</IconButton>
			</DialogTitle>

			<DialogContent>
				<Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
					{error && (
						<Alert severity="error" sx={{ mb: 2 }}>
							{error}
						</Alert>
					)}

					{/* Google Sign In Button */}
					<Button
						fullWidth
						variant="outlined"
						onClick={handleGoogleSignIn}
						disabled={googleLoading || loading}
						startIcon={
							googleLoading ? <CircularProgress size={20} /> : <FcGoogle size={20} />
						}
						sx={{
							py: 1.5,
							mb: 2,
							borderRadius: '12px',
							borderColor: '#e2e8f0',
							color: '#374151',
							textTransform: 'none',
							fontSize: '1rem',
							fontWeight: '600',
							'&:hover': {
								borderColor: '#6366f1',
								backgroundColor: '#f8fafc',
							},
						}}
					>
						{googleLoading ? 'Signing in...' : 'Continue with Google'}
					</Button>

					<Divider sx={{ my: 2 }}>
						<Typography variant="body2" color="text.secondary">
							or continue with email
						</Typography>
					</Divider>

					<TextField
						margin="normal"
						required
						fullWidth
						id="email"
						label="Email Address"
						name="email"
						autoComplete="email"
						autoFocus
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						disabled={loading || googleLoading}
						sx={{
							'& .MuiOutlinedInput-root': {
								borderRadius: '12px',
							},
						}}
					/>

					<TextField
						margin="normal"
						required
						fullWidth
						name="password"
						label="Password"
						type={showPassword ? 'text' : 'password'}
						id="password"
						autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						disabled={loading || googleLoading}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={() => setShowPassword(!showPassword)}
										edge="end"
										disabled={loading || googleLoading}
									>
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						}}
						sx={{
							'& .MuiOutlinedInput-root': {
								borderRadius: '12px',
							},
						}}
					/>

					<DialogActions sx={{ px: 0, pt: 2 }}>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							disabled={loading || googleLoading}
							startIcon={loading ? <CircularProgress size={20} /> : null}
							sx={{
								py: 1.5,
								borderRadius: '12px',
								background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
								textTransform: 'none',
								fontSize: '1rem',
								fontWeight: '600',
								'&:hover': {
									background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
								},
							}}
						>
							{loading
								? 'Signing in...'
								: mode === 'login'
									? 'Sign In'
									: 'Create Account'}
						</Button>
					</DialogActions>

					<Box sx={{ textAlign: 'center', mt: 2 }}>
						<Typography variant="body2" color="text.secondary">
							{mode === 'login'
								? "Don't have an account? "
								: 'Already have an account? '}
							<Button
								onClick={handleModeToggle}
								disabled={loading || googleLoading}
								sx={{
									textTransform: 'none',
									color: '#6366f1',
									fontWeight: '600',
									'&:hover': {
										color: '#4f46e5',
									},
								}}
							>
								{mode === 'login' ? 'Sign up' : 'Sign in'}
							</Button>
						</Typography>
					</Box>
				</Box>
			</DialogContent>
		</Dialog>
	);
};

export default AuthModals;
