import './style.css'


let op=document.getElementById("op")
let fetchs=document.getElementById("fetch")
let listNutrition=document.getElementById("listNutrition")

async function FoodNutrition() {
    // Fetch foods and nutrition immediately on page load
    try {
        let food = await fetch('https://food-nutrition-1.onrender.com/foods');
        let res = await food.json();
        options(res);
    } catch(err) {
        console.log("error fetching foods:", err);
    }
    try {
        let nutrition = await fetch('https://food-nutrition-1.onrender.com/nutrition');
        let res1 = await nutrition.json();
        FetchNu(res1);
    } catch(err) {
        console.log("error fetching nutrition:", err);
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