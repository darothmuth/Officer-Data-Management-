function enterApp() {
  document.getElementById("welcomeScreen").style.display = "none";
  document.getElementById("mainApp").style.display = "block";
}

const departmentSalaries = {
  "នាយកដ្ឋាន 1": 20000000,
  "នាយកដ្ឋាន 2": 15000000,
  "នាយកដ្ឋាន 3": 10000000,
  "នាយកដ្ឋាន 4": 8000000,
  "នាយកដ្ឋាន 5": 4000000,
  "នាយកដ្ឋាន 6": 2000000,
  "នាយកដ្ឋាន 7": 1600000,
  "នាយកដ្ឋាន 8": 1400000,
  "នាយកដ្ឋាន 9": 1200000,
  "នាយកដ្ឋាន 10": 800000
};

const khmerFirstNames = ["សុភា", "សុជាតិ", "សុវណ្ណ", "សុធារ៉ា", "សុផានី", "សារ៉ាត់", "សុមាលា", "សុភ័ក្រ", "សុគន្ធ", "សុភិន"];
const khmerLastNames = ["សុខ", "ជា", "លី", "ប៉ែន", "សេង", "សាន", "ស៊ិន", "គុំ", "សំ", "សាវឿន"];
const khmerNames = [];

for (let i = 0; i < 300; i++) {
  const first = khmerFirstNames[i % khmerFirstNames.length];
  const last = khmerLastNames[i % khmerLastNames.length];
  khmerNames.push(`${last} ${first}`);
}

const officers = khmerNames.map((name, i) => {
  const dept = `នាយកដ្ឋាន ${i % 10 + 1}`;
  const isFemale = name.includes("សុភា") || name.includes("សុផានី") || name.includes("សុមាលា") || name.includes("សុភិន");
  const salary = departmentSalaries[dept] || 800000;
  const role = dept === "នាយកដ្ឋាន 10" ? "បុគ្គលិកកិច្ចសន្យា" : "មន្រ្តី";

  return {
    id: `ID${String(i + 1).padStart(3, '0')}`,
    name,
    gender: isFemale ? "ស្រី" : "ប្រុស",
    department: dept,
    role,
    salary: `${salary.toLocaleString()} រៀល`,
    salaryStatus: "មិនទាន់ទូទាត់",
    missionStatus: "មិនទាន់ទូទាត់",
    attendance: "មិនទាន់ជ្រើសរើស",
    maternity: isFemale ? "មិនទាន់" : "គ្មាន",
    annualAttendance: 0
  };
});

function renderTable(data) {
  const tbody = document.querySelector("#officerTable tbody");
  tbody.innerHTML = "";
  data.forEach(officer => {
    const att = officer.annualAttendance;
    const attendanceDisplay = typeof att === "number"
      ? (att > 24 ? '<span style="color:red;">ឈប់លើសកំណត់</span>' : att)
      : `<span style="color:red;">${att}</span>`;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${officer.id}</td>
      <td>${officer.name}</td>
      <td>${officer.gender}</td>
      <td>${officer.department}</td>
      <td>${officer.role}</td>
      <td>${officer.salary}</td>
      <td>${officer.salaryStatus}</td>
      <td>${officer.missionStatus}</td>
      <td>${officer.attendance}</td>
      <td>${officer.maternity}</td>
      <td>${attendanceDisplay}</td>
    `;
    tbody.appendChild(tr);
  });
}

function populateOfficerSelect() {
  const select = document.getElementById("officerSelect");
  select.innerHTML = '<option value="all">All</option>';
  officers.forEach((officer, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = officer.name;
    select.appendChild(option);
  });
}

function showOfficerDetails() {
  const value = document.getElementById("officerSelect").value;
  if (value === "all") {
    ["idBox","nameBox","genderBox","roleBox","deptBox","salaryBox","salaryStatusBox","missionBox","attendanceBox","maternityBox","annualBox"]
      .forEach(id => document.getElementById(id).value = "");
  } else {
    const officer = officers[parseInt(value)];
    document.getElementById("idBox").value = officer.id;
    document.getElementById("nameBox").value = officer.name;
    document.getElementById("genderBox").value = officer.gender;
    document.getElementById("roleBox").value = officer.role;
    document.getElementById("deptBox").value = officer.department;
    document.getElementById("salaryBox").value = officer.salary;
    document.getElementById("salaryStatusBox").value = officer.salaryStatus;
    document.getElementById("missionBox").value = officer.missionStatus;
    document.getElementById("attendanceBox").value = officer.attendance;
    document.getElementById("maternityBox").value = officer.maternity;
    document.getElementById("annualBox").value = officer.annualAttendance;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderTable(officers);
  populateOfficerSelect();
  toggleUpdateButton();
});

function toggleUpdateButton() {
  const selected = document.getElementById("officerSelect").value;
  document.getElementById("updateBtn").disabled = selected === "";
}

function applySelections() {
  const selectedValue = document.getElementById("officerSelect").value;
  const salaryStatus = document.getElementById("salaryStatusSelect").value;
  const attendance = document.getElementById("attendanceSelect").value;
  const maternity = document.getElementById("maternitySelect").value;
  const missionStatus = document.getElementById("missionStatusSelect").value;

  const updateOfficer = (officer) => {
    if (salaryStatus) officer.salaryStatus = salaryStatus;
    if (missionStatus) officer.missionStatus = missionStatus;
    if (attendance) officer.attendance = attendance;
    if (officer.gender === "ស្រី" && maternity) officer.maternity = maternity;

    if (typeof officer.annualAttendance === "number") {
      if (attendance === "មានវត្តមាន" || attendance === "អវត្តមានដោយមានច្បាប់") {
        officer.annualAttendance += 1;
      } else if (attendance === "អវត្តមានដោយអត់ច្បាប់") {
        officer.annualAttendance += 2;
      }

      if (officer.annualAttendance > 24) {
        officer.annualAttendance = "ឈប់លើសកំណត់";
      }
    }
  };

  if (selectedValue === "all") {
    officers.forEach(updateOfficer);
  } else {
    updateOfficer(officers[parseInt(selectedValue)]);
  }

  renderTable(officers);
  showOfficerDetails();
}

function searchByID() {
  const id = document.getElementById("searchID").value.trim();
  const index = officers.findIndex(o => o.id === id);
  if (index !== -1) {
    document.getElementById("officerSelect").value = index.toString();
    showOfficerDetails();
    toggleUpdateButton();
  } else {
    alert("មិនមានមន្រ្តីដែលមាន ID នេះទេ។");
  }
}

function deleteOfficer() {
  const id = document.getElementById("searchID").value.trim();
  const index = officers.findIndex(o => o.id === id);
  if (index === -1) {
    alert("មិនមានមន្រ្តីដែលមាន ID នេះទេ។");
    return;
  }

  const confirmDelete = confirm(`តើអ្នកប្រាកដថាចង់លុបមន្រ្តី ${officers[index].name} មែនទេ?`);
  if (confirmDelete) {
    officers.splice(index, 1);
    renderTable(officers);
    populateOfficerSelect();
    alert("លុបមន្រ្តីរួចរាល់។");
  }
}

function filterByMission() {
  const value = document.getElementById("missionFilter").value;
  if (!value) {
    alert("សូមជ្រើសរើសស្ថានភាពបេសកកម្មជាមុនសិន។");
    return;
  }
  const filtered = officers.filter(o => o.missionStatus === value);
  renderTable(filtered);
}

function clearFilters() {
  document.getElementById("missionFilter").value = "";
  renderTable(officers);
}

function filterByAttendance() {
  const value = document.getElementById("attendanceFilter").value;
  if (!value) {
    alert("សូមជ្រើសរើសប្រភេទវត្តមានជាមុនសិន។");
    return;
  }

  let filtered = [];
  if (value === "active") {
    filtered = officers.filter(o => typeof o.annualAttendance === "number" && o.annualAttendance < 10);
  } else if (value === "moderate") {
    filtered = officers.filter(o => typeof o.annualAttendance === "number" && o.annualAttendance >= 20 && o.annualAttendance <= 24);
  } else if (value === "excess") {
    filtered = officers.filter(o => o.annualAttendance === "ឈប់លើសកំណត់");
  }

  renderTable(filtered);
}

function clearAttendanceFilter() {
  document.getElementById("attendanceFilter").value = "";
  renderTable(officers);
}

function addNewOfficer() {
  const name = document.getElementById("newName").value.trim();
  const gender = document.getElementById("newGender").value.trim();
  const deptRaw = document.getElementById("newDept").value.trim();

  if (!name || !gender || !deptRaw) {
    alert("⚠️ សូមបញ្ចូលព័ត៌មានទាំងអស់ជាមុនសិន។");
    return;
  }

  const dept = deptRaw;
  const salary = departmentSalaries[dept] || 800000;
  const newID = `ID${String(officers.length + 1).padStart(3, '0')}`;
  const isFemale = gender === "ស្រី";


  const role = dept === "នាយកដ្ឋាន 10" ? "បុគ្គលិកកិច្ចសន្យា" : "មន្រ្តី";

  const newOfficer = {
    id: newID,
    name,
    gender,
    department: dept,
    role,
    salary: `${salary.toLocaleString()} រៀល`,
    salaryStatus: "មិនទាន់ទូទាត់",
    missionStatus: "មិនទាន់ទូទាត់",
    attendance: "មិនទាន់ជ្រើសរើស",
    maternity: isFemale ? "មិនទាន់" : "គ្មាន",
    annualAttendance: 0
  };

  officers.push(newOfficer);
  renderTable(officers);
  populateOfficerSelect();

  document.getElementById("newName").value = "";
  document.getElementById("newGender").value = "";
  document.getElementById("newDept").value = "";
  document.getElementById("newRoleDisplay").value = "";

  alert(`✅ បន្ថែមមន្រ្តី ${name} ទៅ ${dept} ជោគជ័យ!`);
}