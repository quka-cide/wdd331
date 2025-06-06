import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const myCheckout = new CheckoutProcess();
myCheckout.init();

document.querySelector('#checkoutSubmit')
.addEventListener('click', (e) => {
  e.preventDefault();
  myCheckout.checkout();
});