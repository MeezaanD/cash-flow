import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { TransactionsProvider } from './context/TransactionsContext';
import { AccountsProvider } from './context/AccountsContext';
import { BudgetsProvider } from './context/BudgetsContext';
import { FilterPreferencesProvider } from './context/FilterPreferencesContext';
import ProtectedRoute from './components/app/ProtectedRoute';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AccountDetailPage from './pages/AccountDetail';

function App() {
	return (
		<ThemeProvider>
			<FilterPreferencesProvider>
			<TransactionsProvider>
				<AccountsProvider>
					<BudgetsProvider>
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
								<Route
									path="/accounts/:accountId"
									element={
										<ProtectedRoute>
											<AccountDetailPage />
										</ProtectedRoute>
									}
								/>
							</Routes>
						</Router>
					</BudgetsProvider>
				</AccountsProvider>
			</TransactionsProvider>
			</FilterPreferencesProvider>
		</ThemeProvider>
	);
}

export default App;
