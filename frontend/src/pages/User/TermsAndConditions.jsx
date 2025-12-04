import { Link } from "react-router";
const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-teal-700">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-teal-700 mb-4">Terms and Conditions</h1>
          <p className="text-gray-600 text-lg">Last Updated: December 4, 2025</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-800 text-lg mb-8">
            Welcome to <strong>ThriftTech</strong>, a platform that allows users to buy and sell second-hand electronic products. By accessing or using our website, you agree to comply with and be bound by the following Terms and Conditions.
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. User Eligibility</h2>
              <p className="text-gray-700">
                You must be at least 18 years old to use this platform. By registering, you confirm that all information you provide is accurate and complete.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Seller Responsibilities</h2>
              <ul className="space-y-2 text-gray-700">
                <li>• Sellers must provide <strong>accurate descriptions and real images</strong> of the products they upload.</li>
                <li>• Uploading <strong>fake images, misleading information, or engaging in scams is strictly prohibited</strong>.</li>
                <li>• Any seller found involved in <strong>fraud, scam, or deceptive practices will be permanently banned</strong> from the platform without prior notice.</li>
                <li>• Sellers are fully responsible for the authenticity, quality, and legality of the products they list.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Payments & Payout Policy</h2>
              <ul className="space-y-2 text-gray-700">
                <li>• Seller payouts are processed <strong>once every month</strong>.</li>
                <li>• Each payout cycle is calculated <strong>from the last successful payment date</strong>.</li>
                <li>• If a payout is delayed for any reason, <strong>the last credited earnings date will be used as the new payout reference</strong>.</li>
                <li>• All payouts are subject to verification and successful transaction confirmation.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Platform Commission</h2>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>ThriftTech charges a 10% service commission on each successful sale.</strong></li>
                <li>• This commission is automatically deducted from the product's selling price before the seller payout.</li>
                <li>• The commission covers platform operations, transaction processing, security, and support services.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Order & Delivery Responsibility</h2>
              <ul className="space-y-2 text-gray-700">
                <li>• Sellers are responsible for timely shipping after order confirmation.</li>
                <li>• Customers are responsible for providing accurate delivery details.</li>
                <li>• The platform is not liable for delays caused by third-party delivery providers.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Account Suspension & Termination</h2>
              <p className="text-gray-700 mb-3">
                We reserve the right to:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Suspend or terminate any account involved in:</li>
                <li className="ml-6">- Fraudulent activity</li>
                <li className="ml-6">- Fake product listings</li>
                <li className="ml-6">- Payment abuse</li>
                <li className="ml-6">- Violation of any platform policies</li>
                <li>• Terminated accounts may permanently lose access to platform services and earnings.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-700">
                ThriftTech acts as a marketplace only and is <strong>not responsible for disputes between buyers and sellers</strong>, including but not limited to:
              </p>
              <ul className="space-y-1 text-gray-700 mt-2">
                <li>• Product quality issues</li>
                <li>• Payment disputes</li>
                <li>• Delivery failures</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to These Terms</h2>
              <p className="text-gray-700">
                We may update these Terms & Conditions at any time. Continued use of the platform after changes means you accept the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Information</h2>
              <p className="text-gray-700">
                For any issues or disputes related to these terms, please contact us at:
                <br />
                <strong><Link to="/contactus">support@thrifttech.com</Link></strong>
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              By using ThriftTech, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
