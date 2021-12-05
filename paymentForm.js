$("#current-page").val(location.href);
var datamail;

$(document).ready(function () {
  $("form#wf-form-Payment-Form").on("submit", function (event) {
    var query_string = $(this).serialize();
    console.log(query_string);
    var form_data = objectFromWebFlowQuerystring(query_string);
    console.log(form_data);
    datamail = form_data;
    form_data["Current Page"] = window.location.href;
    form_data.form_name = "Payment Form";
    hitWebhook(
      form_data,
      (url = "https://analytics.blackboardradio.com/webhook")
    );
    hitWebhook(
      form_data,
      (url = "https://analytics.blackboardradio.com/webflow_webhook")
    );
    event.preventDefault();
    setTimeout(function () {
      redirectToPaymentPage();
    }, 1000);
    return false;
  });

  function redirectToPaymentPage() {
    var params = window.location.search;
    var url;
    var emailParam = "&billing_email=" + datamail["email"];
    if (params) {
      url = datamail["email"]
        ? "https://pay.blackboardradio.com/cartflows_step/checkout" +
          params +
          "&billing_phone=" +
          datamail["Phone"] +
          "&add-to-cart=1515" +
          emailParam
        : "https://pay.blackboardradio.com/cartflows_step/checkout" +
          params +
          "&billing_phone=" +
          datamail["Phone"] +
          "&add-to-cart=1515";
    } else {
      url = datamail["email"]
        ? "https://pay.blackboardradio.com/cartflows_step/checkout" +
          "?billing_phone=" +
          datamail["Phone"] +
          "&add-to-cart=1515" +
          emailParam
        : "https://pay.blackboardradio.com/cartflows_step/checkout" +
          "?billing_phone=" +
          datamail["Phone"] +
          "&add-to-cart=1515";
    }
    window.location.href = url;
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
