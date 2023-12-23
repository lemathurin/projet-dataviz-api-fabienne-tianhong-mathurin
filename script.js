function getTodaysDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}
//rafraichir toutet les secondes
function refresh(){
    var t = 1000; // rafraîchissement en millisecondes
    setTimeout('getTodayHour()',t)
}
//obtenir l’heure
function getTodayHour() {
let currentTime = new Date()

let diplayHour = document.querySelector(".gethour").innerHTML =
 String (currentTime.getHours()).padStart(2, '0') + 
":" + String(currentTime.getMinutes()).padStart(2, '0')
// console.log(diplayHour)
let diplaySecondes = document.querySelector(".clock_seconds");
diplaySecondes.innerHTML = String(currentTime.getSeconds()).padStart(2, '0');

refresh()
}
getTodayHour()


function updateItemCount(elementId, count) {
    document.getElementById(elementId).textContent = count;
}

function fetchItemsData(url, elementId, countField) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const itemCount = data[countField] || 0;
            updateItemCount(elementId, itemCount);
        })
        .catch(error => {
            console.log(`Error fetching ${elementId} data:`, error);
        });
}

document.addEventListener('DOMContentLoaded', function() {
    const todayDate = getTodaysDate();
    const formattedDate = encodeURIComponent(todayDate); // Encoding the date for URL usage

    const lostItemsUrl = `https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/objets-trouves-gares/records?limit=1&refine=date%3A%22${formattedDate}%22`;
    const returnedItemsUrl = `https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/objets-trouves-restitution/records?limit=1&refine=date%3A%222023%22&refine=gc_obo_date_heure_restitution_c%3A%22${formattedDate}%22`;

    fetchItemsData(lostItemsUrl, 'totalLost', 'total_count');
    fetchItemsData(returnedItemsUrl, 'totalReturned', 'total_count');
});

function sum(number){
    let sum = 0
    //console.log(number)
    for (i=0; i<number.results.length; i++){
        sum += number.results[i].count
    }
    return sum
} //calculer les objets totals

async function percentageSixMonths(){
    let resultSumLost
    let resultSumFound
    await fetch("https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/objets-trouves-gares/records?select=COUNT(*)%20as%20count&group_by=RANGE(date%2C%201%20month)%20as%20date&order_by=date%20DESC&limit=6")
        .then(response => response.json())
        .then(data => {
            //console.log(data)
            resultSumLost = sum(data)
           //console.log(resultSumLost)
           return resultSumLost
        })
        .catch(error => {
            console.log(`Error fetching resultSumLost data:`, error);
        });
    await fetch("https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/objets-trouves-restitution/records?select=COUNT(*)%20as%20count&group_by=RANGE(date%2C%201%20month)%20as%20date&order_by=date%20DESC&limit=6")
        .then(response => response.json())
        .then(data => {
            //console.log(data)
            resultSumFound = sum(data)
           //console.log(resultSumFound)
           return resultSumFound
        })
        .catch(error => {
            console.log(`Error fetching resultSumFound data:`, error);
        });
    let percentage = (resultSumFound/resultSumLost*100).toFixed(2)
    //console.log(percentage)
    document.getElementById("percentageSixMonths").innerHTML = percentage
    }
async function dataNantes(){
    await fetch("https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/objets-trouves-gares/records?select=date%2C%20COUNT(*)&where=%22Nantes%22&group_by=RANGE(date%2C%201%20day)%20as%20date&order_by=date%20DESC&limit=30")
        .then(response => response.json())
        .then(data => {
            //console.log(data)
            resultSumLost = sum(data)
           //console.log(resultSumLost)
           return resultSumLost
        })
        .catch(error => {
            console.log(`Error fetching resultSumLost data:`, error);
        });
}

async function autocomplete(inp) {
    let arrayStation = []
    await fetch("https://www.data.gouv.fr/fr/datasets/r/521fe6f9-0f7f-4684-bb3f-7d3d88c581bb")
            .then(response => response.json())
            .then(data => {
                console.log(data)
                let arr =[]
                for(i=0;i<data.cities.length;i++){
                    arr.push(data.cities[i].label)
                }
                console.log(arr)
                for(x=0;x<arr.length;x++){
                    if(arrayStation.indexOf(arr[x].trim())==-1){
                        arrayStation.push(arr[x].trim())
                }
                }
                console.log(arrayStation)
                return arrayStation //get the list of stations in France
            })
        //console.log(arrayStation)
        /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/
        var currentFocus;
        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", function(e) {
            var a, b, i, val = this.value;
            /*close any already open lists of autocompleted values*/
            closeAllLists();
            if (!val) { return false;}
            currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(a);
            /*for each item in the array...*/
            for (i = 0; i < arrayStation.length; i++) {
              /*check if the item starts with the same letters as the text field value:*/
              if (arrayStation[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arrayStation[i].substr(0, val.length) + "</strong>";
                
                // Capitalize city names
                const cityName = arrayStation[i];
                const capitalizedCity = cityName.substr(0, 1).toUpperCase() + cityName.substr(1).toLowerCase();

                if (capitalizedCity.substr(0, val.length).toUpperCase() === val.toUpperCase()) {
                    b.textContent = capitalizedCity; // Set the text content without manipulating HTML
                    b.innerHTML += "<input type='hidden' value='" + capitalizedCity + "'>";
                    b.addEventListener("click", function(e) {
                        inp.value = this.getElementsByTagName("input")[0].value;
                        closeAllLists();
                        getStation(); // Trigger the action directly
                    });
                    a.appendChild(b);
                    
                    if (a.childNodes.length < 5) {
                        a.appendChild(b);
                    } else {
                        break; // Exit loop once 5 options are added
                    }
                }
                // b.innerHTML += arrayStation[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arrayStation[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                    b.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                    /* Trigger the action directly */
                    getStation();
                });
                a.appendChild(b);
                
                // ADDITION HERE
                if (a.childNodes.length < 5) {
                    a.appendChild(b);
                } else {
                    break; // Exit loop once 5 options are added
                }
                // STOPS HERE
              }
            }
        });
        /*execute a function presses a key on the keyboard:*/
        inp.addEventListener("keydown", function(e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
              /*If the arrow DOWN key is pressed,
              increase the currentFocus variable:*/
              currentFocus++;
              /*and and make the current item more visible:*/
              addActive(x);
            } else if (e.keyCode == 38) { //up
              /*If the arrow UP key is pressed,
              decrease the currentFocus variable:*/
              currentFocus--;
              /*and and make the current item more visible:*/
              addActive(x);
            } else if (e.keyCode == 13) {
              /*If the ENTER key is pressed, prevent the form from being submitted,*/
              e.preventDefault();
              if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
              }
            }
        });
        function addActive(x) {
          /*a function to classify an item as "active":*/
          if (!x) return false;
          /*start by removing the "active" class on all items:*/
          removeActive(x);
          if (currentFocus >= x.length) currentFocus = 0;
          if (currentFocus < 0) currentFocus = (x.length - 1);
          /*add class "autocomplete-active":*/
          x[currentFocus].classList.add("autocomplete-active");
        }
        function removeActive(x) {
          /*a function to remove the "active" class from all autocomplete items:*/
          for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
          }
        }
        function closeAllLists(elmnt) {
          /*close all autocomplete lists in the document,
          except the one passed as an argument:*/
          var x = document.getElementsByClassName("autocomplete-items");
          for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
            x[i].parentNode.removeChild(x[i]);
          }
        }
      }
      /*execute a function when someone clicks in the document:*/
      document.addEventListener("click", function (e) {
          closeAllLists(e.target);
      });
      }
    // async function getStation(){
    //     let station = document.querySelector("#searchStation").value
    //     console.log(station)
    //     let stationLost
    //     let stationFound
    //     await fetch(`https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/objets-trouves-gares/records?select=COUNT(*)%20as%20number%2C%20date&where=SEARCH(%22${station}%22)&group_by=RANGE(date%2C%201day)%20as%20date&order_by=date%20DESC&limit=1`)
    //         .then(response => response.json())
    //         .then(data => {
    //             console.log(data)
    //             stationLost = data.results[0].number
    //             console.log(stationLost)
    //             return stationLost
    //         })
    //     document.getElementById("stationLostToday").innerHTML = stationLost
    //     await fetch(`https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/objets-trouves-restitution/records?select=COUNT(*)%20as%20number%2C%20date&where=SEARCH(%22${station}%22)&group_by=RANGE(date%2C%201%20day)%20as%20date&order_by=date%20DESC&limit=1`)
    //         .then(response => response.json())
    //         .then(data => {
    //             stationFound = data.results[0].number
    //             console.log(stationFound)
    //             return stationFound
    //         })
    //     document.getElementById("stationFoundToday").innerHTML = stationFound
    // }
    async function getStation() {
        let station = document.querySelector("#searchStation").value;
        console.log(station);
    
        // Initialize stationLost and stationFound with 0
        let stationLost = 0;
        let stationFound = 0;
    
        // Fetch station lost data
        await fetch(`https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/objets-trouves-gares/records?select=COUNT(*)%20as%20number%2C%20date&where=SEARCH(%22${station}%22)&group_by=RANGE(date%2C%201day)%20as%20date&order_by=date%20DESC&limit=1`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                stationLost = data.results[0].number || 0; // Update stationLost with API data or set it to 0
                console.log(stationLost);
            })
            .catch(error => {
                console.log(`Error fetching stationLost data:`, error);
            });
    
        // Update stationLostToday span with stationLost value
        document.getElementById("stationLostToday").innerHTML = stationLost;
    
        // Fetch station found data
        await fetch(`https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/objets-trouves-restitution/records?select=COUNT(*)%20as%20number%2C%20date&where=SEARCH(%22${station}%22)&group_by=RANGE(date%2C%201%20day)%20as%20date&order_by=date%20DESC&limit=1`)
            .then(response => response.json())
            .then(data => {
                stationFound = data.results[0].number || 0; // Update stationFound with API data or set it to 0
                console.log(stationFound);
            })
            .catch(error => {
                console.log(`Error fetching stationFound data:`, error);
            });
    
        // Update stationFoundToday span with stationFound value
        document.getElementById("stationFoundToday").innerHTML = stationFound;
    }
    
   

autocomplete(document.getElementById("searchStation"));
percentageSixMonths()
