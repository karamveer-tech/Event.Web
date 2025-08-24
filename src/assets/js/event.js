$(document).ready(function () {
  const $eventListContainer = $("#event-list");
  let eventsLoadedOnce = false;
  let allEvents = []; // ✅ Store all events for search filtering

  // Load organiser list on page load
  loadOrganisers();

  // Load events initially
  loadEvents();

  // Tab navigation
  $(".tab-link").on("click", function (e) {
    e.preventDefault();
    const tabId = $(this).data("tab");
    $(".tab-content").addClass("hidden");
    $("#" + tabId).removeClass("hidden");
    if (tabId === "events_list" && !eventsLoadedOnce) {
      loadEvents();
      eventsLoadedOnce = true;
    }
  });

  // Load organisers into dropdown
  function loadOrganisers() {
    $.ajax({
      url: `${CONFIG.API_BASE_URL}/api/Organiser/organiser-list`,
      method: "GET",
      dataType: "json",
      success: function (data) {
        const $select = $("#organiserSelect").empty();
        $select.append(`<option value="">Select Organiser</option>`);
        data.forEach((o) => {
          $select.append(`<option value="${o.id}">${o.name}</option>`);
        });
      },
      error: function () {
        console.error("Could not load organiser list.");
      },
    });
  }

  // Submit create event form
  $("#event_form_id").on("submit", async function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    formData.set("start_datetime", toIso(formData.get("start_datetime")));
    formData.set("end_datetime", toIso(formData.get("end_datetime")));
    const $msg = $("#message").text("");

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/api/Event/create-event`, {
        method: "POST",
        body: formData,
      });

      const raw = await response.text();
      const isJson = response.headers.get("content-type")?.includes("application/json");
      const data = isJson ? JSON.parse(raw || "{}") : raw;

      if (response.ok) {
        $msg.text("✅ Event created successfully!").css("color", "green");
        this.reset();
        $("#create_event_model").modal("hide");
        loadEvents(); // refresh list
        eventsLoadedOnce = true;
      } else {
        $msg.text(`❌ Failed: ${data.message || raw}`).css("color", "red");
      }
    } catch (err) {
      $msg.text("❌ Error: " + err.message).css("color", "red");
    }
  });

  // Load and render events
  function loadEvents() {
    $eventListContainer.html('<div class="text-white">Loading events...</div>');

    $.ajax({
      url: `${CONFIG.API_BASE_URL}/api/Event/get-all-events`,
      type: "GET",
      success: function (events) {
        allEvents = events; // ✅ Store globally
        renderEventList(events);
      },
      error: function () {
        $eventListContainer.html(`<div class="text-danger">Error loading events.</div>`);
      },
    });
  }

  // Render event list to DOM
  function renderEventList(events) {
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
            <div class="movie-content mt-3 ">
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
        </div>
      `;

      $eventListContainer.append(html);
    });
  }

  // Search input filtering
  $("#eventSearchInput").on("input", function () {
    const keyword = $(this).val().toLowerCase().trim();

    const filtered = allEvents.filter((event) =>
      (event.title && event.title.toLowerCase().includes(keyword)) ||
      (event.location && event.location.toLowerCase().includes(keyword)) ||
      (event.status && event.status.toLowerCase().includes(keyword))
    );

    renderEventList(filtered);
  });

  // Click to view event details
  $(document).on("click", ".event-card", function () {
    debugger
    const id = $(this).data("id");
    localStorage.setItem("event_Id", id);
    window.location.href = `/event-details`;
  });

  // Utility to format datetime
  function toIso(dateStr) {
    return dateStr ? new Date(dateStr).toISOString() : null;
  }
});
