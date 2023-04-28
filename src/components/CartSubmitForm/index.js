/**
 * Module Name: CartSubmitForm
 *
 * Depedency Modules:
 *  - CartAdapter
 *  - intl-tel-input
 */
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
