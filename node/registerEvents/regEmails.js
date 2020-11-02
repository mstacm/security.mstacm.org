// Required to send emails without smtp server
const sendmail = require('sendmail')({
    silent: false,
    smtpPort: 25, // Default: 25
    smtpHost: 'localhost'
})

// Send email reminder to officer managing merch emails and new registrations
const regEmail = "acmsecmerch@gmail.com"

module.exports = {

    sendRegEmail: function (username,email,eventname){

        var regBodyUser = '<h3>ACM Security Team</h3>' + '<hr> <par>'+username+', thank you for registering for \''
            + eventname + '\'! Our officers have been notified of your registration. We look forward to seeing you!' +
            '</par>'

        var regBodyOfficer = '<h3>ACM Security Team</h3>' + '<hr> <par>' + username + ' has registered and paid for '+
            eventname+'.</par>'

        sendmail({
            from: 'no-reply@acm.com',
            to: email,
            subject: 'ACM Security ' +eventname+ ' Registration',
            html: regBodyUser,
        }, function(err, reply) {
            if(err){
                console.log("User email was not sent successfully!")
            }
        });

        sendmail({
            from: 'no-reply@acm.com',
            to: regEmail,
            subject: eventname + ' New Registration',
            html: regBodyOfficer,
        }, function(err, reply) {
            if(err){
                console.log("Officer email was not sent successfully!")
            }
        });

    }

}