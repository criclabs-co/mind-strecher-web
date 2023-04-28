/**
 * Module Name: CartAdapter
 *
 * Depedency Modules:
 *  - @finsweet/attributes-cmsfilter
 *  - @finsweet/attributes-cmsload
 */
class CartAdapter {
  /**
   * Parses an array of schedule slugs from local storage and returns it.
   *
   * @function
   * @name listCartItems
   * @returns {Array<string>} The parsed array of strings.
   */
  static listCartItems() {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  }

  /**
   * Add the given slug to the cart and update the local storage.
   *
   * @function
   * @name addCartItem
   * @param {string} item - Slug of schedule to add to the cart.
   * @param {boolean} [refreshCartDisplay=true] - Whether to refresh the cart HTML element. Default is true.
   * @returns {void}
   */
  static addCartItem(item, refreshCartDisplay = true) {
    const cartItems = this.listCartItems();

    if (!cartItems.includes(item)) {
      cartItems.push(item);
      localStorage.setItem("cart", JSON.stringify(cartItems));

      const event = new Event("cart-updated");
      window.dispatchEvent(event);

      refreshCartDisplay && this.refreshCartDisplay();
    }
  }

  /**
   * Remove the given slug from the cart and update the local storage.
   *
   * @function
   * @name addCartItem
   * @param {string} item - Slug of schedule to remove from the cart.
   * @param {boolean} [refreshCartDisplay=true] - Whether to refresh the cart HTML element. Default is true.
   * @returns {void}
   */
  static removeCartItem(item, refreshCartDisplay = true) {
    const cartItems = this.listCartItems();

    const updatedCartItem = cartItems.filter((cartItem) => cartItem != item);
    localStorage.setItem("cart", JSON.stringify(updatedCartItem));

    const event = new Event("cart-updated");
    window.dispatchEvent(event);

    refreshCartDisplay && this.refreshCartDisplay();
  }

  /**
   * Clear the cart items.
   *
   * @function
   * @name clearCart
   * @returns {void}
   */
  static clearCart(refreshCartDisplay = true) {
    localStorage.setItem("cart", "[]");

    const event = new Event("cart-updated");
    window.dispatchEvent(event);

    refreshCartDisplay && this.refreshCartDisplay();
  }

  /**
   * Refresh the cart HTML element.
   *
   * @function
   * @name refreshCartDisplay
   * @returns {void}
   */
  static refreshCartDisplay() {
    window.fsAttributes = window.fsAttributes || [];
    window.fsAttributes.push([
      "cmsfilter",
      (filterInstances) => {
        const cartInstance = filterInstances.find(
          (instance) => instance.form.dataset.name == "cart"
        );

        if (cartInstance == null) {
          return;
        }

        const cartItems = JSON.parse(
          localStorage.getItem("cart") || '["Empty Cart"]'
        );
        const defaultFilter = new Set();

        cartItems.forEach((item) => {
          defaultFilter.add(item);
        });

        cartInstance.filtersData = [
          {
            filterKeys: ["schedule-slug"],
            originalFilterKeys: ["schedule-slug"],
            hightlight: false,
            elements: [],
            values: defaultFilter,
          },
        ];

        cartInstance.applyFilters();
      },
    ]);
  }
}
/** End of class CartAdapter */

class CartButton {
  constructor(elementRef) {
    this.elementRef = elementRef;
    this.cartBtn = this.elementRef.querySelector(".cart__button-wrapper");
    this.cartBtnMobile = this.elementRef.querySelector(
      ".cart__button-wrapper-mobile"
    );

    this.tooltipCount = this.cartBtn.querySelector(".tooltip__count");
    this.tooltipCountMobile =
      this.cartBtnMobile.querySelector(".tooltip__count");

    this._addEventListeners();
    this._refreshDisplay();
  }

  // Private

  _addEventListeners() {
    window.addEventListener("cart-updated", () => {
      this._refreshDisplay();
    });
  }

  _refreshDisplay() {
    const cartLength = CartAdapter.listCartItems().length;

    if (cartLength != 0) {
      this.tooltipCount.style.display = "block";
    } else {
      this.tooltipCount.style.display = "none";
    }

    this.tooltipCount.innerText = cartLength;
    this.tooltipCountMobile.innerText = cartLength;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const cartButtonElement = document.querySelector("#cart-button");

  if (cartButtonElement) {
    new CartButton(cartButtonElement);
  }
});
