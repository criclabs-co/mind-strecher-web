/**
 * Module Name: Cart
 *
 * Depedency Modules:
 *  - CartAdapter
 */
class Cart {
  constructor(elementRef) {
    this.elementRef = elementRef;

    this._setupRemoveItemBtns();
    this._setupCartItemObserver();
  }

  // Private

  _setupRemoveItemBtns() {
    this.elementRef
      .querySelectorAll("[data-cart-action='remove']")
      .forEach((btn) => {
        this._setupRemoveBtn(btn);
      });
  }

  _setupRemoveBtn(btn) {
    if (!btn.dataset.setup) {
      btn.addEventListener("click", () => {
        CartAdapter.removeCartItem(btn.dataset.scheduleSlug);
      });

      btn.dataset.setup = true;
    }
  }

  _setupCartItemObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          const addedItem = mutation.addedNodes[0];

          if (addedItem) {
            const button = addedItem.querySelector(
              "[data-cart-action='remove']"
            );

            this._setupRemoveBtn(button);
          }
        }
      });
    });

    observer.observe(this.elementRef, { childList: true });
  }
}
