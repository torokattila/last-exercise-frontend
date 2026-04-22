#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

// Load .env files the same way CRA does (lowest to highest priority)
const envFiles = [
  '.env',
  '.env.local',
  `.env.${process.env.NODE_ENV}`,
  `.env.${process.env.NODE_ENV}.local`,
].filter(Boolean);

for (const file of envFiles) {
  const filePath = path.resolve(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    require('dotenv').config({ path: filePath });
  }
}

const required = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID',
];

const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.warn(`[inject-sw-env] Warning: missing env vars: ${missing.join(', ')}. sw.js will not be generated.`);
  process.exit(0);
}

const firebaseConfig = JSON.stringify({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
});

const templatePath = path.resolve(__dirname, '..', 'public', 'sw-template.js');
const outputPath = path.resolve(__dirname, '..', 'public', 'sw.js');

const template = fs.readFileSync(templatePath, 'utf-8');
const output = template.replace('__FIREBASE_CONFIG__', firebaseConfig);

fs.writeFileSync(outputPath, output, 'utf-8');
console.log('[inject-sw-env] public/sw.js generated successfully.');
