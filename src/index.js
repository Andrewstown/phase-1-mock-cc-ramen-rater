let ramenData = {}
let currentRamen = 0

const ramenDetail = document.querySelector('#ramen-detail')
const ratingDisplay = document.querySelector('#rating-display')
const commentDisplay = document.querySelector('#comment-display')

document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/ramens')
    .then(r => r.json())
    .then(data => {
        ramenData = data
        data.forEach(i => renderRamen(i))
        renderImage(data[0])

        //Add New Ramen
        document.querySelector('#new-ramen').addEventListener('submit', e => {
            e.preventDefault()

            //Get Highest ID
            let high = 0
            ramenData.forEach(i => high = high < i.id ? i.id : high)
            console.log(high)
        
            const r = e.target
            let ramen = {
                id: high + 1,
                name: r.name.value,
                image: r.image.value,
                rating: parseInt(r.rating.value),
                comment: r.comment.value,
                restaurant: r.restaurant.value
            }
    
            fetch("http://localhost:3000/ramens/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(ramen)
            })
            .then(r => r.json())
            .then(ramen => {
                ramenData.push(ramen)
                renderRamen(ramen)
                renderImage(ramenData[ramenData.findIndex(i => i.id == ramenData.length)])
            })
        })
        
        //Update Current Ramen
        document.querySelector('#edit-ramen').addEventListener('submit', e => {
            e.preventDefault()
            if (ramenData.length == 0){return}

            ramenData[currentRamen].rating = parseInt(e.target.rating.value)
            ramenData[currentRamen].comment = e.target.comment.value

            fetch(`http://localhost:3000/ramens/${ramenData[currentRamen].id}`, {
                method: 'PATCH',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    rating: parseInt(ramenData[currentRamen].rating),
                    comment: ramenData[currentRamen].comment
                })
            })
            .then(r => r.json())
            .then(ramen => renderImage(ramen))
        })

        //Delete Current Ramen
        document.querySelector('#delete-ramen').addEventListener('submit', e => {
            e.preventDefault()
            if (ramenData.length == 0){return}

            fetch(`http://localhost:3000/ramens/${ramenData[currentRamen].id}`, {
                method: 'DELETE'
            })

            document.getElementById(`${ramenData[currentRamen].id}`).remove()
            ramenData.splice(currentRamen, 1)
            currentRamen = 0
            
            if (ramenData.length == 0){
                document.querySelector('#ramen-detail').innerHTML = `
                    <img class="detail-image" src="./assets/image-placeholder.jpg" alt="Insert Name Here" />
                    <h2 class="name">Insert Name Here</h2>
                    <h3 class="restaurant">Insert Restaurant Here</h3>
                `
            }else{
                renderImage(ramenData[currentRamen])
            }
        })
    })
})

function renderRamen(ramen){
    let img = document.createElement('img')
        img.id = ramen.id
        img.src = ramen.image
        img.className = 'ramen-menu'
        img.addEventListener('click', e => renderImage(ramenData[ramenData.findIndex(i => i.id == e.target.id)]))
    document.querySelector('#ramen-menu').appendChild(img)
}

function renderImage(ramen){
    ramenDetail.innerHTML = `
        <img class="detail-image" src="${ramen.image}" alt="${ramen.name}" />
        <h2 class="name">${ramen.name}</h2>
        <h3 class="restaurant">${ramen.restaurant}</h3>
    `
    ratingDisplay.textContent = ramen.rating
    commentDisplay.textContent = ramen.comment
    currentRamen = ramenData.findIndex(i => i.id == ramen.id)
}