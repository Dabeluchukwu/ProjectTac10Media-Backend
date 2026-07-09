const axios = require("axios");




// Paystack API connection
const paystack = axios.create({



  baseURL:

  "https://api.paystack.co",



  headers:{



    Authorization:

    `Bearer ${process.env.PAYSTACK_SECRET_KEY}`



  }



});






module.exports = paystack;