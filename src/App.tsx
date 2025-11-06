import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { TransactionsProvider } from './context/TransactionsContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
	return (
		<ThemeProvider>
			<TransactionsProvider>
				<Router>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/dashboard" element={<Dashboard />} />
					</Routes>
				</Router>
			</TransactionsProvider>
		</ThemeProvider>
	);
}

export default App;
