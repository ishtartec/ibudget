'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BudgetSchema = new Schema({
    name: String,
    customer: String,
    instructorFee: Number,
    instructorHours: Number,
    instructorTotal: Number,
    vendorFee: Number,
    vendorCount: Number,
    vendorTotal: Number,
    manualsFee: Number,
    manualsCount: Number,
    manualsTotal: Number,
    expensesFee: Number,
    expensesCount: Number,
    expsensesTotal: Number,
    travelCost: Number,
    travelCount: Number,
    travelTotal: Number,
    date: Date,
    comments: String,
    ic: Number,
    dc: Number,
    bi: Number,
    total: Number,
    createdBy: String
});

module.exports = mongoose.model('Budget', BudgetSchema);