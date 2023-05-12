/**
 * Module Name: CartButton
 *
 * Depedency Modules:
 *  - CartAdapter
 */
class CartButton {
  constructor(elementRef) {
    this.elementRef = elementRef;
    this.cartBtn = this.elementRef.querySelector(".cart__button-wrapper");
    this.activeCartBtn = this.elementRef.querySelector(
      ".cart__active-button-wrapper"
    );

    this.tooltipCount = this.elementRef.querySelector(".tooltip__count");

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

    if (cartLength > 0) {
      this.cartBtn.style.display = "none";
      this.activeCartBtn.style.display = "block";
    } else {
      this.cartBtn.style.display = "block";
      this.activeCartBtn.style.display = "none";
    }

    this.tooltipCount.innerText = cartLength;
  }
}
