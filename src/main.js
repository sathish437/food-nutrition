import './style.css'


let op=document.getElementById("op")
let fetchs=document.getElementById("fetch")
let listNutrition=document.getElementById("listNutrition")

async function FoodNutrition() {
    // Show loading state immediately on page load
    listNutrition.innerHTML = `
        <div id="api-loading-state" class="flex flex-col items-center justify-center h-full text-center text-white">
            <p class="text-lg font-semibold animate-pulse">Loading data...</p>
        </div>
    `;

    // Set a timeout to show the optional message if server spin-up is taking time
    let startUpTimeout = setTimeout(() => {
        let loadingState = document.getElementById("api-loading-state");
        if (loadingState) {
            let optionalMsg = document.createElement("p");
            optionalMsg.className = "text-sm mt-2 text-red-100 animate-bounce";
            optionalMsg.textContent = "The server is starting up. Please wait a moment.";
            loadingState.appendChild(optionalMsg);
        }
    }, 1500);

    // Fetch foods and nutrition immediately on page load
    try {
        let [foodResponse, nutritionResponse] = await Promise.all([
            fetch('https://food-nutrition-1.onrender.com/foods'),
            fetch('https://food-nutrition-1.onrender.com/nutrition')
        ]);

        if (!foodResponse.ok || !nutritionResponse.ok) {
            throw new Error("Failed to fetch data from server");
        }

        let res = await foodResponse.json();
        let res1 = await nutritionResponse.json();

        // Clear loading timeout and reset UI state on success
        clearTimeout(startUpTimeout);
        listNutrition.innerHTML = "";

        options(res);
        FetchNu(res1);
    } catch(err) {
        clearTimeout(startUpTimeout);
        console.log("error fetching data:", err);
        
        // Show error state inside the output container
        listNutrition.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-center text-red-950 font-bold bg-red-200/90 p-4 rounded-2xl border-2 border-red-500 shadow-md">
                <p>Failed to load data.</p>
                <p class="text-xs font-normal mt-2 text-red-900">Please check your network or try again later.</p>
            </div>
        `;
    }

    // Continue fetching every 5 minutes
    setInterval(async () => {
        try {
            if(document.visibilityState==="visible"){
                let food=await fetch('https://food-nutrition-1.onrender.com/foods')
                let res=await food.json()
                options(res)
            }
        } catch(err) {
            console.log("error fetching foods:", err)
        }
    }, 5 * 60 * 1000);
    setInterval(async () => {
        try {
            if(document.visibilityState==="visible"){
                let nutrition=await fetch(`https://food-nutrition-1.onrender.com/nutrition`)
                let res1=await nutrition.json()
                FetchNu(res1)
            }
        } catch(err) {
            console.log("error fetching nutrition:", err)
        }
    }, 5 * 60 * 1000);
}

function options(res){
    let Foods=Object.values(res)
    for(let i=0;i<Foods.length;i++){
      op.innerHTML +=`<option  class="bg-red-300 p-2 rounded-2xl foodOp" value="${Foods[i].food}">${Foods[i].food}</option>`
    }
}

function FetchNu(res1){
    let listNu=Object.values(res1)
    click(listNu)
}

function click(listNu){
    fetchs.addEventListener('click',()=>{
        let indexId=op.selectedIndex
        let indexOp=op.options[indexId].text
        let cal=listNu[indexId].cal
        let pro=listNu[indexId].protein
        let fat=listNu[indexId].fat
        let NutritionData=`<h1 class="text-center font-semibold text-[18px]">${indexOp}</h1>
                            <div class="mt-4">
                                <p> > Calories :${cal} kacl</p>
                                <p> > Protein  : ${pro}g</p>
                                <p> > Fat      : ${fat}g</p>
                            </div>`
        listNutrition.innerHTML=NutritionData
    })
}

FoodNutrition()