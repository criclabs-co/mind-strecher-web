/**
 * Module Name: MultiSelect
 *
 */
class MultiSelect {
  constructor(elementRef) {
    this.elementRef = elementRef;

    this.selectors = {
      selectedLabel: ".filter_dropdown-label",
      selectedValue: ".filter_dropdown-value",
      selectedCountLabel: ".filter_dropdown-selected-count",
    };

    this.selectedLabel = this.elementRef.querySelector(
      this.selectors.selectedLabel
    );
    this.selectedValue = this.elementRef.querySelector(
      this.selectors.selectedValue
    );
    this.selectedCountLabel = this.elementRef.querySelector(
      this.selectors.selectedCountLabel
    );

    this._addEventListeners();
    this._checkDefaultOption();
    this._refreshDisplay();
  }

  // Private

  _addEventListeners() {
    this.elementRef
      .querySelectorAll("input[type='checkbox']")
      .forEach((input) => {
        input.addEventListener("change", () => {
          this._refreshDisplay();
        });
      });
  }

  _checkDefaultOption() {
    this.elementRef
      .querySelectorAll("[data-multi-select-default-selected]")
      .forEach((el) => {
        const option = el.dataset.multiSelectDefaultSelected;
        const checkbox = this.elementRef.querySelector(
          `input[data-value='${option}']`
        );

        if (checkbox) {
          checkbox.checked = true;
          checkbox.previousSibling.classList.add("w--redirected-checked");
        }
      });
  }

  _refreshDisplay() {
    const checkedCheckboxes = this.elementRef.querySelectorAll(
      "input[type='checkbox']:checked"
    );

    if (checkedCheckboxes.length <= 0) {
      this.selectedLabel.style.display = "block";

      this.selectedValue.innerText = "";
      this.selectedValue.style.display = "none";

      this.selectedCountLabel.style.display = "none";
      this.selectedCountLabel.innerText = "0";

      return;
    }

    const label = [];

    checkedCheckboxes.forEach((checkedCheckbox) => {
      const checkboxLabel = checkedCheckbox.nextElementSibling;

      if (checkboxLabel.dataset.shortFormLabel) {
        label.push(checkboxLabel.dataset.shortFormLabel);
      } else {
        label.push(checkboxLabel.innerText);
      }
    });

    this.selectedLabel.style.display = "none";

    this.selectedValue.innerText = label.join(", ");
    this.selectedValue.style.display = "block";

    this.selectedCountLabel.style.display = "flex";
    this.selectedCountLabel.innerText = checkedCheckboxes.length;
  }
}
