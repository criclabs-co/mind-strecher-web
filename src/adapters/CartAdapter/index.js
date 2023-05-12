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
   * @returns {void}
   */
  static addCartItem(itemSlug, attr = {}) {
    const cartItems = this.listCartItems();

    if (!cartItems.find((item) => item.slug == itemSlug)) {
      cartItems.push({ slug: itemSlug, attr });
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }

    this._fireUpdateEvent();
  }

  /**
   * Remove the given slug from the cart and update the local storage.
   *
   * @function
   * @name removeCartItem
   * @param {string} itemSlug - Slug of schedule to remove from the cart.
   * @returns {void}
   */
  static removeCartItem(itemSlug) {
    const cartItems = this.listCartItems();

    const updatedCartItem = cartItems.filter(
      (cartItem) => cartItem.slug != itemSlug
    );
    localStorage.setItem("cart", JSON.stringify(updatedCartItem));

    this._fireUpdateEvent();
  }

  /**
   * Clear the cart items.
   *
   * @function
   * @name clearCart
   * @returns {void}
   */
  static clearCart() {
    localStorage.setItem("cart", "[]");

    this._fireUpdateEvent();
  }

  // Private

  static _fireUpdateEvent() {
    const event = new Event("cart-updated");
    window.dispatchEvent(event);
  }
}
