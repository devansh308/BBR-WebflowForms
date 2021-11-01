$("#current-page").val(location.href);
var datamail;

$(document).ready(function () {
  $("form#wf-form-Test-Form").on("submit", function (event) {
    console.log("Hello");
    var query_string = $(this).serialize();
    console.log(query_string);
    var form_data = objectFromWebFlowQuerystring(query_string);
    console.log(form_data);
    datamail = form_data;
    form_data["Current Page"] = window.location.href;
    form_data.form_name = "Payment Form Adult";
    hitWebhook(
      form_data,
      (url = "https://webhook.site/1a2f6d8b-7f79-40b6-a899-f14c238dc10a")
    );
    event.preventDefault();
    return false;
  });

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

  function hitWebhook(form_data, url) {
    $.ajax({
      url: url,
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
