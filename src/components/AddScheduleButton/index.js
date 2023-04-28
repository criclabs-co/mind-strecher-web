/**
 * Module Name: AddScheduleButton
 *
 * Depedency Modules:
 *  - CartAdapter
 */
class AddScheduleButton {
  constructor(elementRef, options = {}) {
    const DEFAULT_OPTIONS = { refreshCartDisplay: true };

    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.scheduleSlug = elementRef.dataset.scheduleSlug;

    this.addButton = elementRef.querySelector("[data-cart-action='add']");
    this.removeButton = elementRef.querySelector("[data-cart-action='remove']");

    this.refreshDisplay();

    this._addEventListeners();
  }

  refreshDisplay() {
    const cartItems = CartAdapter.listCartItems();
    if (cartItems.includes(this.scheduleSlug)) {
      this.addButton.style.display = "none";
      this.removeButton.style.display = "flex";
    } else {
      this.addButton.style.display = "flex";
      this.removeButton.style.display = "none";
    }
  }

  // Private

  _addEventListeners() {
    this.addButton.addEventListener("click", () => {
      CartAdapter.addCartItem(
        this.scheduleSlug,
        this.options.refreshCartDisplay
      );

      this.addButton.style.display = "none";
      this.removeButton.style.display = "flex";
    });

    this.removeButton.addEventListener("click", () => {
      CartAdapter.removeCartItem(
        this.scheduleSlug,
        this.options.refreshCartDisplay
      );

      this.addButton.style.display = "flex";
      this.removeButton.style.display = "none";
    });
  }
}
