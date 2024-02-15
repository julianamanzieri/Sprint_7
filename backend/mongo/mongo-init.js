// mongo-init.js
db = db.getSiblingDB('api_db');

db.createCollection('messages');
db.createCollection('chatRooms');
db.createCollection('users');
