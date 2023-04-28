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
