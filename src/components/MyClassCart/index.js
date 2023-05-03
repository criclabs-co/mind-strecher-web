/**
 * Module Name: MyClassCart
 *
 * Depedency Modules:
 *  - @finsweet/attributes-cmsfilter
 */
class MyClassCart {
  constructor(elementRef) {
    this.elementRef = elementRef;

    this.cartItems = [];
  }

  async setup() {
    const currentUrl = new URL(window.location.href);
    const searchParams = currentUrl.searchParams;

    const cartId = searchParams.get("id");

    if (!cartId) {
      console.error("Invalid Cart ID");
      return;
    }

    const cart = await this._fetchCart(cartId);
    this.cartItems = cart.items;

    this._refreshDisplay();
    this.elementRef.classList.remove("is-hidden");
  }

  // Private

  async _fetchCart(cartId) {
    const apiURL =
      "https://qvwbksxvagcitxawaeqn.functions.supabase.co/get-cart";
    const token =
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqdnhpc2ZrdnFjdXlmZXNocmpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODE4OTE5MTUsImV4cCI6MTk5NzQ2NzkxNX0.jIfzfWug64U4Q9V1MAy0prpcNhqqGkkx2odhZ4K0YJo";

    const res = await fetch(apiURL, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cartId,
      }),
    });

    if (!res.ok) {
      console.error("Failed to get cart");
      return;
    }

    return res.json();
  }

  _refreshDisplay() {
    window.fsAttributes = window.fsAttributes || [];
    window.fsAttributes.push([
      "cmsfilter",
      (filterInstances) => {
        const cartInstance = filterInstances.find(
          (instance) => instance.form.dataset.name == "my-class-cart"
        );

        if (cartInstance == null) {
          return;
        }

        const cartItems = this.cartItems;
        const defaultFilter = new Set();

        cartItems.forEach((item) => {
          defaultFilter.add(item);
        });

        cartInstance.filtersData = [
          {
            filterKeys: ["schedule-slug"],
            originalFilterKeys: ["schedule-slug"],
            hightlight: false,
            elements: [],
            values: defaultFilter,
          },
        ];

        cartInstance.applyFilters();
      },
    ]);
  }
}
