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
