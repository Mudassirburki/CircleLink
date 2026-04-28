const admin = require('firebase-admin');

// Initialize only once
if (admin.apps.length === 0) {
    admin.initializeApp();
}

/**
 * 📦 EXPORTS
 * Import modular functions and export them for deployment
 */
const likeNotification = require('./likeNotification');
const commentNotification = require('./commentNotification');
const followNotification = require('./followNotification');

exports.onLikeCreated = likeNotification.onLikeCreated;
exports.onCommentCreated = commentNotification.onCommentCreated;
exports.onFollowCreated = followNotification.onFollowCreated;
