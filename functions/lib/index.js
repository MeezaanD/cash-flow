"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.askAI = exports.healthCheck = exports.getUserTransactions = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const generative_ai_1 = require("@google/generative-ai");
admin.initializeApp();
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
    }
    catch (error) {
        throw new Error('Invalid or expired token');
    }
}
// Helper function to create API response
function createResponse(statusCode, body) {
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
exports.getUserTransactions = functions.https.onRequest(async (req, res) => {
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
        const response = createResponse(200, {
            success: true,
            data: transactions,
            message: `Successfully retrieved ${transactions.length} transactions`,
        });
        res.status(response.statusCode).send(response.body);
    }
    catch (error) {
        console.error('Error in getUserTransactions:', error);
        let statusCode = 500;
        let errorMessage = 'Internal server error';
        if (error instanceof Error) {
            if (error.message.includes('Authorization header') ||
                error.message.includes('Bearer')) {
                statusCode = 401;
                errorMessage = 'Invalid Authorization header format';
            }
            else if (error.message.includes('Invalid or expired token')) {
                statusCode = 401;
                errorMessage = 'Invalid or expired token';
            }
            else if (error.message.includes('Missing or invalid')) {
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
exports.healthCheck = functions.https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString(),
    });
});
// Helper to convert Firestore Timestamp or string to a readable date string
function toDateString(value) {
    if (!value)
        return 'unknown date';
    if (value._seconds !== undefined) {
        return new Date(value._seconds * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }
    if (value instanceof Date) {
        return value.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }
    return String(value);
}
// AI Q&A endpoint using Google Gemini
exports.askAI = functions
    .runWith({ secrets: ['GEMINI_API_KEY'] })
    .https.onRequest(async (req, res) => {
    // Handle CORS preflight
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    if (req.method !== 'POST') {
        res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
        return;
    }
    try {
        // Verify auth token
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ success: false, error: 'Authorization header is required' });
            return;
        }
        const decodedToken = await verifyToken(authHeader);
        const userId = decodedToken.uid;
        // Extract question from request body
        const { question } = req.body;
        if (!question || typeof question !== 'string' || question.trim().length === 0) {
            res.status(400).json({ success: false, error: 'A question is required in the request body.' });
            return;
        }
        // Fetch user data from Firestore (transactions, accounts, budgets)
        const [txSnapshot, acctSnapshot, budgetSnapshot] = await Promise.all([
            db.collection('users').doc(userId).collection('transactions')
                .orderBy('date', 'desc')
                .limit(100)
                .get(),
            db.collection('users').doc(userId).collection('accounts').get(),
            db.collection('users').doc(userId).collection('budgets').get(),
        ]);
        const transactions = txSnapshot.docs.map((d) => {
            var _a, _b, _c, _d;
            const data = d.data();
            return {
                id: d.id,
                title: (_b = (_a = data.title) !== null && _a !== void 0 ? _a : data.description) !== null && _b !== void 0 ? _b : '',
                amount: data.amount,
                type: data.type,
                category: data.category,
                description: (_c = data.description) !== null && _c !== void 0 ? _c : '',
                date: toDateString((_d = data.date) !== null && _d !== void 0 ? _d : data.createdAt),
            };
        });
        const accounts = acctSnapshot.docs.map((d) => {
            var _a;
            const data = d.data();
            return {
                id: d.id,
                name: data.name,
                type: data.type,
                balance: data.balance,
                currency: (_a = data.currency) !== null && _a !== void 0 ? _a : 'ZAR',
            };
        });
        const budgets = budgetSnapshot.docs.map((d) => {
            const data = d.data();
            return {
                category: data.category,
                amount: data.amount,
                period: data.period,
            };
        });
        // Build context for Gemini
        const context = JSON.stringify({ accounts, budgets, transactions }, null, 2);
        const systemPrompt = `You are a helpful personal finance assistant for the CashFlow app. 
You have access to the user's financial data provided below. 
Answer the user's question based ONLY on this data. 
Be concise, clear, and friendly. Format currency values appropriately.
If the data does not contain enough information to answer the question, say so politely.

USER FINANCIAL DATA:
${context}`;
        // Call Gemini API
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('GEMINI_API_KEY secret is not configured');
            res.status(500).json({ success: false, error: 'AI service is not configured.' });
            return;
        }
        const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent([
            { text: systemPrompt },
            { text: `User question: ${question.trim()}` },
        ]);
        const answer = result.response.text();
        res.status(200).json({ success: true, data: { answer } });
    }
    catch (error) {
        console.error('Error in askAI:', error);
        let statusCode = 500;
        let errorMessage = 'Internal server error';
        if (error instanceof Error) {
            if (error.message.includes('Authorization header') || error.message.includes('Bearer')) {
                statusCode = 401;
                errorMessage = 'Invalid Authorization header format';
            }
            else if (error.message.includes('Invalid or expired token')) {
                statusCode = 401;
                errorMessage = 'Invalid or expired token';
            }
        }
        res.status(statusCode).json({ success: false, error: errorMessage });
    }
});
//# sourceMappingURL=index.js.map