import { useState } from "react";
import axios from "axios";
import { generateUniqueId } from "esewajs";
import { useEsewaPaymentMutation } from "../../redux/api/transactionApiSlice";

const PaymentComponent = () => {
  const [amount, setAmount] = useState("");
  const [esewaPayment] = useEsewaPaymentMutation();

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const payment = await esewaPayment({
        amount,
        productId: generateUniqueId(),
      }).unwrap();

      console.log("payment : ", payment.url);

      if (payment?.url) {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = payment.url;
        document.body.appendChild(form);
        form.submit();
        // window.location.href = payment.url;
      } else {
        console.log("No URL found in response");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>eSewa Payment Integration</h1>

      <div className="form-container" onSubmit={handlePayment}>
        <form className="styled-form">
          <div className="form-group">
            <label htmlFor="Amount">Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              placeholder="Enter amount"
            />
          </div>

          <button
            type="submit"
            className="submit-button bg-red-300 p-3 hover:bg-red-500 rounded-lg"
          >
            Pay with eSewa
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentComponent;
