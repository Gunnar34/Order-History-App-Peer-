$(onReady);

function onReady() {
    getCustomers();
    $("#customers").on('click', '.order', getOrders);
}

 function getCustomers() {
     $.ajax({
         type:'GET',
         url: '/customers',
         success: function(res) {
             console.log('back from the server with', res);
             var customers = [];
             for (var i = 0; i < res.length; i++) {
                 customers.push(res[i].first_name + ' ' + res[i].last_name);
             }
             for (var j = 0; j < customers.length; j++) {
                 if (res[j].count != 0) {
                      $("#customers").append("<p>" +customers[j] + "<button class = 'order'  data-id='" + res[j].id + "'>Order</button>"  + "<p>");
                 }
                 else {
                     $("#customers").append("<p>" +customers[j] + "<p>");
                 }

             }
         }

     });//end ajax
 }


function getOrders() {
    var id = $(this).data('id');
    console.log(id);
    $.ajax({
        type:'GET',
        url: '/' + id,
        success: function(res) {
            console.log('back from the server with', res);
            $('#order').empty(' ');
            $('#order').append('<h2>Order Information</h2>');
            for (var i = 0; i < res.length; i++) {
                var address = res[i].address_type + ": " + res[i].street + ", " + res[i].city + ", " + res[i].state + ", " + res[i].zip;
                var orderNumber = "Order number: " + res[i].id;
                var order =  res[i].description + '- Amount ordered: ' + res[i].quantity + ' Price: ' + res[i].unit_price + '$' + ' Order Cost: ' + res[i].total+ '$';
                $('#order').append('<br>' + '<p>' + (i + 1) + '. ' + address + '<br>' + orderNumber + '<br>' + order + '<br>' + '</p>');
            }
        }

    });//end ajax
}
