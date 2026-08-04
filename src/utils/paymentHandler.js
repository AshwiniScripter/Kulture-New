import paymentService from '../services/paymentService';

let checkoutScriptPromise = null;

// Lazily inject the Razorpay checkout script once; cache the loading promise so
// repeated checkouts don't re-append the script tag.
const loadRazorpayScript = () => {
  if (typeof window !== 'undefined' && window.Razorpay) {
    return Promise.resolve(window.Razorpay);
  }
  if (checkoutScriptPromise) return checkoutScriptPromise;

  checkoutScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => {
      checkoutScriptPromise = null;
      reject(new Error('Could not load the payment gateway. Please check your connection.'));
    };
    document.body.appendChild(script);
  });
  return checkoutScriptPromise;
};

/**
 * Full Razorpay payment sequence:
 *   1. create_payment_order  -> { key, order_id, amount, currency }
 *   2. Open the Razorpay popup with those params
 *   3. verify_payment with { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 *
 * Resolves with `{ paymentResponse, verification }` once the backend confirms the
 * payment. Throws on cancellation, failure, or failed verification.
 */
const initiateRazorpayPayment = async ({
  amount,
  name = 'Kulture Vintage',
  description = 'Order Payment',
  prefill = {},
  onStage = () => {},
}) => {
  onStage('initializing');
  const order = await paymentService.createPaymentOrder(amount);
  if (!order?.order_id) {
    throw new Error(order?.message || 'Could not initialise payment. Please try again.');
  }

  onStage('payment');
  const Razorpay = await loadRazorpayScript();

  const modalResult = await new Promise((resolve) => {
    let settled = false;
    const done = (result) => {
      if (!settled) {
        settled = true;
        resolve(result);
      }
    };

    const instance = new Razorpay({
      key: order.key,
      amount: order.amount ?? amount,
      currency: order.currency || 'INR',
      order_id: order.order_id,
      name,
      description,
      prefill,
      theme: { color: '#0f0f0f' },
      handler: (response) => done({ status: 'paid', response }),
      modal: {
        ondismiss: () => done({ status: 'cancelled' }),
      },
    });
    instance.on('payment.failed', (resp) => done({ status: 'failed', response: resp }));
    instance.open();
  });

  if (modalResult.status !== 'paid') {
    throw new Error(
      modalResult.status === 'cancelled'
        ? 'Payment cancelled. No amount was charged.'
        : modalResult.response?.error?.description || 'Payment failed. Please try again.'
    );
  }

  onStage('verifying');
  const verification = await paymentService.verifyPayment({
    razorpay_order_id: modalResult.response.razorpay_order_id,
    razorpay_payment_id: modalResult.response.razorpay_payment_id,
    razorpay_signature: modalResult.response.razorpay_signature,
  });
  if (!verification?.success) {
    throw new Error(verification?.message || 'Payment verification failed. Please contact support.');
  }

  return { paymentResponse: modalResult.response, verification };
};

export { loadRazorpayScript, initiateRazorpayPayment };
