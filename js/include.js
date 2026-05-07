document.addEventListener("DOMContentLoaded", function() {
  // fetch header
  fetch("components/header.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("header").innerHTML = data;
      // Trigger the scroll event to apply the correct navbar background immediately on load
      window.dispatchEvent(new Event('scroll'));
    });

  // fetch footer
  fetch("components/footer.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("footer").innerHTML = data;
    });
});
