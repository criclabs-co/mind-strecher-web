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
   * @param {string} itemSlug - Slug of schedule to add to the cart.
   * @param {object} [attr={}] - Additional attributes of the schedule
   * @param {boolean} [refreshCartDisplay=true] - Whether to refresh the cart HTML element. Default is true.
   * @returns {void}
   */
  static addCartItem(itemSlug, attr = {}, refreshCartDisplay = true) {
    const cartItems = this.listCartItems();

    if (!cartItems.find((item) => item.slug == itemSlug)) {
      cartItems.push({ slug: itemSlug, attr });
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
   * @name removeCartItem
   * @param {string} itemSlug - Slug of schedule to remove from the cart.
   * @param {boolean} [refreshCartDisplay=true] - Whether to refresh the cart HTML element. Default is true.
   * @returns {void}
   */
  static removeCartItem(itemSlug, refreshCartDisplay = true) {
    const cartItems = this.listCartItems();

    const updatedCartItem = cartItems.filter(
      (cartItem) => cartItem.slug != itemSlug
    );
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

        const defaultFilter = new Set();
        const cartItems = this.listCartItems();

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
}
