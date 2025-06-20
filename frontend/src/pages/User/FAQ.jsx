import '../styles/FAQ.css';

const FAQ = () => {
  return (
<div className="faq-container">
    <section className="faq-section">
      <h2>Frequently Asked Questions</h2>

      <details className="faq-item">
        <summary>1. What is a thrift store?</summary>
        <p>A thrift store sells gently used clothes, accessories, and other items at affordable prices. A great way to shop sustainably and save money.</p>
      </details>

      <details className="faq-item">
        <summary>2. Are all electronic items used or second-hand?</summary>
        <p>Most of our products are gently used or refurbished. Some items may be brand new or open-box. The condition is clearly mentioned on each product page.</p>
      </details>

      <details className="faq-item">
        <summary>3. Are the electronics tested before listing?</summary>
        <p>Yes, all vendors are required to test and verify the functionality of their products. Items sold by our certified vendors are quality-checked before shipping.</p>
      </details>

      <details className="faq-item">
        <summary>4. How can I trust the sellers?</summary>
        <p>All vendors are verified by our team before they can start selling. Customer ratings, reviews, and return policies are also visible for transparency.</p>
      </details>

      <details className="faq-item">
        <summary>5. Can I return or exchange items?</summary>
        <p>Yes, but return policies may vary by seller. Please check the return terms listed on the product page before purchasing.</p>
      </details>

      <details className="faq-item">
        <summary>6. Will I receive a warranty?</summary>
        <p>Most sellers offer a limited warranty (7 to 30 days). The warranty period and coverage will be mentioned in the product listing.</p>
      </details>

      <details className="faq-item">
        <summary>7. Who delivers the product — the seller or the platform?</summary>
        <p>All items are shipped through our centralized logistics team to ensure timely and safe delivery.</p>
      </details>

      <details className="faq-item">
        <summary>8. Can I place orders from multiple vendors in one checkout?</summary>
        <p>Yes! You can buy products from multiple sellers in one cart. However, they may arrive in separate packages.</p>
      </details>

      <details className="faq-item">
        <summary>9. How do I track my order?</summary>
        <p>Once your order is confirmed and shipped, a tracking ID will be sent to you via email.</p>
      </details>

      <details className="faq-item">
        <summary>10. Is there a registration or listing fee?</summary>
        <p>No listing fee is charged, but a small commission is taken from each successful sale. Full details are shared in the vendor agreement.</p>
      </details>

      <details className="faq-item">
        <summary>11. How do I upload and manage products?</summary>
        <p>After login, use your Vendor Dashboard to add products, manage stock, track orders, and see earnings.</p>
      </details>

      <details className="faq-item">
        <summary>12. How do I receive payments?</summary>
        <p>Payments are processed by the platform and transferred to your bank or digital wallet (eSewa, Khalti, etc.) after the order is delivered and confirmed.</p>
      </details>

      <details className="faq-item">
        <summary>13. What happens if my product is returned?</summary>
        <p>If a customer returns a product due to a defect or wrong item, you may need to accept the return and bear the shipping cost based on our return policy.</p>
      </details>

      <details className="faq-item">
        <summary>14. Do I need to handle shipping myself?</summary>
        <p>No. Once you confirm an order, our team will handle pickup and delivery through our logistics partners.</p>
      </details>

      <details className="faq-item">
        <summary>15. Can I offer my own warranty or promotions?</summary>
        <p>Yes! You can set custom warranty periods, run discounts, or add product bundles from your vendor dashboard.</p>
      </details>

      <details className="faq-item">
        <summary>16. Can I track my performance as a seller?</summary>
        <p>Yes! Your dashboard provides insights into sales, customer feedback, product views, and more to help grow your business.</p>
      </details>
    </section>
</div>
  );
};

export default FAQ;
