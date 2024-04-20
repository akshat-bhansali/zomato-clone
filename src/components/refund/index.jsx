import React from "react";

const RefundPolicy = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Refund Policy</h1>
      <p className="text-gray-600 mb-4">Effective Date: 2024-04-01</p>
      <p className="text-gray-800 mb-6">
        Snackblitz (“we,” “us,” or “our”) is committed to ensuring customer satisfaction. This Refund Policy outlines our policy regarding refunds for orders placed through our website____________ (the “Site”).
      </p>
      <h2 className="text-xl font-semibold mb-2">Cancellation</h2>
      <p className="text-gray-800 mb-4">
        As a general rule Buyer/customer shall not be entitled to cancel the order once placed. Customers may choose to cancel the order only within one minute of the order being placed. If a customer cancels his/her order after one minute of placing it, Snackblitz has a right to collect a penalty of 100% of the order amount for breach of contract terms as compensation for the damages suffered by Snackblitz with a right to either not to refund the Order value in case the order is prepaid or recover from subsequent order in case the order is postpaid.
      </p>
      <h2 className="text-xl font-semibold mb-2">Non-Cancellation</h2>
      <p className="text-gray-800 mb-4">
        Snackblitz reserves the right to collect a penalty for the orders to be canceled by Snackblitz for reasons not attributable to Snackblitz. Reasons may include:
      </p>
      <ul className="list-disc list-inside text-gray-800 mb-4">
        <li>If the address provided by the customer is wrong.</li>
        <li>Unavailability of all the items ordered by the customer at the time of the booking of the order. In the unlikely event of an item in an order being unavailable, Snackblitz will contact the customer on the phone number provided to us at the time of placing an order and inform the customer of such unavailability. In such an event, the customer will be entitled to cancel the entire order and shall be entitled to a refund of up to 100% of the order value.</li>
      </ul>
      <h2 className="text-xl font-semibold mb-2">Refunds</h2>
      <ul className="list-disc list-inside text-gray-800 mb-4">
        <li>Buyer may be entitled to a refund for prepaid Orders. Snackblitz retains the right to retain the penalty payable by the Buyer from the amount refundable to him/her. The Buyer shall also be entitled to a refund of proportionate value in the event packaging of an item in an Order or the complete Order is either tampered with or damaged and the Buyer refuses to accept at the time of takeaway.</li>
        <li>Our decision on refunds shall be final and binding.</li>
        <li>All refund amounts shall be credited to the Buyer's account as may be stipulated as per the payment mechanism of the Buyer's choice. The estimated timelines are detailed below:</li>
      </ul>
      <table className="w-full border-collapse border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">Process</th>
            <th className="border border-gray-300 p-2 text-left">Payment Method</th>
            <th className="border border-gray-300 p-2 text-left">Refund Source</th>
            <th className="border border-gray-300 p-2">TAT</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 p-2">Cancellation/Payment failure/Compensation</td>
            <td className="border border-gray-300 p-2">Net Banking</td>
            <td className="border border-gray-300 p-2">Source</td>
            <td className="border border-gray-300 p-2">5-7 business days</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2">Debit/Credit card</td>
            <td className="border border-gray-300 p-2">Source</td>
            <td className="border border-gray-300 p-2">5-7 business days</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2">UPI</td>
            <td className="border border-gray-300 p-2">Source</td>
            <td className="border border-gray-300 p-2">2-5 hours</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2">AmazonPay (wallet)</td>
            <td className="border border-gray-300 p-2">Source</td>
            <td className="border border-gray-300 p-2">5-7 business days</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2">AmazonPay (CC/DC)</td>
            <td className="border border-gray-300 p-2">Source</td>
            <td className="border border-gray-300 p-2">5-7 business days</td>
          </tr>
        </tbody>
      </table>
      <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
      <p className="text-gray-800 mb-4">
        If you have any questions about our Refund Policy, or to request a refund, please contact us at <a href="mailto:refundsnackblitz@gmail.com" className="text-blue-600 hover:underline">refundsnackblitz@gmail.com</a>.
      </p>
      <p className="text-gray-800">
        By placing an order through our Site, you agree to abide by this Refund Policy. We reserve the right to modify this policy at any time without prior notice.
      </p>
    </div>
  );
};

export default RefundPolicy;
