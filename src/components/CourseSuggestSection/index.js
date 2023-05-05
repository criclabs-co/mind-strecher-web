/**
 * Module Name: CourseSuggestSection
 *
 * Depedency Modules:
 *  - CartAdapter
 */
class CourseSuggestSection {
  constructor(elementRef) {
    this.elementRef = elementRef;
    this.selectors = {
      courseRoadmapList: ".levels-program_wrapper",
      courseList: ".course-suggest_wrapper",
    };

    this.courseRoadmapList = this.elementRef.querySelector(
      this.selectors.courseRoadmapList
    );
    this.courseList = this.elementRef.querySelector(this.selectors.courseList);

    this._addEventListeners();
    this._refreshDisplay();
    this._refreshCourseSuggestion();
  }

  // Private

  _addEventListeners() {
    window.addEventListener("cart-updated", () => {
      this._refreshDisplay();
      this._refreshCourseSuggestion();
    });
  }

  _refreshDisplay() {
    if (CartAdapter.listCartItems().length > 0) {
      this.courseList.style.display = "block";
      this.courseRoadmapList.style.display = "none";
    } else {
      this.courseList.style.display = "none";
      this.courseRoadmapList.style.display = "block";
    }
  }

  _refreshCourseSuggestion() {
    window.fsAttributes = window.fsAttributes || [];
    window.fsAttributes.push([
      "cmsfilter",
      (filterInstances) => {
        const courseSuggestInstance = filterInstances.find(
          (instance) => instance.form.dataset.name == "course-suggest"
        );

        const filter = new Set();
        const cartItems = CartAdapter.listCartItems();

        if (cartItems.length > 0) {
          cartItems.forEach((item) => {
            console.log(item);
            item.attr.levels.forEach((level) => {
              filter.add(level);
            });
          });
        } else {
          filter.add("EMPTY_SUGGESTION");
        }

        courseSuggestInstance.filtersData = [
          {
            filterKeys: ["level-slug"],
            originalFilterKeys: ["level-slug"],
            hightlight: false,
            elements: [],
            values: filter,
          },
        ];

        courseSuggestInstance.applyFilters();
      },
    ]);
  }
}
