// Select Elements

let countSpan = document.querySelector(".quiz-app .count span")
let bullets = document.querySelector(".bullets")
let bulletContainer = document.querySelector(".quiz-app .bullets .spans")
let quizAreaContainer = document.querySelector(".quiz-app .quiz-area")
let answerArea = document.querySelector(".answers-area")
let submitButton = document.querySelector(".submit-button")
let resultAreaa = document.querySelector(".results")
let countdownElement = document.querySelector(".countdown")

// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQusetion() {
    let myRequest = new XMLHttpRequest()

    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionsObject = JSON.parse(this.responseText)
            let qCount = questionsObject.length
            // console.log(qCount)

            // Create Bullets + Set Questions Count
            createBullets(qCount)

            // Add Data
            addQuestionData(questionsObject[currentIndex], qCount)

            // Start count Down
            countDown(60, qCount)

            // click On submit 
            submitButton.onclick = () => {

                // Get Right Answer 
                let theRightAnswer = questionsObject[currentIndex]["right_answer"]

                // Increase Index
                currentIndex++

                // Check The Answer 
                checkAnswer(theRightAnswer, qCount)

                // REmove Previous Question
                quizAreaContainer.innerHTML = ""
                answerArea.innerHTML = ""

                // Add next Question 
                addQuestionData(questionsObject[currentIndex], qCount)

                // Handle bullets class
                handleBullets()

                // Start count Down
                clearInterval(countdownInterval)
                countDown(60, qCount)

                // Show Results
                showResults(qCount)
            }
        }
    }

    myRequest.open("GET", "html_questions.json", true)
    myRequest.send()
}

getQusetion()

function createBullets(num) {
    // countSpan.innerHTML = `Question Count : <span>${num}</span>`
    countSpan.innerHTML = num

    // Create Spans
    for (let i = 0; i < num; i++) {
        // Create Span
        let theBullet = document.createElement("span")

        // Check If Its First Sapn
        if (i === 0) {
            theBullet.className = "on"
        }
        //Append Bullet To Main Bullet Container
        bulletContainer.appendChild(theBullet)
    }
}

function addQuestionData(obj, count) {
    if (currentIndex < count) {

        // Create H2 Questions Title 
        let questionTitle = document.createElement("h2")

        // Create Question Text 
        let questionText = document.createTextNode(obj["title"])

        // Append Text To H2 Element 
        questionTitle.appendChild(questionText)

        // Append H2 To The Quiz Area
        quizAreaContainer.appendChild(questionTitle)

        // Add The Answers
        for (let i = 0; i < 4; i++) {

            // Create Main Answer Div
            let mainDiv = document.createElement("div")

            //Add Class To Main Div
            mainDiv.className = "answer"

            // Create Radio Input Elemnt
            let radioInput = document.createElement("input")

            // Add Type + Name + Id + DataAttribute
            radioInput.name = "question"
            radioInput.type = "radio"
            radioInput.id = `answer_${i + 1}`
            radioInput.dataset.answer = obj[`answer_${i + 1}`]

            // Make First Option Checked
            if (i === 0) {
                radioInput.checked = true;
            }

            // Create Label
            let theLabel = document.createElement("label")
            // Add For To The Label 
            theLabel.htmlFor = `answer_${i + 1}`

            // Create Label Text 
            let theLabelText = document.createTextNode(obj[`answer_${i + 1}`])

            // Add The Text To The Label 
            theLabel.appendChild(theLabelText)

            // Add The Radio Input & Label To The Main Div 
            mainDiv.appendChild(radioInput)
            mainDiv.appendChild(theLabel)

            // Add The Main Div To The Answer Arae Div
            answerArea.appendChild(mainDiv)
        }
    }
}

function checkAnswer(rAnswer, count) {
    let answers = document.getElementsByName("question")
    let theChoosenAnswer;

    for (let i = 0; i < answers.length; i++) {

        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer
        }
    }


    if (rAnswer === theChoosenAnswer) {
        rightAnswers++
    }
}

function handleBullets() {

    let bulletsSpans = document.querySelectorAll(".bullets .spans span")
    let arrayOfSpans = Array.from(bulletsSpans)
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = "on"
        }
    })
}

function showResults(count) {
    let theResults
    if (currentIndex === count) {
        quizAreaContainer.remove()
        answerArea.remove()
        submitButton.remove()
        bullets.remove()

        if (rightAnswers === count) {
            theResults = `<span class="perfect">Perfect </span> You Answered ${rightAnswers} From ${count}`
        } else if (rightAnswers > (count / 2) && rightAnswers < count) {
            theResults = `<span class="good">Good </span>You Answered ${rightAnswers} From ${count}`
        }
        else if (rightAnswers < (count / 2)) {
            theResults = `<span class="bad">Bad </span> You Answered ${rightAnswers} From ${count}`
        }
        resultAreaa.innerHTML = theResults
        resultAreaa.style.padding = "30px";
        resultAreaa.style.backgroundColor = "white";
        resultAreaa.style.marginTop = "10px";
    }
}

function countDown(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds
        countdownInterval = setInterval(function () {
            // Set Minutes And Seconds
            minutes = parseInt(duration / 60)
            seconds = parseInt(duration % 60)

            minutes = minutes < 10 ? `0${minutes}` : minutes
            seconds = seconds < 10 ? `0${seconds}` : seconds

            countdownElement.innerHTML = `${minutes} : ${seconds}`

            if (--duration < 0) {
                clearInterval(countdownInterval)
                submitButton.click();
            }

        }, 1000)
    }
}
