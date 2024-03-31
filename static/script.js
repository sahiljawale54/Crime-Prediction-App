flatpickr("#time", {
  enableTime: true,
  noCalendar: true,
  dateFormat: "H:i",
  time_24hr: true, // Use 24-hour format
});

document.getElementById("predictButton").addEventListener("click", function () {
  var month = parseInt(document.getElementById("month").value);
  var year = parseInt(document.getElementById("year").value);
  var dayEncoded = parseInt(document.getElementById("dayOfWeek").value);
  var timeInput = document.getElementById("time").value;
  var timeParts = timeInput.split(":");
  var hours = parseInt(timeParts[0]);
  var minutes = parseInt(timeParts[1]);
  var sessionEncoded = parseInt(document.getElementById("session").value);
  var districtEncoded = parseInt(document.getElementById("district").value);
  var locX = parseFloat(document.getElementById("locX").value);
  var locY = parseFloat(document.getElementById("locY").value);
  var descriptionEncoded = parseInt(
    document.getElementById("description").value
  );

  var inputData = {
    month: month,
    year: year,
    dayEncoded: dayEncoded,
    hours: hours,
    minutes: minutes,
    time_numeric: 3600 * hours + 60 * minutes,
    sessionEncoded: sessionEncoded,
    districtEncoded: districtEncoded,
    locX: locX,
    locY: locY,
    descriptionEncoded: descriptionEncoded,
  };

  fetch("/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inputData),
  })
    .then((response) => response.json())
    .then((data) => {
      var priorityMapping = {
        1: "High",
        2: "Low",
        3: "Medium",
      };
      var priority = priorityMapping[data.prediction[0]];

      document.getElementById("predictionResult").innerText =
        "Predicted Priority: " + priority;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
