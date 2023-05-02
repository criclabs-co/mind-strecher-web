/**
 * Module Name: CheckoutSection
 *
 * Depedency Modules:
 *  - CartAdapter
 */
class CheckoutSection {
  constructor(elementRef) {
    this.elementRef = elementRef;

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
    const cartItems = CartAdapter.listCartItems();

    if (cartItems.length > 0) {
      this.elementRef.style.display = "block";
    } else {
      this.elementRef.style.display = "none";
    }
  }
}
