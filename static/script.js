flatpickr("#time", {
  enableTime: true,
  noCalendar: true,
  dateFormat: "H:i",
  time_24hr: true, // Use 24-hour format
});

function getSessionFromTime(hour) {
  // Determine session based on hour
  if (hour >= 0 && hour < 6) {
    return 4;
  } else if (hour >= 6 && hour < 12) {
    return 1;
  } else if (hour >= 12 && hour < 18) {
    return 2;
  } else {
    return 3;
  }
}

function getDistrictCenter(district) {
  if (district == 1) {
    //CW
    return { lat: 39.226595, lng: -76.599804 };
  } else if (district == 2) {
    //ED
    return { lat: 39.251658, lng: -76.692721 };
  } else if (district == 0) {
    //CD
    return { lat: 39.162168, lng: -76.5195787 };
  } else if (district == 7) {
    //ND
    return { lat: 39.1978693, lng: -76.6091487 };
  } else if (district == 8) {
    //NE
    return { lat: 39.1929164, lng: -76.5952503 };
  } else if (district == 9) {
    //NW
    return { lat: 39.221035, lng: -76.58836 };
  } else if (district == 10) {
    //SD
    return { lat: 39.0944364, lng: -76.5213048 };
  } else if (district == 11) {
    //SE
    return { lat: 39.178274, lng: -76.632684 };
  } else if (district == 13) {
    //SW
    return { lat: 39.1356907, lng: -76.5831953 };
  } else if (district == 14) {
    //TRU
    return { lat: 39.202604, lng: -76.557931 };
  } else if (district == 15) {
    //WD
    return { lat: 39.160172, lng: -76.587856 };
  } else if (district == 25) {
    //baltimore
    return { lat: 39.299236, lng: -76.607716 };
  }
}

document.getElementById("district").addEventListener("change", function () {
  var selectedDistrict = this.value;
  var selectedOption = this.options[this.selectedIndex];
  if (selectedOption.value !== "25") {
    document.querySelector(".curr").innerHTML =
      "<b>" + selectedOption.textContent + "</b>";
  } else {
    document.querySelector(".curr").innerHTML = "<b>Baltimore</b>";
  }
  var districtCenter = getDistrictCenter(selectedDistrict);
  if (districtCenter) {
    map.setCenter(districtCenter);
  }
});
let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  var baltimore = { lat: 39.299236, lng: -76.607716 }; // Baltimore's coordinates
  map = new google.maps.Map(document.getElementById("map"), {
    center: baltimore,
    zoom: 13, // Zoom level for better visibility
  });

  google.maps.event.addListener(map, "click", function (event) {
    console.log("Map clicked");
    document.getElementById("locX").value = event.latLng.lat();
    document.getElementById("locY").value = event.latLng.lng();
  });
}

document
  .getElementById("predictionForm")
  .addEventListener("reset", function () {
    // Clear all input fields in the form
    var inputs = document
      .getElementById("predictionForm")
      .querySelectorAll("input, select, textarea");
    inputs.forEach(function (input) {
      input.value = "";
    });
    initMap();
    document.querySelector(".curr").innerHTML = "<b>Baltimore</b>";
    document.getElementById("predictionResult").innerText = "";
  });

initMap();

document.getElementById("predictButton").addEventListener("click", function () {
  var month = parseInt(document.getElementById("month").value);
  var year = parseInt(document.getElementById("year").value);
  var dayEncoded = parseInt(document.getElementById("dayOfWeek").value);
  var timeInput = document.getElementById("time").value;
  var timeParts = timeInput.split(":");
  var hours = parseInt(timeParts[0]);
  var minutes = parseInt(timeParts[1]);
  var sessionEncoded = getSessionFromTime(hours);
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
