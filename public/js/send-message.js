const form = document.querySelector("#form-messager")

form.onsubmit = (e) => {
    e.preventDefault()

    console.log(e.target.querySelector("input").value)
}