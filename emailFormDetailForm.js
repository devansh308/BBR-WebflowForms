$("#current-page").val(location.href);
var dataArray;

$(document).ready(function () {
  $("form#wf-form-Email-Form").on("submit", function (event) {
    var query_string = $(this).serialize();
    var form_data = objectFromWebFlowQuerystring(query_string);
    form_data["Current Page"] = window.location.href;
    form_data.form_name = "Email Form";
    dataArray = form_data;
    hitWebhook(form_data);
    event.preventDefault();
    setTimeout(function () {
      redirectToThankYou();
    }, 1000);
    return false;
  });

  $("form#wf-form-Detail-Form").on("submit", function (event) {
    var query_string = $(this).serialize();
    var form_data = objectFromWebFlowQuerystring(query_string);
    console.log(form_data);
    form_data["Current Page"] = window.location.href;
    form_data.form_name = "Detail Form";
    dataArray = form_data;
    hitWebhook_provesource(form_data);
    hitWebhook(form_data);
    event.preventDefault();
    setTimeout(function () {
      redirectToThankYou();
    }, 1000);
    return false;
  });

  function redirectToThankYou() {
    var url_params = window.location.search;
    var url;
    if (url_params) {
      url =
        "/submission-thank-you" + url_params + "&phone=" + dataArray["Phone"];
    } else {
      url = "/submission-thank-you" + "?phone=" + dataArray["Phone"];
    }
    window.location = url;
  }

  function objectFromWebFlowQuerystring(
    query_string,
    required_keys = [
      "Child-s-Name",
      "Phone",
      "City",
      "Class",
      "Current Page",
      "LeadSource",
      "parental-expectation",
      "Language-at-Home",
      "email",
    ]
  ) {
    var params = new URLSearchParams(query_string);
    var obj = {};

    for (const key of params.keys()) {
      if (required_keys.includes(key)) {
        obj[key] = params.get(key);
      }
    }

    if ($("#Child-s-Name").val()) {
      obj["Child's Name"] = $("#Child-s-Name").val();
    }

    if ($("input#WhatsappConsent:checked").length > 1) {
      obj["WhatsappConsent"] = "true";
    } else {
      obj["WhatsappConsent"] = "false";
    }

    obj["LeadSource"] = "Website";
    return obj;
  }

  function hitWebhook(form_data) {
    $.ajax({
      url: "https://analytics.blackboardradio.com/webflow_webhook",
      //testURL
      data: form_data,
      type: "POST",
      dataType: "json",
      error: function () {
        console.log("error");
      },
      success: function (data) {
        console.log("success");
      },
    });
  }

  function hitWebhook_provesource(form_data) {
    $.ajax({
      //url: "https://webhook.site/1a2f6d8b-7f79-40b6-a899-f14c238dc10a",
      url: "https://analytics.blackboardradio.com/webhook",
      data: form_data,
      type: "POST",
      dataType: "json",
      error: function () {
        console.log("error");
      },
      success: function (data) {
        console.log("success");
      },
    });
  }
});
