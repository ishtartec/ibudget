/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Budget = require('./budget.model');

exports.register = function(socket) {
  Budget.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Budget.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('budget:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('budget:remove', doc);
}