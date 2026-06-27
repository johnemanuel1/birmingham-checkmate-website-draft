const bookingForm = document.querySelector("#booking-form");

if (bookingForm) {
  const submitButton = document.querySelector("#booking-submit");
  const formStatus = document.querySelector("#form-status");
  const successPanel = document.querySelector("#booking-success");

  bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!bookingForm.reportValidity()) {
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending Enquiry...";
    formStatus.classList.remove("error");
    formStatus.textContent = "Please wait while we send your enquiry.";

    try {
      const response = await fetch("https://formsubmit.co/ajax/birmingham_checkmate@outlook.com", {
        method: "POST",
        headers: {
          Accept: "application/json"
        },
        body: new FormData(bookingForm)
      });

      const result = await response.json();

      if (!response.ok || result.success === "false" || result.success === false) {
        throw new Error("The hosted form service did not accept the enquiry.");
      }

      bookingForm.reset();
      bookingForm.hidden = true;
      successPanel.hidden = false;
      successPanel.focus();
    } catch (error) {
      formStatus.classList.add("error");
      formStatus.textContent = "The form service could not send this enquiry. If this is the first test, please approve the FormSubmit activation email in the club Outlook inbox, then try again.";
      submitButton.disabled = false;
      submitButton.textContent = "Send Booking Enquiry";
    }
  });
}
