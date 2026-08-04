const text = "Full-Stack Developer • Java Programmer • AI Prompt Engineer";
let i = 0;

function typeEffect() {
  if (i < text.length) {
    document.getElementById("typing").innerHTML += text.charAt(i);
    i++;
    setTimeout(typeEffect, 100);
  }
}

typeEffect();
// ===== CONTACT FORM ALERTS =====

const params = new URLSearchParams(window.location.search);
const alertBox = document.getElementById("formAlert");

if (alertBox) {

  if (params.get("sent")) {
    alertBox.innerHTML = `
      <div class="alert alert-success alert-dismissible fade show rounded-4 shadow-sm" role="alert">
        <strong>Success!</strong> Your message has been sent successfully.
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;
  }

  if (params.get("error")) {
    alertBox.innerHTML = `
      <div class="alert alert-danger alert-dismissible fade show rounded-4 shadow-sm" role="alert">
        <strong>Error!</strong> Could not send your message. Please try again later.
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;
  }
}