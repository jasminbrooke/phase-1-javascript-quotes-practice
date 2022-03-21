document.addEventListener("DOMContentLoaded", () => {
    const quoteList = document.getElementById("quote-list")
    const form = document.getElementById("new-quote-form")
    const newQuote = document.getElementById("new-quote")
    const newAuthor = document.getElementById("author")
    
    const fetchQuotes = () => {
        fetch("http://localhost:3000/quotes?_embed=likes")
        .then(resp => resp.json())
        .then(data => data.map(quoteObj => renderQuote(quoteObj)))
    }

    const renderQuote = (quoteObj) => {
        const li = document.createElement("li")
        const blockquote = document.createElement("blockquote")
        const p = document.createElement("p")
        const footer = document.createElement("footer")
        const br = document.createElement("br")
        const span = document.createElement("span")
        const btn1 = document.createElement("button")
        const btn2 = document.createElement("button")

        li.setAttribute("class", "quote-card")
        blockquote.setAttribute("class", "blockquote")
        p.setAttribute("class", "mb-0")
        p.innerText = quoteObj.quote
        footer.setAttribute("class", "blockquote-footer")
        footer.innerText = quoteObj.author
        btn1.setAttribute("class", "btn-success")
        btn1.innerText = "Likes: "
        span.innerText = quoteObj.likes.length
        btn1.addEventListener('click', () => like(quoteObj.id, span))
        btn2.setAttribute("class", "btn-danger")
        btn2.innerText = "Delete"
        btn2.addEventListener('click', () => deleteQuote(quoteObj.id))


        btn1.appendChild(span)
        blockquote.appendChild(p)
        blockquote.appendChild(footer)
        blockquote.appendChild(br)
        blockquote.appendChild(btn1)
        blockquote.appendChild(btn2)
        li.appendChild(blockquote)
        quoteList.appendChild(li)
    }
    
    const postNewQuote = (data) => {
        fetch("http://localhost:3000/quotes", {
            method: "POST",
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(data)
        })
        .then(resp => resp.json)
        .then(() => {
            while(quoteList.firstChild) {
                quoteList.removeChild(quoteList.firstChild)
            }
            fetchQuotes()
        })
    }

    const deleteQuote = (id) => {
        fetch(`http://localhost:3000/quotes/${id}`, {
            method: "DELETE",
            headers: {'Content-Type': 'application/json'}, 
        })
        .then(() => {
            while(quoteList.firstChild) {
                quoteList.removeChild(quoteList.firstChild)
            }
            fetchQuotes()
        })
        window.scrollTo(0, document.body.scrollHeight);

    }
    
    const like = (id, span) => {
        fetch("http://localhost:3000/likes", {
            method: "POST",
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({quoteId: id})
        })
        span.innerText = parseInt(span.innerText) + 1
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault()
        const quote = newQuote.value
        const author = newAuthor.value
        const newQuoteObj = {
            quote,
            author
        }
        postNewQuote(newQuoteObj)
        // window.scrollTo(0, document.body.scrollHeight);
    })

    fetchQuotes()
})