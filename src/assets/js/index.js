$(document).ready(function () {
  const $eventListContainer = $("#eventListContainer");
  let allEvents = []; // Store all events globally for search

  // Load events on page load
  loadEvents();

  // Search input filter
  $("#eventSearchInput").on("input", function () {
    const keyword = $(this).val().toLowerCase().trim();

    const filtered = allEvents.filter((event) =>
      (event.title && event.title.toLowerCase().includes(keyword)) ||
      (event.location && event.location.toLowerCase().includes(keyword)) ||
      (event.status && event.status.toLowerCase().includes(keyword))
    );

    renderEventList(filtered);
  });
});

// Store clicked event ID

  

function loadEvents() {
  const $eventListContainer = $('#eventListContainer');
  $eventListContainer.html('<div class="text-white">Loading events...</div>');

  $.ajax({
    url: `${CONFIG.API_BASE_URL}/api/Event/get-all-events`,
    type: "GET",
    success: function (events) {
      allEvents = events; // Store globally
      renderEventList(events);
    },
    error: function () {
      $eventListContainer.html(`<div class="text-danger">Error loading events.</div>`);
    },
  });
}

function renderEventList(events) {
  const $eventListContainer = $('#eventListContainer');
  $eventListContainer.empty();

  if (!Array.isArray(events) || events.length === 0) {
    $eventListContainer.append(`<div class="text-white">No events found.</div>`);
    return;
  }

  events.forEach((event) => {
    const eventDate = new Date(event.start_datetime);
    const day = eventDate.getDate();
    const month = eventDate.toLocaleString("default", { month: "short" });

    const html = `
<div class="col-sm-6 col-lg-6 mb-4">
          <div class="event-grid border p-3 bg-white text-dark rounded shadow-sm h-100 event-card" data-id="${event.id}" style="cursor: pointer;">
            <div class="movie-thumb c-thumb position-relative">
              <img src="${event.template_path}" alt="event" class="img-fluid rounded w-100">
              <div class="event-date position-absolute top-0 start-0 bg-primary text-white p-2 text-center" style="z-index: 1;">
                <h6 class="date-title m-0">${day}</h6>
                <span class="small">${month}</span>
              </div>
            </div>
            <div class="movie-content mt-3 text-dark">
              <h5 class="title m-0 text-dark">${event.title}</h5>
              <div class="movie-rating-percent mt-2 d-flex justify-content-between flex-wrap">
                <div class="me-2">
                  <h6 class="m-0 text-dark"><i class="text-dark fa fa-map-marker-alt me-1"></i> ${event.location}</h6>
                </div>
                <div>
                  <h6 class="m-0 text-dark"><i class="text-dark fa fa-shopping-cart me-1"></i> ${event.status}</h6>
                </div>
              </div>
            </div>
          </div>
        </div>    `;

    $eventListContainer.append(html);
  });
  // Click to view event details
  $(document).on("click", ".event-card", function () {
    
    const id = $(this).data("id");
    localStorage.setItem("event_Id", id);
    window.location.href = `/event-details`;
  });
}
