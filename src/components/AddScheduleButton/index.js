/**
 * Module Name: AddScheduleButton
 *
 * Depedency Modules:
 *  - CartAdapter
 */
class AddScheduleButton {
  constructor(elementRef) {
    this.elementRef = elementRef;
    this.scheduleSlug = elementRef.dataset.scheduleSlug;

    this.addButton = this.elementRef.querySelector("[data-cart-action='add']");
    this.removeButton = this.elementRef.querySelector(
      "[data-cart-action='remove']"
    );

    this.levelSlugs = this._getLevelSlugs();

    this.refreshDisplay();

    this._addEventListeners();
  }

  refreshDisplay() {
    const cartItems = CartAdapter.listCartItems();
    if (cartItems.find((item) => item.slug == this.scheduleSlug)) {
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
      CartAdapter.addCartItem(this.scheduleSlug, { levels: this.levelSlugs });

      this.addButton.style.display = "none";
      this.removeButton.style.display = "flex";
    });

    this.removeButton.addEventListener("click", () => {
      CartAdapter.removeCartItem(this.scheduleSlug);

      this.addButton.style.display = "flex";
      this.removeButton.style.display = "none";
    });
  }

  _getLevelSlugs() {
    const levelSlugs =
      this.elementRef.querySelector("[data-level-slugs]").dataset.levelSlugs;

    return levelSlugs.split(",").filter((slug) => !!slug);
  }
}
