/**
 * Module Name: AccordionsComponent
 *
 */
class AccordionsComponent {
  constructor(elementRef) {
    this.elementRef = elementRef;
    this.component = this._convertedComponentFromRichText();

    elementRef.replaceWith(this.component);
  }

  // Private

  _convertedComponentFromRichText() {
    const component = this._createElement("div", "accordions");

    const headers = this.elementRef.querySelectorAll("h1, h2, h3, h4, h5, h6");

    headers.forEach((header) => {
      const accordion = this._createElement("div", "accordion_component");

      const headerText = header.textContent.trim();
      const accordionHeader = this._createElement("div", "accordion_header");

      const headerTitle = this._createElement("div", "accordion_header-title");
      headerTitle.textContent = headerText;
      accordionHeader.appendChild(headerTitle);

      if (headerText.toLowerCase().startsWith("[bonus]")) {
        headerTitle.textContent = headerText.replace(/^\[bonus\]\s*/i, "");

        const bonusSpan = this._createElement("span", "bonus_span");
        bonusSpan.textContent = "Bonus";
        accordionHeader.appendChild(bonusSpan);
      }

      const accordionIcon = this._createElement("div", "accordion_icon");
      accordionHeader.appendChild(accordionIcon);

      const accordionContent = this._createElement("div", "accordion_content");

      let next = header.nextElementSibling;
      while (next && !/^H\d$/.test(next.tagName)) {
        accordionContent.appendChild(next);
        next = header.nextElementSibling;
      }

      accordion.appendChild(accordionHeader);
      accordion.appendChild(accordionContent);

      component.appendChild(accordion);
    });

    return component;
  }

  _createElement(tag, className) {
    const element = document.createElement(tag);
    element.classList.add(className);

    return element;
  }
}
