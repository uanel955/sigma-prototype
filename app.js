const screens = [...document.querySelectorAll(".user-phone [data-screen]")];
const navButtons = [...document.querySelectorAll("[data-screen-trigger]")];
const serviceButtons = [...document.querySelectorAll("[data-service-title]")];
const campaignButtons = [...document.querySelectorAll("[data-campaign-offer]")];

function setScreen(screenName) {
  screens.forEach((screen) => {
    const isActive = screen.dataset.screen === screenName;
    screen.classList.toggle("is-active", isActive);
    if (isActive) screen.scrollTop = 0;
  });

  navButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.screenTrigger === screenName);
  });
}

function setText(selector, value) {
  document.querySelectorAll(selector).forEach((node) => {
    node.textContent = value;
  });
}

document.querySelectorAll("[data-go]").forEach((button) => {
  button.addEventListener("click", () => setScreen(button.dataset.go));
});

navButtons.forEach((button) => {
  button.addEventListener("click", () => setScreen(button.dataset.screenTrigger));
});

document.querySelectorAll(".choice-group button").forEach((button) => {
  button.addEventListener("click", () => {
    button.parentElement.querySelectorAll("button").forEach((item) => item.classList.remove("is-selected"));
    button.classList.add("is-selected");
  });
});

serviceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    serviceButtons.forEach((item) => item.classList.toggle("is-selected", item === button));
    setText("[data-selected-service], [data-booking-service], [data-next-service]", button.dataset.serviceTitle);
    setText("[data-selected-service-meta]", button.dataset.serviceMeta);
    setText("[data-selected-service-price], [data-booking-price]", button.dataset.servicePrice);
    setText("[data-booking-meta]", button.dataset.serviceMeta.split(",")[0]);
  });
});

campaignButtons.forEach((button) => {
  button.addEventListener("click", () => {
    campaignButtons.forEach((item) => item.classList.toggle("is-selected", item === button));
    setText("[data-user-campaign], [data-campaign-offer-label]", button.dataset.campaignOffer);
  });
});
