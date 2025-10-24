import { Transaction } from "../models/esewaModel.js"; //for saving the ordered data in database
import { EsewaPaymentGateway, EsewaCheckStatus } from "esewajs";

const EsewaInitiatePayment = async (req, res) => {
  console.log('Initiating eSewa payment');
  const { amount, productId } = req.body;
  console.log('amount and productId :',amount,productId)

  try {
    const reqPayment = await EsewaPaymentGateway(
      amount,
      0, // tax_amount
      0, // service_charge
      0, // delivery_charge
      productId,
      process.env.MERCHANT_ID,
      process.env.SECRET,
      process.env.SUCCESS_URL,
      process.env.FAILURE_URL,
      process.env.ESEWAPAYMENT_URL
    );

    console.log('Payment gateway response received');

    if (!reqPayment) {
      return res.status(400).json({ error: "Error sending data to payment gateway" });
    }
    
    if (reqPayment.status === 200) {
      const transaction = new Transaction({
        product_id: productId,
        amount: amount,
      });

      await transaction.save();
      console.log("Transaction saved successfully");
      
      return res.status(200).json({
        success: true,
        url: reqPayment.request.res.responseUrl,
        message: "Payment initiated successfully"
      });
    } else {
      return res.status(400).json({ 
        error: "Payment gateway returned non-200 status",
        status: reqPayment.status 
      });
    }
  } catch (error) {
    console.error("Payment initiation error:", error);
    
    // More detailed error response
    if (error.code === 'ENOTFOUND') {
      return res.status(500).json({ 
        error: "Network error: Cannot connect to payment gateway",
        details: "Please check your internet connection and the payment gateway URL"
      });
    }
    
    return res.status(400).json({ 
      error: "Error initiating payment",
      details: error.message 
    });
  }
};

const paymentStatus = async (req, res) => {
  try {
    // ✅ Use req.query instead of req.body
    const { product_id } = req.body;

    if (!product_id) {
      console.log('no product id buddy')
      return res
        .status(400)
        .json({ message: "Product ID missing in query params" });
    }

    console.log("Checking payment status for:", product_id);

    // 🔍 Find transaction in DB
    const transaction = await Transaction.findOne({ product_id });
    if (!transaction) {
      console.log('transaction not found buddy sorry')
      return res.status(404).json({ message: "Transaction not found" });
    }

    // ✅ Verify with eSewa’s status check API
    const paymentStatusCheck = await EsewaCheckStatus(
      transaction.amount,
      transaction.product_id,
      process.env.MERCHANT_ID,
      process.env.ESEWAPAYMENT_STATUS_CHECK_URL
    );
    console.log('survived till here buddy')
    if (paymentStatusCheck.status === 200) {
      transaction.status = paymentStatusCheck.data.status || "completed";
      await transaction.save();
      return res
        .status(200)
        .json({ message: "Transaction verified and updated" });
    }

    return res.status(400).json({ message: "Failed to verify payment status" });
  } catch (error) {
    console.error("Error updating transaction status:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export { EsewaInitiatePayment, paymentStatus };
