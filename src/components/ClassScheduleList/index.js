/**
 * Module Name: ClassScheduleList
 *
 * Depedency Modules:
 *  - CartAdapter
 *  - @finsweet/attributes-cmsfilter
 *  - @finsweet/attributes-cmsload
 */
class ClassScheduleList {
  constructor(elementRef, options = {}) {
    const DEFAULT_OPTIONS = { refreshCartDisplay: true };

    this.elementRef = elementRef;
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.selectors = {
      cartActionWrapper: ".class-schedule_add-wrapper",
      clearDefaultFilterBtn: "[data-class-schedule-list-clear-default]",
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
        this.classScheduleInstance = filterInstances.find(
          (instance) => instance.form.dataset.name == "schedule-filter"
        );

        if (this.classScheduleInstance == null) {
          return;
        }

        const defaultFilter = new Set();

        filters.forEach((filter) => {
          defaultFilter.add(filter);
        });

        this.classScheduleInstance.filtersData.push({
          filterKeys: ["course-slug"],
          originalFilterKeys: ["course-slug"],
          hightlight: false,
          elements: [],
          values: defaultFilter,
        });

        this.classScheduleInstance.applyFilters();
      },
    ]);
  }

  // Private

  _addEventListeners() {
    window.addEventListener("cart-updated", () => {
      this._refreshDisplay();
    });

    const clearDefaultFilterBtn = document.querySelector(
      this.selectors.clearDefaultFilterBtn
    );

    if (clearDefaultFilterBtn) {
      clearDefaultFilterBtn.addEventListener("click", () => {
        this._clearDefaultFilter();
      });
    }
  }

  _refreshDisplay() {
    this.addScheduleButtons.forEach((button) => button.refreshDisplay());
  }

  _clearDefaultFilter() {
    this.classScheduleInstance.filtersData =
      this.classScheduleInstance.filtersData.filter(
        (filter) => filter.filterKeys[0] != "course-slug"
      );
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
