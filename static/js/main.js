var nameInput = document.getElementById("Name");
var urlInput = document.getElementById("Url");
var submitBtn = document.getElementById("submitBtn");
var cancelEditBtn = document.getElementById("cancelEditBtn");
var list = [];
var editingId = null;

loaddat();

function loaddat() {
  fetch("/api/bookmarks")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      list = data;
      displaydat();
    });
}

function validateName() {
  var name = nameInput.value.trim();
  if (name.length >= 3) {
    nameInput.classList.remove("is-invalid");
    nameInput.classList.add("is-valid");
  } else {
    nameInput.classList.remove("is-valid");
    nameInput.classList.add("is-invalid");
  }
}

function validateUrl() {
  var url = urlInput.value.trim();
  if (isValidUrl(url)) {
    urlInput.classList.remove("is-invalid");
    urlInput.classList.add("is-valid");
  } else {
    urlInput.classList.remove("is-valid");
    urlInput.classList.add("is-invalid");
  }
}

function isValidUrl(url) {
  var urlPattern = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(:[0-9]{1,5})?(\/.*)?$/i;
  return urlPattern.test(url);
}

function displaydat() {
  var count = "";
  for (var i = 0; i < list.length; i++) {
    var url = list[i].url || "";
    if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
      url = "http://" + url;
    }

    count += `
      <tr>
        <td>${i + 1}</td>
        <td>${list[i].name || "Unnamed"}</td>
        <td>
          <a href="${url}" target="_blank" class="btn btn-success"> <i class="fa-regular fa-eye"></i> Visit</a>
        </td>
        <td>
          <button class="btn btn-warning" onclick="edititems(${list[i].id})"><i class="fa-solid fa-pen"></i> Edit</button>
          <button class="btn btn-danger" onclick="deletitems(${list[i].id})"><i class="fa-solid fa-trash"></i> Delete</button>
        </td>
      </tr>`;
  }
  document.getElementById("bookmarksResults").innerHTML = count;
}


function edititems(id) {
  var bookmark = list.find(function (item) {
    return item.id === id;
  });
  if (!bookmark) return;

  nameInput.value = bookmark.name;
  urlInput.value = bookmark.url;
  editingId = id;
  submitBtn.textContent = "Update";
  cancelEditBtn.classList.remove("d-none");
  nameInput.classList.remove("is-valid", "is-invalid");
  urlInput.classList.remove("is-valid", "is-invalid");
}

function canceledit() {
  editingId = null;
  submitBtn.textContent = "Submit";
  cancelEditBtn.classList.add("d-none");
  clearproduct();
}

function deletitems(id) {
  fetch("/api/bookmarks/" + id, {
    method: "DELETE",
  }).then(function () {
    loaddat();
  });
}

function validateInputs() {
  var name = nameInput.value.trim();
  var url = urlInput.value.trim();

  if (name.length < 3 || !isValidUrl(url)) {
    showPopup();
    return false;
  }
  return true;
}

function dataproudct() {
  validateName();
  validateUrl();

  if (!validateInputs()) return;

  var product = {
    name: nameInput.value,
    url: urlInput.value,
  };

  var request;
  if (editingId !== null) {
    request = fetch("/api/bookmarks/" + editingId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
  } else {
    request = fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
  }

  request.then(function () {
    editingId = null;
    submitBtn.textContent = "Submit";
    cancelEditBtn.classList.add("d-none");
    loaddat();
    clearproduct();
  });
}

function clearproduct() {
  nameInput.value = "";
  urlInput.value = "";
  nameInput.classList.remove("is-valid", "is-invalid");
  urlInput.classList.remove("is-valid", "is-invalid");
}

function showPopup() {
  document.getElementById("popupModal").classList.remove("d-none");
}

function closePopup() {
  document.getElementById("popupModal").classList.add("d-none");
}
