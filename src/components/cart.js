/**
 * NOTE: CartAdapter is initialized at the global level.
 * Check the custom code in the site setting for the documentation and the implementation detail.
 */

class Basket {
  constructor(elementRef) {
    this.elementRef = elementRef;

    this._setupRemoveItemBtns();
    this._setupBasketItemObserver();
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

  _setupBasketItemObserver() {
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

class CartSubmitForm {
  constructor(elementRef) {
    this.nameInputElement = elementRef.querySelector("input[name='name']");
    this.phoneNumberInputElement = elementRef.querySelector(
      "input[name='phone-number']"
    );
    this.phoneNumberInput = null;
    this.submitBtn = elementRef.querySelector(".button");

    this._setup();
    this._addEventListeners();
  }

  onSubmit() {
    if (this.formSubmitting) {
      return;
    }

    this.formSubmitting = true;

    fetch("https://qvwbksxvagcitxawaeqn.functions.supabase.co/create-cart", {
      method: "POST",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2d2Jrc3h2YWdjaXR4YXdhZXFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODI0MTQwNzIsImV4cCI6MTk5Nzk5MDA3Mn0.3yusDFlnyQ3Lb9iCP9z4joOn39usf-MFaspbKOVfCQ4",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart: JSON.stringify(CartAdapter.listCartItems()),
        name: this.nameInputElement.value,
        dialCode: this.phoneNumberInput.getSelectedCountryData().dialCode,
        phoneNumber: this.phoneNumberInputElement.value,
      }),
    })
      .then((res) => {
        if (res.status !== 200) {
          console.error("Failed to submit cart");
          return;
        }

        res.json().then((data) => {
          window.open(
            `https://wa.me/+6588838004?text=Hi%20MS%20Team%2C%20I%20am%20interested%20in%20the%20courses%20in%20my%20course%20basket%3A%20https%3A%2F%2Fwww.mindstretcher.com%2Fbasket%23${data.id}.%20Kindly%20assist%2C%20thank%20you!`,
            "_blank"
          );

          this.nameInputElement.value = "";
          this.phoneNumberInputElement.value = "";
          CartAdapter.clearCart();
        });
      })
      .finally(() => {
        this.formSubmitting = false;
      });
  }

  // Private

  _setup() {
    window.addEventListener("load", () => {
      this.phoneNumberInput = window.intlTelInput(
        this.phoneNumberInputElement,
        {
          utilsScript:
            "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js",
          initialCountry: "sg",
          preferredCountries: ["sg"],
          separateDialCode: true,
        }
      );
    });
  }

  _addEventListeners() {
    this.submitBtn.addEventListener("click", () => this.onSubmit());
  }
}

class ClassScheduleList {
  constructor(elementRef, options = {}) {
    const DEFAULT_OPTIONS = { refreshCartDisplay: true };

    this.elementRef = elementRef;
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.selectors = {
      cartActionWrapper: ".class-schedule_add-wrapper",
    };

    this.defaultCourse = elementRef.dataset.defaultCourse;
    this.addScheduleButtons = [];

    this._addEventListeners();
    this._setupAddScheduleButton();

    if (this.defaultCourse) {
      this.applyFilter([this.defaultCourse]);
    }
  }

  applyFilter(filters) {
    window.fsAttributes = window.fsAttributes || [];
    window.fsAttributes.push([
      "cmsfilter",
      (filterInstances) => {
        const classScheduleInstance = filterInstances.find(
          (instance) => instance.form.dataset.name == "schedule-filter"
        );

        if (classScheduleInstance == null) {
          return;
        }

        const defaultFilter = new Set();

        filters.forEach((filter) => {
          defaultFilter.add(filter);
        });

        classScheduleInstance.filtersData = [
          {
            filterKeys: ["course-slug"],
            originalFilterKeys: ["course-slug"],
            hightlight: false,
            elements: [],
            values: defaultFilter,
          },
        ];

        classScheduleInstance.applyFilters();
      },
    ]);
  }

  // Private

  _addEventListeners() {
    window.addEventListener("cart-updated", () => {
      this._refreshDisplay();
    });
  }

  _refreshDisplay() {
    this.addScheduleButtons.forEach((button) => button.refreshDisplay());
  }

  _setupAddScheduleButton() {
    this.elementRef
      .querySelectorAll(this.selectors.cartActionWrapper)
      .forEach((wrapper) => {
        const addScheduleButton = new AddScheduleButton(wrapper, this.options);
        this.addScheduleButtons.push(addScheduleButton);
      });
  }
}

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
