/*global $, console, chrome*/
function show_error(msg) {
    'use strict';
    $("#steempay-modal").html(
        "<div class='ui-state-error ui-corner-all error'>" +
            "ShapeShift.io API returned an Error:<br><br>" +
            "<span class='ui-state-error-text error-text'>" + msg + "</span>" +
            "</div>"
    );
    $("#steempay-modal").dialog("option", "buttons", []);
}

function show_success(msg) {
    'use strict';
    $("#steempay-modal").html(
        "<div class='ui-state-highlight ui-corner-all success'>" +
            "Success!<br><br>" +
            "<span class='success-text'>" + msg + "</span><br><br> " +
            "<input type='email' class='email form-control' placeholder='Enter your Email'> <input class='email-send btn' style='font-size:14px;border:0;' type='button' value='Send Receipt'>" +
            "<br><span class='email-status-msg'></span>" +
            "<br><a href='#' class='finish'>Finish</a>" +
            "</div>"
    );
    $("#steempay-modal").dialog("option", "buttons", []);
}

var already_injected = false;

function inject_modal() {
    'use strict';
    if (already_injected) {
        return;
    }
    $('body').append(
        "<div id='steempay-modal'>" +
            "<div class='all'>" +
            "<div class='balance'>" +
            "<div class='pull-left'>Balance: <span class='sp-bold'>$48.35</span></div>" +
            "</div>" +
            "<div class='panel-body active'>" +
            "<div class='top-body clearfix'>" +
            "<span class='label'>Sending:</span>" +
            "<div class='form-item col-md-8'><input class='user form-control' placeholder='To...'></div>" +
            "<div class='form-item col-md-4'><input class='amount form-control' placeholder='Amount...'></div>" +
            "<div class='form-item col-md-12'><input class='memo form-control' placeholder='Public Memo (optional)...'></div>" +
            "</div>" +
            "</div>" +
            "</div>"
    );

    already_injected = true; // only inject once
}

function detect_sp_button() {
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

    function pay_button_clicked(event) {
        console.log("Pay clicked");
    }

    $("body").on("click", '.steempay-link', function (event) {
        event.preventDefault();
        var user = $(this).data('user') || '',
            amount = $(this).data('amount') || '',
            memo = $(this).data('memo') || '';

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
        $("#steempay-modal")
            .dialog("option", "buttons", [{
                text: "Cancel",
                click: function () {
                    $(this)
                        .dialog('close');
                }
            }, {
                text: "Pay",
                click: pay_button_clicked
            }]);
    });

});