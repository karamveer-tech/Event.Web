$(document).ready(function () {
  // Static tickets list (instead of API)
  const ticketTypes = [
    { ticket_type_name: "Gold", ticket_price: 120, no_of_tickets: 5 },
    { ticket_type_name: "Silver", ticket_price: 80, no_of_tickets: 6 },
    { ticket_type_name: "Platinum", ticket_price: 200, no_of_tickets: 7 }
  ];

  // Elements
  const $dropdown = $('#ticketTypeDropdown');
  const $ticketPrice = $('#ticket_price_value');
  const $payAmount = $('#pay_amount_value');
  const $totalPrice = $('#price_total');
  const $vatAmount = $('#vat_value');
  const $availableTicket = $('#available_tickets');
  const packagePrice = 80;
  const vat = 10;

  // Populate dropdown
  $dropdown.empty().append('<option value="">-- Select Ticket --</option>');
  ticketTypes.forEach((ticket, i) => {
    $dropdown.append(`<option value="${i}">${ticket.ticket_type_name} - $${ticket.ticket_price}</option>`);
  });

  // Main dropdown change
  $dropdown.on('change', function () {
    const selectedIndex = $(this).val();
    if (selectedIndex === "") {
      resetMainPriceFields();
      return;
    }

    const selectedTicket = ticketTypes[selectedIndex];
    $availableTicket.text(selectedTicket.no_of_tickets);
    calculateTotalPrice();
  });

  // Add dynamic ticket row
  window.addMoreTicketType = function () {
    const $container = $('#multiTicketTypes');
    const $div = $('<div class="d-flex align-items-center mb-2"></div>');

    const $select = $('<select class="form-control me-2 multi-ticket-select"></select>');
    $select.append('<option value="">-- Select --</option>');
    ticketTypes.forEach((ticket, i) => {
      $select.append(`<option value="${i}">${ticket.ticket_type_name} - $${ticket.ticket_price}</option>`);
    });

    const $quantity = $('<input type="number" min="1" value="1" class="form-control multi-ticket-quantity" style="width: 100px;" />');

    $div.append($select).append($quantity);
    $container.append($div);
  };

  // Trigger calculation on changes
  $('#ticketTypeDropdown, #ticketQuantity').on('change input', calculateTotalPrice);
  $(document).on('change input', '.multi-ticket-select, .multi-ticket-quantity', calculateTotalPrice);

  function calculateTotalPrice() {
    let mainTicketTotal = 0;
    const selectedMainIndex = $dropdown.val();
    const mainQty = parseInt($('#ticketQuantity').val()) || 1;

    if (selectedMainIndex !== "") {
      const selectedMainTicket = ticketTypes[selectedMainIndex];
      mainTicketTotal = parseFloat(selectedMainTicket.ticket_price) * mainQty;
    }

    let extraTicketsTotal = 0;
    $('#multiTicketTypes .d-flex').each(function () {
      const ticketIndex = $(this).find('.multi-ticket-select').val();
      const quantity = parseInt($(this).find('.multi-ticket-quantity').val()) || 0;

      if (ticketIndex !== "") {
        const ticket = ticketTypes[ticketIndex];
        extraTicketsTotal += parseFloat(ticket.ticket_price) * quantity;
      }
    });

    const totalBeforeVAT = mainTicketTotal + extraTicketsTotal + packagePrice;
    const vatAmount = vat;
    const grandTotal = totalBeforeVAT + vatAmount;

    $ticketPrice.text(`$${(mainTicketTotal + extraTicketsTotal).toFixed(2)}`);
    $totalPrice.text(`$${totalBeforeVAT.toFixed(2)}`);
    $vatAmount.text(`$${vatAmount.toFixed(2)}`);
    $payAmount.text(`$${grandTotal.toFixed(2)}`);
  }

  function resetMainPriceFields() {
    $ticketPrice.text('$0');
    $totalPrice.text('$0');
    $vatAmount.text('$0');
    $payAmount.text('$0');
    $availableTicket.text('0');
  }
});
