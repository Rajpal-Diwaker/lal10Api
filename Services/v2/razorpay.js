const Razorpay = require('razorpay');
const util = require('../../Utilities/util')

const razorpayOrder = util.errHandler(async (req, res) => {
    try {
      let code = util.statusCode.OK;
      let messagee = util.statusMessage.SUCCESS;

      const instance = new Razorpay({

        // // sanbox key
        // key_id: "rzp_test_wwHXgyLEIsXlWT",
        // key_secret: "7Q0W4DwAbVVdjRLh5ARbxap4"

        // production Key
        key_id: "rzp_live_Dgv9W0Euq5meCV",
        key_secret: "iEmn48yvRE3wk4BRKOZ3qdty"

      });

      const { amount, name } = req.body

      if(!name){
        throw new Error("Missing field name")
      }

      const options = {
        amount: amount*100,
        currency: "INR",
        receipt: `ORDER0${Math.floor(Math.random() * 100)}`,
        payment_capture: 0
      }

      const { email, mobile  } = req.user;

      instance.orders.create(options, (err, order) => {
          if(err){
              // console.log(err)
              throw new Error("Some error while creating razorpay order")
          }

          instance.customers.create({name, email, contact: mobile, notes: {}})

          res.json({ code, message: messagee, value: order })
      })
    } catch (error) {
      res.send({ code: util.statusCode.FOUR_ZERO_ZERO, message: error })
    }
  })

  module.exports = {
    razorpayOrder,
  }