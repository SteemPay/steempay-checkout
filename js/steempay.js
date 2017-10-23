/*global $, console, chrome*/
function show_error(msg) {
    'use strict';
    console.log(msg);
}

function show_success(msg) {
    'use strict';
    console.log(msg);
}

var already_injected = false;

function inject_modal() {
    'use strict';
    if (already_injected) {
        return;
    }

    $('body').append(
        '<div id="steempay-modal">' +
            '<div class="spco-balance">' +
                '<div>Balance: <span class="spco-bold">$48.35</span></div>' +
            '</div>' +
            '<div class="spco-form_wrap">' +
                '<label class="spco-label">to:</label>' +
                '<input class="user spco-input" type="text" id="transfer_to" placeholder="e.g. kodaxx">' +
            '</div>' +
            '<div class="spco-form_wrap">' +
                '<label class="spco-label">amount:</label>' +
                '<input class="amount spco-input" type="number" id="transfer_amount" step="0.001" placeholder="e.g. 20.00">' +
            '</div>' +
            '<div class="spco-form_wrap">' +
                '<label class="spco-label">memo:</label>' +
                '<input class="memo spco-input" type="text" id="transfer_memo" placeholder="public memo (optional)">' +
            '</div>' +
            '<div class="spco-primary_button" id="spco-transfer_button">send</div>' +
        '</div>'
    );
    
    already_injected = true; // only inject once
}

function detect_sp_button() {
    "use strict";
    if ($('.sp-pay-button')[0]) {
        $('.sp-pay-button').each(function () {
            $(this).addClass("steempay-link");
        });
        chrome.runtime.sendMessage({
            sp_present: true
        });
        inject_modal();
    }
}

detect_sp_button();

$(function () {

    function disableIfExists(field, variable) {
        if (variable !== '') {
            $("#steempay-modal ." + field).prop('disabled', true);
        }
    }

    function pay_button_clicked() {
        console.log("Pay clicked");
    }

    $("body").on("click", '.steempay-link', function (event) {
        event.preventDefault();

        $('#spco-transfer_button').click(pay_button_clicked);

        var user = $(this).data('user') || '',
            amount = $(this).data('amount') || '',
            memo = $(this).data('memo') || '';

        disableIfExists("user", user);
        disableIfExists("amount", amount);
        disableIfExists("memo", memo);

        $("#steempay-modal .user").val(user);
        $("#steempay-modal .amount").val(amount);
        $("#steempay-modal .memo").val(memo);
        $("#steempay-modal").dialog({
            show: {
                effect: "fade",
                duration: 300
            },
            dialogClass: 'dialog',
            width: "600px",
            title: "SteemPay Checkout",
            close: function (event) {
                $("#steempay-modal").remove();
                already_injected = false;
                inject_modal();
            }
        });
    });

});