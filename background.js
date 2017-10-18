/*global chrome*/
chrome.runtime.onMessage.addListener(
    function (request, sender) {
        'use strict';
        var tab_id = sender.tab.id;
        if (request.sp_present) {
            //if sp-pay-button class exists on page, send message to extension
            chrome.pageAction.show(tab_id);
        }
    }
);