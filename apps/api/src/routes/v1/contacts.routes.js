// src/routes/v1/contacts.routes.js

import express from 'express';
const router = express.Router();

import ContactController from '../../controllers/ContactController.js';
import authMiddleware from '../../middlewares/auth.js';

router.get("/", authMiddleware, ContactController.getContacts);

export default router;
