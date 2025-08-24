$(document).ready(function () {
  var ticketIndex = 1;
  let eventsLoaded = false;
  let pendingEventUpdate = null;
  let allEvents = []; // Store all events globally

  $(".tab-link").click(function (e) {
    e.preventDefault();
    const tabId = $(this).data("tab");
    $(".tab-content").addClass("hidden");
    $("#" + tabId).removeClass("hidden");

    if (tabId === "events_list" && !eventsLoaded) {
      loadEvents();
      eventsLoaded = true;
    }
  });

  function loadEvents() {
    const $container = $("#eventListContainer");
    $container.html(`<div class="text-white py-2">Loading events...</div>`);

    $.ajax({
      url: `${CONFIG.API_BASE_URL}/api/event/get-all-events?ts=${Date.now()}`,
      method: "GET",
      dataType: "json",
      success: function (data) {
        allEvents = data;
        console.log("🎯 Events loaded:", data);
        renderEvents(data);
      },
      error: function () {
        $container.html(
          `<div class="text-danger py-2">Error loading events.</div>`
        );
      },
    });
  }
  $("#eventSearchInput").on("input", function () {
    const keyword = $(this).val().toLowerCase();

    const filtered = allEvents.filter(
      (event) =>
        (event.title && event.title.toLowerCase().includes(keyword)) ||
        (event.location && event.location.toLowerCase().includes(keyword)) ||
        (event.status && event.status.toLowerCase().includes(keyword))
    );

    renderEvents(filtered);
  });

  function renderEvents(events) {
    const $container = $("#eventListContainer");
    $container.empty();

    if (events.length === 0) {
      $container.html(`<div class="text-white py-2">No events found.</div>`);
      return;
    }

    events.forEach((event) => {
      const eventDate = new Date(event.start_datetime);
      const day = eventDate.getDate();
      const month = eventDate.toLocaleString("default", { month: "short" });

      const html = `
        <div class="event-card w-[900px]" data-id="${event.id}">
          <div class="  border p-3 bg-white text-dark rounded shadow-sm">
            <div class="movie-thumb c-thumb position-relative">
              <img src="${event.template_path}" alt="event" class="img-fluid h-[500px] rounded">
              <div class="event-date position-absolute top-0 start-0 bg-primary text-white p-2 text-center">
                <h6 class="date-title m-0">${day}</h6>
                <span class="small">${month}</span>
              </div>
            </div>
            <div class="movie-content w-[400px] mt-3">
              <h5 class="title m-0">
                <span class="text-dark">${event.title}</span>
              </h5>
              <div class="movie-rating-percent mt-2 d-flex justify-content-between flex-wrap">
                <div><i class="fa fa-map-marker-alt me-1"></i> ${event.location}</div>
                <div><i class="fa fa-shopping-cart me-1"></i> ${event.status}</div>
                <div class="mt-2 text-end w-[800px] pr-5 flex">
                  <button class="btn btn-primary w-[200px]  manage-events-btn me-1" data-id="${event.id}">Manage Event</button>
                  <button class="btn btn-primary w-[200px]  view-details-btn me-1" data-id="${event.id}">View</button>
                  <button class="btn btn-success w-[200px]  edit-btn me-1" data-id="${event.id}">Edit</button>
                  <button class="btn btn-danger  w-[200px] delete-btn" data-id="${event.id}">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>`;
      $container.append(html);
    });
  }

 function loadEventForm(eventId, enableEdit = false) {
  const $content = $("#eventDetailContent");
  $content.html(`<div class="text-center py-3 text-white">Loading...</div>`);

  $.ajax({
    url: `${CONFIG.API_BASE_URL}/api/Event/get-event-by-id/${eventId}`,
    method: "GET",
    dataType: "json",
    success: function (event) {
      const eventDate = new Date(event.start_datetime)
        .toISOString()
        .slice(0, 16);

      const formHtml = `
        <form id="eventForm">
          <div class="movie-thumb c-thumb position-relative mb-3">
            <img src="${event.template_path}" alt="event" class="img-fluid rounded">
          </div>
          <div class="mb-3">
            <label class="form-label text-white">Title</label>
            <input type="text" class="form-control" name="title" value="${event.title}" ${enableEdit ? "" : "disabled"}>
          </div>
          <div class="mb-3">
            <label class="form-label text-white">Date & Time</label>
            <input type="datetime-local" class="form-control" name="start_datetime" value="${eventDate}" ${enableEdit ? "" : "disabled"}>
          </div>
          <div class="mb-3">
            <label class="form-label text-white">Location</label>
            <input type="text" class="form-control" name="location" value="${event.location}" ${enableEdit ? "" : "disabled"}>
          </div>
          <div class="mb-3">
            <label class="form-label text-white">Status</label>
            <input type="text" class="form-control" name="status" value="${event.status}" ${enableEdit ? "" : "disabled"}>
          </div>
          <div class="mb-3">
            <label class="form-label text-white">Description</label>
            <textarea class="form-control" name="description" rows="3" ${enableEdit ? "" : "disabled"}>${event.description || ""}</textarea>
          </div>
        </form>`;

      $content.html(formHtml);

      $("#saveEventBtn")
        .data("id", event.id)
        .toggleClass("hidden", !enableEdit); // hide if not editable

      openModal("eventDetailModal"); // ⬅️ Use custom open function
    },
    error: function () {
      $content.html(`<div class="text-danger py-2">Failed to load event details.</div>`);
    }
  });
} 
  function showToast(message, type = "success") {
    const toastId = `toast-${Date.now()}`;
    const icon = type === "success" ? "✅" : "❌";
    const bgClass = type === "success" ? "bg-success" : "bg-danger";

    const toastHtml = `
      <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0 mb-2" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">${icon} ${message}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>`;

    const $toast = $(toastHtml);
    $("#toastContainer").append($toast);
    const toastElement = new bootstrap.Toast($toast[0], { delay: 4000 });
    toastElement.show();
    $toast.on("hidden.bs.toast", () => $toast.remove());
  }

  // View Event
  $("#eventListContainer").on("click", ".view-details-btn", function (e) {
    e.preventDefault();
    e.stopPropagation();
    loadEventForm($(this).data("id"), false);
  });

  // Edit Event
  $("#eventListContainer").on("click", ".edit-btn", function (e) {
    e.preventDefault();
    e.stopPropagation();
    loadEventForm($(this).data("id"), true);
  });

  // Save edited event
  $("#saveEventBtn").click(function () {
    const eventId = $(this).data("id");
    const formData = $("#eventForm").serializeArray();
    const updatedEvent = { id: eventId };

    formData.forEach((field) => {
      updatedEvent[field.name] = field.value;
    });

    pendingEventUpdate = updatedEvent;
    $("#confirmSaveModal").modal("show");
  });

  // Confirm Save
  $("#confirmSaveBtn").click(function () {
    if (!pendingEventUpdate) return;

    $.ajax({
      url: `${CONFIG.API_BASE_URL}/api/Event/update-event`,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(pendingEventUpdate),
      success: function () {
        $("#confirmSaveModal").modal("hide");
        $("#eventDetailModal").modal("hide");
        showToast("Event updated successfully.", "success");
        pendingEventUpdate = null;
        setTimeout(() => renderEvents(allEvents), 300); // Avoid full reload if possible
      },
      error: function (xhr) {
        $("#confirmSaveModal").modal("hide");
        showToast(
          "Error updating event: " + (xhr.responseText || "Unknown error"),
          "error"
        );
      },
    });
  });

  // Delete Event
  $; // Delete Event
  $("#eventListContainer").on("click", ".delete-btn", function (e) {
    e.preventDefault(); // Prevent default behavior (if it's inside a link, for example)
    e.stopPropagation(); // Prevent bubbling to parent .event-card

    const eventId = $(this).data("id");

    if (confirm("Are you sure you want to delete this event?")) {
      $.ajax({
        url: `${CONFIG.API_BASE_URL}/api/Event/delete-event/${eventId}`,
        method: "DELETE",
        success: function () {
          showToast("Event deleted successfully.", "success");

          allEvents = allEvents.filter((event) => event.id != eventId);
          renderEvents(allEvents);
        },
        error: function (xhr) {
          showToast(
            "Error deleting event: " + (xhr.responseText || xhr.statusText),
            "error"
          );
        },
      });
    }
  });

  // Open Manage Event Modal
  $("#eventListContainer").on("click", ".manage-events-btn", function (e) {
    e.preventDefault();
    e.stopPropagation();

  const eventId = $(this).data("id");
  $("#manageEventForm").data("event-id", eventId); // store if needed for later
  $("#manageEventModal").modal("show");
});

// Add more input groups
$("#manageEventForm").on("click", ".add-more-btn", function () {
  const newInputGroup = `
    <div class="input-group mb-3 d-flex gap-2"> 
     <input type="text" class="form-control bg-light text-dark" style="min-width: 40px;" name="field1[]" placeholder=" Ticket Type">
      <input type="text" class="form-control bg-light text-dark" style="min-width: 40px;" name="field2[]" placeholder="Ticket Price">
      <input type="text" class="form-control bg-light text-dark" style="min-width: 40px;" name="field3[]" placeholder="No. of Ticket">
      <button type="button" class="btn btn-outline-danger remove-group-btn">-</button>
    </div>`;
  $("#inputGroupContainer").append(newInputGroup);
});

// Remove input group
$("#manageEventForm").on("click", ".remove-group-btn", function () {
  $(this).closest(".input-group").remove();
});

// Handle submit
$("#manageEventForm").on("submit", function (e) {
  e.preventDefault();
  const eventId = $(this).data("event-id");
  const formData = $(this).serializeArray();

  // TODO: Send to server via AJAX if needed
  showToast("Manage form submitted!", "success");
  $("#manageEventModal").modal("hide");
});


    // Redirect on card click
  $("#eventListContainer").on("click", ".event-card", function (e) {
    if (!$(e.target).closest("button").length) {
      const eventId = $(this).data("id");
      if (eventId) {
        window.location.href = `/event/${eventId}`;
      }
    }
  });
  $(document).on('click', '.close-btn', function () {
  $('#eventDetailModal').addClass('hidden');
});

 function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add("hidden");
    }
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove("hidden");
    }
  }   
});
