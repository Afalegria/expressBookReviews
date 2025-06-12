const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}));

app.use("/customer/auth/*", function auth(req,res,next){
    if (req.session.authorization) {
        // Retrieve the access token from the session
        let token = req.session.authorization['accessToken'];

        // Verify the token using the secret key
        // Note: It's best practice to store secrets in environment variables
        jwt.verify(token, "fingerprint_customer", (err, user) => {
            if (!err) {
                // If the token is valid, attach the user payload to the request object
                req.user = user;
                // Proceed to the next middleware or route handler
                next();
            } else {
                // If the token is invalid or expired, send a 403 Forbidden response
                return res.status(403).json({
                    message: "User not authenticated."
                });
            }
        });
    } else {
        // If there is no token in the session, the user is not logged in
        return res.status(403).json({
            message: "User not logged in."
        });
    }

});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
