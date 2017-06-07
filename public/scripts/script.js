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
                 $("#customers").append("<p>" +customers[j] + "<button class = 'order'  data-id='" + res[j].id + "'>Order</button>"  + "<p>");
             }
         }

     });//end ajax
 }


function getOrders() {
    var id = {
        id: $(this).data('id')
    };
    console.log(id);


    $.ajax({
        type:'POST',
        url: '/orders',
        data: id,
        success: function(res) {
            console.log('back from the server with', res);

        }

    });//end ajax
}
