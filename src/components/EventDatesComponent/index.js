/**
 * Module Name: EventDatesComponent
 *
 */
class EventDatesComponent {
  constructor(elementRef) {
    this.elementRef = elementRef;
    this.component = this._convertedComponentFromRichText();
    this._addSeeMoreAndNextButtonIfNeeded();

    elementRef.replaceWith(this.component);
  }

  // Private

  _convertedComponentFromRichText() {
    const headerElements = this.elementRef.querySelectorAll(
      "h1, h2, h3, h4, h5, h6"
    );

    let currentContainer, currentCardsContainer;

    const component = document.createElement("div");
    component.classList.add("event-dates_component");

    headerElements.forEach((header) => {
      if (header.tagName === "H1") {
        currentContainer = this._createElement("div", "event-dates_container");
        component.appendChild(currentContainer);

        const headerDiv = this._createElement("div", "event-dates_header");
        let headerText = header.textContent.trim();
        currentContainer.appendChild(headerDiv);

        if (headerText.toLowerCase().startsWith("[bonus]")) {
          headerText = headerText.replace(/^\[bonus\]\s*/i, "");
          const bonusSpan = this._createElement("span", "bonus_span");
          bonusSpan.textContent = "Bonus";
          headerDiv.appendChild(bonusSpan);
        }

        headerDiv.appendChild(document.createTextNode(headerText));

        const cardsWrapper = this._createElement(
          "div",
          "event-date-cards_wrapper"
        );
        currentContainer.appendChild(cardsWrapper);

        currentCardsContainer = this._createElement(
          "div",
          "event-date-cards_container"
        );
        cardsWrapper.appendChild(currentCardsContainer);
      } else {
        const card = this._createElement("div", "event-date-card");
        currentCardsContainer.appendChild(card);

        const titleDiv = this._createElement("div", "event-date-card_title");
        titleDiv.textContent = header.textContent.trim();
        card.appendChild(titleDiv);

        let nextElement = header.nextElementSibling;
        while (nextElement && !nextElement.tagName.startsWith("H")) {
          if (nextElement.tagName === "UL") {
            [...nextElement.querySelectorAll("li")]
              .map((list, index) =>
                this._convertListItemToCardInfo(list, index)
              )
              .forEach((cardInfo) => card.appendChild(cardInfo));
          }

          nextElement = nextElement.nextElementSibling;
        }
      }
    });

    return component;
  }

  _convertListItemToCardInfo(item, index) {
    const cardInfo = this._createElement("div", "event-date-card_info");

    if (index === 0) {
      cardInfo.appendChild(this._createCalendarIcon());
      cardInfo.style.fontWeight = "bold";
    } else if (index === 1) {
      cardInfo.appendChild(this._createClockIcon());
    }

    const itemText = item.textContent.trim();
    cardInfo.appendChild(document.createTextNode(itemText));

    return cardInfo;
  }

  _createElement(tag, className) {
    const element = document.createElement(tag);
    element.classList.add(className);

    return element;
  }

  _createSeeMore(onClick) {
    const wrapper = this._createElement("div", "see-more-wrapper");
    const link = this._createElement("a", "see-more_link");
    link.textContent = "see more";
    link.href = "#";
    link.onclick = onClick;

    const img = this._createElement("img", "icon-1x1-small");
    img.classList.add("is-see-more");
    img.srcset =
      "https://global-uploads.webflow.com/63ff2246a302e50a37a20ae4/64593835f0622152cffe10e8_chevron-down.svg";

    wrapper.appendChild(link);
    link.appendChild(img);

    return wrapper;
  }

  _createCalendarIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("icon-1x1-small");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.innerHTML = `
          <g clip-path="url(#clip0_1327_21766)">
            <path d="M17 3H21C21.2652 3 21.5196 3.10536 21.7071 3.29289C21.8946 3.48043 22 3.73478 22 4V20C22 20.2652 21.8946 20.5196 21.7071 20.7071C21.5196 20.8946 21.2652 21 21 21H3C2.73478 21 2.48043 20.8946 2.29289 20.7071C2.10536 20.5196 2 20.2652 2 20V4C2 3.73478 2.10536 3.48043 2.29289 3.29289C2.48043 3.10536 2.73478 3 3 3H7V1H9V3H15V1H17V3ZM20 9V5H17V7H15V5H9V7H7V5H4V9H20ZM20 11H4V19H20V11ZM6 13H11V17H6V13Z" fill="#191919"/>
          </g>
          <defs>
            <clipPath id="clip0_1327_21766">
              <rect width="24" height="24" fill="white"/>
            </clipPath>
          </defs>
          `;

    return svg;
  }

  _createClockIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("icon-1x1-small");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("role", "img");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "currentColor");
    svg.innerHTML = `
          <title>Time icon</title>
          <path d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM12 20C14.1217 20 16.1566 19.1571 17.6569 17.6569C19.1571 16.1566 20 14.1217 20 12C20 9.87827 19.1571 7.84344 17.6569 6.34315C16.1566 4.84285 14.1217 4 12 4C9.87827 4 7.84344 4.84285 6.34315 6.34315C4.84285 7.84344 4 9.87827 4 12C4 14.1217 4.84285 16.1566 6.34315 17.6569C7.84344 19.1571 9.87827 20 12 20ZM13 12H17V14H11V7H13V12Z"/>
          `;

    return svg;
  }

  _createNextButton() {
    const link = this._createElement("a", "event-date_next-button");
    link.href = "#";

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("icon-1x1-small");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.innerHTML = `
          <g clip-path="url(#clip0_396_1289)">
            <path d="M13.1722 12L8.22217 7.04999L9.63617 5.63599L16.0002 12L9.63617 18.364L8.22217 16.95L13.1722 12Z" fill="currentColor"></path>
          </g>
          <defs>
            <clipPath id="clip0_396_1289">
              <rect width="24" height="24" fill="white"></rect>
            </clipPath>
          </defs>
          `;
    link.appendChild(svg);

    return link;
  }

  _addSeeMoreAndNextButtonIfNeeded() {
    this.component
      .querySelectorAll(".event-date-cards_wrapper")
      .forEach((wrapper) => {
        const container = wrapper.querySelector(".event-date-cards_container");
        if (container && container.scrollWidth > container.clientWidth) {
          const nextButton = this._createNextButton(container);
          nextButton.onclick = (e) => {
            e.preventDefault();
            container.scrollBy({ top: 0, left: 260, behavior: "smooth" });
          };
          wrapper.appendChild(nextButton);

          const onClickSeeMore = (e) => {
            e.preventDefault();
            if (container.classList.contains("is-expanded")) {
              container.classList.remove("is-expanded");
              nextButton.style.display = "flex";
              e.target.childNodes[0].nodeValue = "see more";
              e.target.childNodes[1].style.transform = "rotate(0deg)";
            } else {
              container.classList.add("is-expanded");
              nextButton.style.display = "none";
              e.target.childNodes[0].nodeValue = "see less";
              e.target.childNodes[1].style.transform = "rotate(180deg)";
            }
          };

          wrapper.parentElement.appendChild(
            this._createSeeMore(onClickSeeMore)
          );
        }
      });
  }
}
