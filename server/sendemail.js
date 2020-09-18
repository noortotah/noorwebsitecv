const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const axios = require('axios');
const nodemailer = require('nodemailer');

// create application/json parser
const jsonParser = bodyParser.json();
 


const contactMail = process.env.CONTACT_MAIL || require('../credentials').CONTACT_MAIL ;
const contactMailPASS = process.env.CONTACT_MAIL_PASS || require('../credentials').CONTACT_MAIL_PASS ;

router.get('/hello', (req, res, next) => { console.log('hello'); res.send('yes')});

router.post('/send',  jsonParser, (req, res, next) => {
	var transporter = nodemailer.createTransport({
	  host: 'smtp.gmail.com',
	  service: 'gmail',
	  auth: {
	    user: contactMail,
	    pass: contactMailPASS
	  }
	});

	var mailOptions = {
	  from: contactMail,
	  to: contactMail,
	  subject:'CV contact from',
	  text: `Name:${req.body.name}, 
	  		Email:${req.body.email}
	  		Text:
	  		${req.body.message}`
	};

	transporter.sendMail(mailOptions, (err, data) => {
	    if (err) {
	      res.status(500).json({
	        msg: 'fail'
	      })
	    } else {
	      res.status(200).json({
	        msg: 'success'
	      })
    	}
  	});
});

module.exports = router;





