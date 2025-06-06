import { getLocalStorage, setLocalStorage, alertMessage, removeAllAlerts } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

function formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    const convertedJSON = {};
    formData.forEach((value, key) => {
        convertedJSON[key] = value;
    });
    return convertedJSON;
}

function packageItems(items) {
    return items.map((item) => ({
        id: item.Id,
        price: item.FinalPrice,
        name: item.Name,
        quantity: item.quantity || 1,
    }));
}

const services = new ExternalServices();

export default class CheckoutProcess {
    constructor() {
        this.total = 0;
        this.tax = 0;
        this.shipping = 0;
        this.orderTotal = 0;
        this.totalQuantity = 0;
        this.cartItems = getLocalStorage("so-cart") || [];
        this.list = this.cartItems; // use it in checkout
    }

    init() {
        this.countSubtotal();
        this.countTax();
        this.countShippingEstimate();
        this.calculateOrderTotal();
        this.displaySummary();
    }

    countSubtotal() {
        for (const item of this.cartItems) {
            const quantity = item.quantity || 1;
            const price = Number(item.FinalPrice) || 0;
            this.total += price * quantity;
            this.totalQuantity += quantity;
        }
    }

    countTax() {
        this.tax = this.total * 0.06;
    }

    countShippingEstimate() {
        if (this.totalQuantity > 0) {
            this.shipping = 10 + ((this.totalQuantity - 1) * 2);
        }
    }

    calculateOrderTotal() {
        this.orderTotal = this.total + this.tax + this.shipping;
    }

    displaySummary() {
        document.querySelector(".summary").innerHTML = `
            <div class="num-items">Items: ${this.totalQuantity}</div>
            <div class="subtotal">Subtotal: $${this.total.toFixed(2)}</div>
            <div class="tax">Tax: $${this.tax.toFixed(2)}</div>
            <div class="shipping">Shipping: $${this.shipping.toFixed(2)}</div>
            <div class="total">Total: $${this.orderTotal.toFixed(2)}</div>
        `;
    }

    async checkout() {
        const formElement = document.forms["checkout"];
        const order = formDataToJSON(formElement);

        order.orderDate = new Date().toISOString();
        order.orderTotal = this.orderTotal;
        order.tax = this.tax;
        order.shipping = this.shipping;
        order.items = packageItems(this.list);

        try {
            const response = await services.checkout(order);
            console.log(response);
            setLocalStorage("so-cart", []);
            location.assign("/checkout/success.html");
        } catch (err) {
            removeAllAlerts();
            for (let message in err.message) {
                alertMessage(err.message[message]);
            }
            console.log("Checkout failed:", err);
        }
        
    }
}