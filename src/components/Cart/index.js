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
    this._addEventListeners();
    this._observeCartItem();

    this._refreshDisplay();
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

  _addEventListeners() {
    window.addEventListener("cart-updated", () => {
      this._refreshDisplay();
    });
  }

  _refreshDisplay() {
    window.fsAttributes = window.fsAttributes || [];
    window.fsAttributes.push([
      "cmsfilter",
      (filterInstances) => {
        const cartInstance = filterInstances.find(
          (instance) => instance.form.dataset.name == "cart"
        );

        const defaultFilter = new Set();
        const cartItems = CartAdapter.listCartItems();

        if (cartItems.length > 0) {
          cartItems.forEach((item) => {
            defaultFilter.add(item.slug);
          });
        } else {
          defaultFilter.add("EMPTY_CART");
        }

        cartInstance.filtersData = [
          {
            filterKeys: ["schedule-slug"],
            originalFilterKeys: ["schedule-slug"],
            highlight: false,
            elements: [],
            values: defaultFilter,
          },
        ];

        cartInstance.applyFilters();
      },
    ]);
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
