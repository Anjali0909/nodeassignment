var express = require('express');
var mongoose=require('mongoose')
var Schema = mongoose.Schema
const { check, validationResult } = require('express-validator');

mongoose.connect("mongodb+srv://anjali:anjali@cluster0.dmpfm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{ useUnifiedTopology: true, useNewUrlParser: true  })
const Student = new Schema({
    name:String,
    email:{
        type: String,
        lowercase: true,
        trim: true,
    },
	password: String,
    active: Boolean
})

module.exports = Student;

