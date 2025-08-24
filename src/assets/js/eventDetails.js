   let countdownInterval;

  $(document).ready(function () {
    debugger
    const eventId = localStorage.getItem('event_Id');
    if (!eventId) {
      return;
    }

    $.ajax({
      url: `${CONFIG.API_BASE_URL}/api/Event/get-event-by-id/${eventId}`,
      method: 'GET',
      success: function (event) {
        $('.title.bold span').text(event.title || 'Event');
        $('.event-about-thumb img').attr('src', event.template_path || 'img/event/event-about.jpg');
        $('.event-about-content .title span').text(new Date(event.start_datetime).getFullYear());
        $('.event-about-content p:first').text(event.description || 'No description available.');
        $('.event-about-content p:last').text(event.speaker_note || '');

        $('.banner-bg').css({
          'background-image': `url('${event.template_path || '/assets/img/banner/banner-event.jpg'}')`,
          'background-repeat': 'no-repeat',
          'background-size': 'cover',
          'background-position': 'center center'
        });

        const startDate = new Date(event.start_datetime);
        const endDate = new Date(event.end_datetime);

        if (isNaN(endDate.getTime())) {
          console.error('Invalid end date from API:', event.end_datetime);
          return;
        }
console.log("Parsed target date (local):", new Date(event.end_datetime));
console.log("Parsed target date (UTC):", new Date(event.end_datetime + 'Z'));

        updateCountdown(endDate);

        const durationDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        const weekday = startDate.toLocaleDateString('en-US', { weekday: 'long' }) + '-' +
                        endDate.toLocaleDateString('en-US', { weekday: 'long' });
        $('.contact-side .item-content span.up').first().text(`${durationDays} Days (${weekday})`);
        $('.contact-side .item-content span').eq(1).text(event.workshops || 'Workshops');

        const locationParts = (event.location || '').split(',');
        $('.contact-side .item').eq(1).find('.item-content span.up').text(locationParts[0] || '');
        $('.contact-side .item').eq(1).find('.item-content span').last().text(locationParts[1] || '');

        $('.contact-side .item').eq(2).find('a').text(event.phone || '');
        $('.contact-side .item').eq(2).find('a').attr('href', `tel:${event.phone}`);
      },
      error: function () {
        alert("Failed to load event details.");
      }
    });
  });

//   function updateCountdown(targetDateString) {
//   const $days = $('.countdown .days');
//   const $hours = $('.countdown .hours');
//   const $minutes = $('.countdown .minutes');
//   const $seconds = $('.countdown .seconds');

//   if (countdownInterval) clearInterval(countdownInterval);

//   const targetDate = new Date(targetDateString); // Use as-is, no 'Z'

//   const countdown = () => {
//     const now = new Date().getTime();
//     const distance = targetDate.getTime() - now;

//     if (distance <= 0) {
//       $('.countdown').html('<span class="expired-msg">This event has already started.</span>');
//       clearInterval(countdownInterval);
//       return;
//     }

//     const days = Math.floor(distance / (1000 * 60 * 60 * 24));
//     const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//     const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//     const seconds = Math.floor((distance % (1000 * 60)) / 1000);

//     $days.text(days.toString().padStart(2, '0'));
//     $hours.text(hours.toString().padStart(2, '0'));
//     $minutes.text(minutes.toString().padStart(2, '0'));
//     $seconds.text(seconds.toString().padStart(2, '0'));
//   };

//   countdown();
//   console.log("⏳ updateCountdown called with:", targetDateString);

//   countdownInterval = setInterval(countdown, 1000);
// }


  document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('manageTicketsModal');
    const openBtn = document.getElementById('manageTicketsBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelModalBtn');
    const addMoreBtn = document.getElementById('addMoreBtn');
    const ticketContainer = document.getElementById('ticketGroupContainer');
    const form = document.getElementById('manageTicketsForm');

    if (!modal || !openBtn || !closeBtn || !cancelBtn || !addMoreBtn || !ticketContainer || !form) {
      console.warn("Modal elements not found.");
      return;
    }

    // Show/hide modal
    const closeModal = () => modal.style.display = 'none';
    openBtn.addEventListener('click', () => modal.style.display = 'flex');
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Add ticket group
    addMoreBtn.addEventListener('click', () => {
      const group = document.createElement('div');
      group.className = 'ticket-group';
      group.innerHTML = `
        <input type="text" placeholder="Ticket Type" name="ticketType[]" required>
        <input type="number" placeholder="Price" name="ticketPrice[]" required>
        <input type="number" placeholder="Quantity" name="ticketCount[]" required>
        <button type="button" class="remove-btn">Remove</button>
      `;
      ticketContainer.appendChild(group);
    });

    // Remove ticket group
    ticketContainer.addEventListener('click', function (e) {
      if (e.target.classList.contains('remove-btn')) {
        e.target.parentElement.remove();
      }
    });

    // Submit tickets
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const eventId = parseInt(localStorage.getItem('event_Id'), 10);
      if (!eventId) {
        alert("Missing event ID.");
        return;
      }

      const ticketGroups = document.querySelectorAll('#ticketGroupContainer .ticket-group');
      let hasError = false;
      let ticketDataList = [];

      ticketGroups.forEach(group => {
        const ticketType = group.querySelector('input[name="ticketType[]"]').value.trim();
        const ticketPrice = parseFloat(group.querySelector('input[name="ticketPrice[]"]').value);
        const ticketCount = parseInt(group.querySelector('input[name="ticketCount[]"]').value, 10);

        if (!ticketType || isNaN(ticketPrice) || isNaN(ticketCount)) {
          hasError = true;
          return;
        }

        ticketDataList.push({
          id: 0,
          ticket_type_name: ticketType,
          ticket_price: ticketPrice,
          event_id: eventId,
          no_of_tickets: ticketCount
        });
      });

      if (hasError) {
        alert('Please fill in all ticket fields correctly.');
        return;
      }

      ticketDataList.forEach(ticketData => {
        $.ajax({
          url: `${CONFIG.API_BASE_URL}/api/Event/add-ticket-type`,
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(ticketData),
          success: function () {
            console.log(`Ticket "${ticketData.ticket_type_name}" added.`);
          },
          error: function (xhr) {
            console.error(`Error adding ticket "${ticketData.ticket_type_name}":`, xhr.responseText);
          }
        });
      });

      alert('Tickets submitted successfully!');
      closeModal();
    });

    // ✅ Book ticket button logic (moved outside submit)
    $('#book_tickets_button_one, #book_tickets_button_two').on('click', function () {
      const token = localStorage.getItem('auth_token');
      const redirectUrl = "/event-checkout";

      if (token && token !== "undefined") {
        localStorage.setItem('redirect_url', '');
        window.location.href = redirectUrl;
      } else {
        localStorage.setItem('redirect_url', redirectUrl);
        window.location.href = "/login";
      }
    });
  }); 