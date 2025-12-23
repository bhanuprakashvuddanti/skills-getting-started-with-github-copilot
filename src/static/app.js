document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Fetch activities and populate the page
  async function loadActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      activitiesList.innerHTML = "";

      Object.entries(activities).forEach(([name, activity]) => {
        // Create activity card
        const card = document.createElement("div");
        card.className = "activity-card";

        const participantsList = activity.participants
          .map((p) => `<li>${p}</li>`)
          .join("");

        card.innerHTML = `
          <h4>${name}</h4>
          <p><strong>Description:</strong> ${activity.description}</p>
          <p><strong>Schedule:</strong> ${activity.schedule}</p>
          <p><strong>Max Participants:</strong> ${activity.max_participants}</p>
          <div class="participants-section">
            <h5>Signed Up (${activity.participants.length})</h5>
            <ul>
              ${participantsList}
            </ul>
          </div>
        `;

        activitiesList.appendChild(card);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      console.error("Error loading activities:", error);
      document.getElementById("activities-list").innerHTML =
        "<p>Error loading activities</p>";
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(
          email
        )}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        messageDiv.className = "message success";
        messageDiv.textContent = `Successfully signed up for ${activity}!`;
        messageDiv.classList.remove("hidden");
        signupForm.reset();
        loadActivities(); // Refresh the activities list
      } else {
        const error = await response.json();
        messageDiv.className = "message error";
        messageDiv.textContent = error.detail || "Error signing up";
        messageDiv.classList.remove("hidden");
      }
    } catch (error) {
      messageDiv.className = "message error";
      messageDiv.textContent = "Error submitting signup";
      messageDiv.classList.remove("hidden");
    }
  });

  // Initialize app
  loadActivities();
});
