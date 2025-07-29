

const FAQ = () => {
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-2 flex items-center justify-center">
      <section className="w-full max-w-3xl bg-white/90 rounded-2xl shadow-2xl border border-green-200 p-8 backdrop-blur-md animate-fade-in-up">
        <h2 className="text-3xl font-extrabold text-green-700 mb-8 text-center drop-shadow">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group border border-gray-200 rounded-lg p-4 bg-white transition-shadow hover:shadow-lg">
            <summary className="font-semibold text-lg cursor-pointer text-green-700 group-open:text-green-900 transition">1. What is a thrift store?</summary>
            <p className="mt-2 text-gray-700">A thrift store sells gently used clothes, accessories, and other items at affordable prices. A great way to shop sustainably and save money.</p>
          </details>
          <details className="group border border-gray-200 rounded-lg p-4 bg-white transition-shadow hover:shadow-lg">
            <summary className="font-semibold text-lg cursor-pointer text-green-700 group-open:text-green-900 transition">2. Are all electronic items used or second-hand?</summary>
            <p className="mt-2 text-gray-700">Most of our products are gently used or refurbished. Some items may be brand new or open-box. The condition is clearly mentioned on each product page.</p>
          </details>
          <details className="group border border-gray-200 rounded-lg p-4 bg-white transition-shadow hover:shadow-lg">
            <summary className="font-semibold text-lg cursor-pointer text-green-700 group-open:text-green-900 transition">3. Are the electronics tested before listing?</summary>
            <p className="mt-2 text-gray-700">Yes, all vendors are required to test and verify the functionality of their products. Items sold by our certified vendors are quality-checked before shipping.</p>
          </details>
          <details className="group border border-gray-200 rounded-lg p-4 bg-white transition-shadow hover:shadow-lg">
            <summary className="font-semibold text-lg cursor-pointer text-green-700 group-open:text-green-900 transition">4. How can I trust the sellers?</summary>
            <p className="mt-2 text-gray-700">All vendors are verified by our team before they can start selling. Customer ratings, reviews, and return policies are also visible for transparency.</p>
          </details>
          <details className="group border border-gray-200 rounded-lg p-4 bg-white transition-shadow hover:shadow-lg">
            <summary className="font-semibold text-lg cursor-pointer text-green-700 group-open:text-green-900 transition">5. Can I return or exchange items?</summary>
            <p className="mt-2 text-gray-700">Yes, but return policies may vary by seller. Please check the return terms listed on the product page before purchasing.</p>
          </details>
          <details className="group border border-gray-200 rounded-lg p-4 bg-white transition-shadow hover:shadow-lg">
            <summary className="font-semibold text-lg cursor-pointer text-green-700 group-open:text-green-900 transition">6. Will I receive a warranty?</summary>
            <p className="mt-2 text-gray-700">Most sellers offer a limited warranty (7 to 30 days). The warranty period and coverage will be mentioned in the product listing.</p>
          </details>
          <details className="group border border-gray-200 rounded-lg p-4 bg-white transition-shadow hover:shadow-lg">
            <summary className="font-semibold text-lg cursor-pointer text-green-700 group-open:text-green-900 transition">7. Who delivers the product — the seller or the platform?</summary>
            <p className="mt-2 text-gray-700">All items are shipped through our centralized logistics team to ensure timely and safe delivery.</p>
          </details>
          <details className="group border border-gray-200 rounded-lg p-4 bg-white transition-shadow hover:shadow-lg">
            <summary className="font-semibold text-lg cursor-pointer text-green-700 group-open:text-green-900 transition">8. Can I place orders from multiple vendors in one checkout?</summary>
            <p className="mt-2 text-gray-700">Yes! You can buy products from multiple sellers in one cart. However, they may arrive in separate packages.</p>
          </details>
          <details className="group border border-gray-200 rounded-lg p-4 bg-white transition-shadow hover:shadow-lg">
            <summary className="font-semibold text-lg cursor-pointer text-green-700 group-open:text-green-900 transition">9. How do I track my order?</summary>
            <p className="mt-2 text-gray-700">Once your order is confirmed and shipped, a tracking ID will be sent to you via email.</p>
          </details>
          <details className="group border border-gray-200 rounded-lg p-4 bg-white transition-shadow hover:shadow-lg">
            <summary className="font-semibold text-lg cursor-pointer text-green-700 group-open:text-green-900 transition">10. Is there a registration or listing fee?</summary>
            <p className="mt-2 text-gray-700">No listing fee is charged, but a small commission is taken from each successful sale. Full details are shared in the vendor agreement.</p>
          </details>
          <details className="group border border-gray-200 rounded-lg p-4 bg-white transition-shadow hover:shadow-lg">
            <summary className="font-semibold text-lg cursor-pointer text-green-700 group-open:text-green-900 transition">11. How do I upload and manage products?</summary>
            <p className="mt-2 text-gray-700">After login, use your Vendor Dashboard to add products, manage stock, track orders, and see earnings.</p>
          </details>
          <details className="group border border-gray-200 rounded-lg p-4 bg-white transition-shadow hover:shadow-lg">
            <summary className="font-semibold text-lg cursor-pointer text-green-700 group-open:text-green-900 transition">12. How do I receive payments?</summary>
            <p className="mt-2 text-gray-700">Payments are processed by the platform and transferred to your bank or digital wallet (eSewa, Khalti, etc.) after the order is delivered and confirmed.</p>
          </details>
          <details className="group border border-gray-200 rounded-lg p-4 bg-white transition-shadow hover:shadow-lg">
            <summary className="font-semibold text-lg cursor-pointer text-green-700 group-open:text-green-900 transition">13. What happens if my product is returned?</summary>
            <p className="mt-2 text-gray-700">If a customer returns a product due to a defect or wrong item, you may need to accept the return and bear the shipping cost based on our return policy.</p>
          </details>
          <details className="group border border-gray-200 rounded-lg p-4 bg-white transition-shadow hover:shadow-lg">
            <summary className="font-semibold text-lg cursor-pointer text-green-700 group-open:text-green-900 transition">14. Do I need to handle shipping myself?</summary>
            <p className="mt-2 text-gray-700">No. Once you confirm an order, our team will handle pickup and delivery through our logistics partners.</p>
          </details>
          <details className="group border border-gray-200 rounded-lg p-4 bg-white transition-shadow hover:shadow-lg">
            <summary className="font-semibold text-lg cursor-pointer text-green-700 group-open:text-green-900 transition">15. Can I offer my own warranty or promotions?</summary>
            <p className="mt-2 text-gray-700">Yes! You can set custom warranty periods, run discounts, or add product bundles from your vendor dashboard.</p>
          </details>
          <details className="group border border-gray-200 rounded-lg p-4 bg-white transition-shadow hover:shadow-lg">
            <summary className="font-semibold text-lg cursor-pointer text-green-700 group-open:text-green-900 transition">16. Can I track my performance as a seller?</summary>
            <p className="mt-2 text-gray-700">Yes! Your dashboard provides insights into sales, customer feedback, product views, and more to help grow your business.</p>
          </details>
        </div>
      </section>
    </div>
  );
 
};

export default FAQ;
