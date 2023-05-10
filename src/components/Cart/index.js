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
    this._observeCartItem();
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

  _observeCartItem() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type !== "childList") {
          return;
        }

        const addedBtn = mutation.addedNodes[0]?.querySelector(
          "[data-cart-action='remove']"
        );

        if (addedBtn) {
          this._setupRemoveBtn(addedBtn);
        }
      });
    });

    observer.observe(this.elementRef, { childList: true });
  }
}
