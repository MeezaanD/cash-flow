import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { TransactionsProvider } from './context/TransactionsContext';
import ProtectedRoute from './components/app/ProtectedRoute';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

function App() {
	return (
		<ThemeProvider>
			<TransactionsProvider>
				<Router>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route
							path="/dashboard"
							element={
								<ProtectedRoute>
									<Dashboard />
								</ProtectedRoute>
							}
						/>
					</Routes>
				</Router>
			</TransactionsProvider>
		</ThemeProvider>
	);
}

export default App;
