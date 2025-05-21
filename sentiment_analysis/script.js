// notifications
const toastElement = document.createElement("div")
toastElement.className = "toast"
document.body.appendChild(toastElement)

// show notification
function showToast(message, duration = 3000) {
  toastElement.textContent = message
  toastElement.classList.add("show")

  setTimeout(() => {
    toastElement.classList.remove("show")
  }, duration)
}

// Hide results 
document.addEventListener("DOMContentLoaded", () => {
  const resultsSection = document.getElementById("resultsSection")
  resultsSection.classList.remove("show") 
})

function predictSentiment() {
  const review = document.getElementById("reviewInput").value
  const resultDiv = document.getElementById("results")
  const loadingSection = document.getElementById("loadingSection")
  const resultsSection = document.getElementById("resultsSection")

  resultsSection.classList.remove("show")
  resultDiv.classList.remove("show")

  if (review.trim() === "") {
    showToast("Please enter your review before submitting")
    document.getElementById("reviewInput").focus()
    return
  }

  loadingSection.classList.remove("hidden")

  let seconds = 0
  const timerElement = document.getElementById("timer")
  const timer = setInterval(() => {
    seconds++
    timerElement.textContent = seconds
  }, 1000)

  fetch("http://127.0.0.1:19372/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ review: review }),
  })
    .then((response) => response.json())
    .then((data) => {
      clearInterval(timer)
      loadingSection.classList.add("hidden")

      const sentiment = data.sentiment
      displayResult(sentiment, review)

      document.getElementById("reviewInput").value = ""
    })
    .catch((error) => {
      clearInterval(timer)
      loadingSection.classList.add("hidden")
      console.error("Error: ", error)

      resultDiv.innerHTML = `
        <div class="error-message">
            There was an error analyzing your review. Please try again later.
        </div>
      `

      setTimeout(() => {
        resultsSection.classList.add("show")
        setTimeout(() => {
          resultDiv.classList.add("show")
        }, 300)
      }, 100)
    })
}

function displayResult(sentiment, review) {
  const resultDiv = document.getElementById("results")
  const resultsSection = document.getElementById("resultsSection")

  resultDiv.innerHTML = `
    <div class="sentiment-result ${sentiment.toLowerCase()}">
        Your review is ${sentiment}
    </div>
    <div style="margin-top: 20px; padding: 15px; background-color: #333; border-radius: 8px;">
        <p style="font-style: italic; color: #CCC;">"${review}"</p>
    </div>
  `

  setTimeout(() => {
    resultsSection.classList.add("show")
    setTimeout(() => {
      resultDiv.classList.add("show")
    }, 300)
  }, 100)
}

document.getElementById("reviewInput").addEventListener("keydown", (event) => {
  if (event.key === "Enter" && event.ctrlKey) {
    predictSentiment()
  }
})

