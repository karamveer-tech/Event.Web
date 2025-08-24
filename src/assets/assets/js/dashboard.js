const tabLinks = document.querySelectorAll('.tab-link');
const tabContents = document.querySelectorAll('.tab-content');

tabLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const tab = link.getAttribute('data-tab');

    tabContents.forEach(content => content.classList.add('hidden'));
    document.getElementById(tab).classList.remove('hidden');
  });
});


$(document).ready(function () {
  let eventsLoaded = false;

  $('.tab-link').click(function (e) {
    e.preventDefault();

    const tabId = $(this).data('tab');

    // Hide all tab content and show the selected one
    $('.tab-content').addClass('hidden');
    $('#' + tabId).removeClass('hidden');

    // Load events only once
    if (tabId === 'events_list' && !eventsLoaded) {
      loadEvents();
      eventsLoaded = true;
    }
  });

  function loadEvents() {
    $.ajax({
      url: `${CONFIG.API_BASE_URL}/api/event/get-all-events`,
      method: 'GET',
      dataType: 'json',
      success: function (data) {
        const $container = $('#eventListContainer');
        $container.empty();

        if (data.length > 0) {
          $.each(data, function (index, event) {
            const eventDate = new Date(event.start_datetime);
            const day = eventDate.getDate();
            const month = eventDate.toLocaleString('default', { month: 'short' });

            const html = `
            <div class="col-sm-6 col-lg-6 mb-4">
              <div class="event-grid border p-3 bg-white text-dark rounded shadow-sm">
                <div class="movie-thumb c-thumb position-relative">
                  <a href="#">
                    <img src="${event.template_path}" alt="event" class="img-fluid rounded">
                  </a>
                  <div class="event-date position-absolute top-0 start-0 bg-primary text-white p-2 text-center">
                    <h6 class="date-title m-0">${day}</h6>
                    <span class="small">${month}</span>
                  </div>
                </div>
                <div class="movie-content mt-3">
                  <h5 class="title m-0">
                    <a href="#" class="text-decoration-none text-dark">${event.title}</a>
                  </h5>
                  <div class="movie-rating-percent mt-2 d-flex justify-content-between">
                    <div>
                      <i class="fa fa-map-marker-alt me-1"></i>
                      <span>${event.location}</span>
                    </div>
                    <div>
                      <i class="fa fa-shopping-cart me-1"></i>
                      <span>${event.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>`;

            $container.append(html);
          });
        } else {
          $container.append(`<div class="text-white py-2">No events found.</div>`);
        }
      },
      error: function () {
        $('#eventListContainer').html(`<div class="text-danger py-2">Error loading events.</div>`);
      }
    });
  }
});