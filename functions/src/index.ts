import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();

// Interface for transaction data
interface Transaction {
	id: string;
	userId: string;
	amount: number;
	description: string;
	category: string;
	type: 'income' | 'expense';
	date: string;
	createdAt: string;
	updatedAt: string;
}

// Interface for API response
interface ApiResponse {
	success: boolean;
	data?: Transaction[];
	error?: string;
	message?: string;
}

// Helper function to verify JWT token
async function verifyToken(authHeader: string): Promise<admin.auth.DecodedIdToken> {
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		throw new Error('Missing or invalid Authorization header');
	}

	const token = authHeader.split('Bearer ')[1];

	try {
		const decodedToken = await admin.auth().verifyIdToken(token);
		return decodedToken;
	} catch (error) {
		throw new Error('Invalid or expired token');
	}
}

// Helper function to create API response
function createResponse(statusCode: number, body: ApiResponse): any {
	return {
		statusCode,
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization',
		},
		body: JSON.stringify(body),
	};
}

// Main API function to get user transactions
export const getUserTransactions = functions.https.onRequest(async (req, res) => {
	// Handle CORS preflight requests
	if (req.method === 'OPTIONS') {
		res.set('Access-Control-Allow-Origin', '*');
		res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
		res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
		res.status(204).send('');
		return;
	}

	// Only allow GET requests
	if (req.method !== 'GET') {
		const response = createResponse(405, {
			success: false,
			error: 'Method not allowed. Only GET requests are supported.',
		});
		res.status(response.statusCode).send(response.body);
		return;
	}

	try {
		// Verify JWT token
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			const response = createResponse(401, {
				success: false,
				error: 'Authorization header is required',
			});
			res.status(response.statusCode).send(response.body);
			return;
		}

		const decodedToken = await verifyToken(authHeader);
		const userId = decodedToken.uid;

		// Query Firestore for user's transactions
		const transactionsRef = db.collection('transactions');
		const snapshot = await transactionsRef
			.where('userId', '==', userId)
			.orderBy('date', 'desc')
			.get();

		const transactions: Transaction[] = [];
		snapshot.forEach((doc) => {
			const data = doc.data();
			transactions.push({
				id: doc.id,
				userId: data.userId,
				amount: data.amount,
				description: data.description,
				category: data.category,
				type: data.type,
				date: data.date,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			});
		});

		// Return successful response
		const response = createResponse(200, {
			success: true,
			data: transactions,
			message: `Successfully retrieved ${transactions.length} transactions`,
		});
		res.status(response.statusCode).send(response.body);
	} catch (error) {
		console.error('Error in getUserTransactions:', error);

		let statusCode = 500;
		let errorMessage = 'Internal server error';

		if (error instanceof Error) {
			if (
				error.message.includes('Authorization header') ||
				error.message.includes('Bearer')
			) {
				statusCode = 401;
				errorMessage = 'Invalid Authorization header format';
			} else if (error.message.includes('Invalid or expired token')) {
				statusCode = 401;
				errorMessage = 'Invalid or expired token';
			} else if (error.message.includes('Missing or invalid')) {
				statusCode = 401;
				errorMessage = 'Missing or invalid Authorization header';
			}
		}

		const response = createResponse(statusCode, {
			success: false,
			error: errorMessage,
		});
		res.status(response.statusCode).send(response.body);
	}
});

// Health check endpoint
export const healthCheck = functions.https.onRequest((req, res) => {
	res.set('Access-Control-Allow-Origin', '*');
	res.json({
		success: true,
		message: 'API is running',
		timestamp: new Date().toISOString(),
	});
});
