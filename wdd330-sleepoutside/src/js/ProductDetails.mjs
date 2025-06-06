import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    };

    async init() {
        this.product = await this.dataSource.findProductById(this.productId);
        this.renderProductDetails();
        document
            .getElementById('addToCart')
            .addEventListener('click', this.addProductToCart.bind(this));
    };

    addProductToCart() {
      const cartItems = getLocalStorage("so-cart") || [];
      if (isIn(this.product, cartItems)) {
        console.log("already in")
        
      } else {
        this.product.quantity = 1;
        cartItems.push(this.product);
        setLocalStorage("so-cart", cartItems);
      }

      function isIn(product, cartItems) {
        for (const item of cartItems) {
          console.log(item);
          console.log(product);
          if (item.Id === product.Id) {
            item.quantity += 1;
            setLocalStorage("so-cart", cartItems);
            return true;
          }
        }
      }
    };

    renderProductDetails() {
        productDetailsTemplate(this.product);
    }
}

function productDetailsTemplate(product) {
  document.querySelector("h2").textContent = product.Brand.Name;
  document.querySelector("h3").textContent = product.NameWithoutBrand;

  const productImageContainer = document.querySelector(".product-image-container"); // Get the wrapper
  const productImage = document.getElementById("productImage");
  productImage.src = product.Images.PrimaryLarge;
  productImage.alt = product.NameWithoutBrand;

  document.getElementById("productPrice").textContent = `$${product.FinalPrice.toFixed(2)}`;
  document.getElementById("productColor").textContent = product.Colors[0].ColorName;
  document.getElementById("productDesc").innerHTML = product.DescriptionHtmlSimple;
  document.getElementById("addToCart").dataset.id = product.Id;

  // Calculate the discount percentage
  const discount = product.SuggestedRetailPrice > product.FinalPrice
    ? Math.round(((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100)
    : null;

  // Append discount badge inside the image container
  if (discount !== null && productImageContainer) {
    const discountContainer = document.createElement("div");
    discountContainer.classList.add("discount-container-details");

    discountContainer.innerHTML = `
      <img src="/images/discount-star.png" alt="Discount Star" class="discount-image-details">
      <span class="discount-text-details">${discount}% OFF</span>`;

    productImageContainer.appendChild(discountContainer);
  }
}