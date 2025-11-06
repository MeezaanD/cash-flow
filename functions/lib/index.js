'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.healthCheck = exports.getUserTransactions = void 0;
const functions = require('firebase-functions');
const admin = require('firebase-admin');
// Initialize Firebase Admin SDK
admin.initializeApp();
// Initialize Firestore
const db = admin.firestore();
// Helper function to verify JWT token
async function verifyToken(authHeader) {
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
// Helper function to set CORS headers
function setCorsHeaders(res) {
	res.set('Access-Control-Allow-Origin', '*');
	res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}
// Main API function to get user transactions
exports.getUserTransactions = functions.https.onRequest(async (req, res) => {
	// Handle CORS preflight requests
	if (req.method === 'OPTIONS') {
		setCorsHeaders(res);
		res.status(204).send('');
		return;
	}
	// Set CORS headers for all responses
	setCorsHeaders(res);
	// Only allow GET requests
	if (req.method !== 'GET') {
		res.status(405).json({
			success: false,
			error: 'Method not allowed. Only GET requests are supported.',
		});
		return;
	}
	try {
		// Verify JWT token
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			res.status(401).json({
				success: false,
				error: 'Authorization header is required',
			});
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
		const transactions = [];
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
		res.status(200).json({
			success: true,
			data: transactions,
			message: `Successfully retrieved ${transactions.length} transactions`,
		});
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
		res.status(statusCode).json({
			success: false,
			error: errorMessage,
		});
	}
});
// Health check endpoint
exports.healthCheck = functions.https.onRequest((req, res) => {
	setCorsHeaders(res);
	res.json({
		success: true,
		message: 'API is running',
		timestamp: new Date().toISOString(),
	});
});
//# sourceMappingURL=index.js.map
