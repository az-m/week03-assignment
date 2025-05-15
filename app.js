// globals

let counter = 0;
let upgradeDataLocal = [];
let upgradePurchases = {};
let timer;

// listeners

document.getElementById("clicker").addEventListener("click", () => {
  counter = counter + 1;
  document.getElementById("counter").textContent = counter;
});

// actions

theAutomatedBit();

// functions

async function theAutomatedBit() {
  const upgradeData = await getUpgrades();
  setUpgradeDataLocal(upgradeData);

  makeUpgradeElements(upgradeData);
  upgradesClick();

  timer = setInterval(timerHandler, 1000);
}

async function getUpgrades() {
  // go go get upgrade item info
  const response = await fetch(
    "https://cookie-upgrade-api.vercel.app/api/upgrades"
  );
  const upgradeData = await response.json();
  return upgradeData;
}

function setUpgradeDataLocal(upgradeArr) {
  upgradeDataLocal = upgradeArr;
}

function makeUpgradeElements(upgradeArr) {
  // creates the div for each upgrade item, populates it with the name and cost, and adds it to the upgrades section in the dom
  upgradeArr.forEach((item, index) => {
    const el = document.createElement("div");
    el.setAttribute("class", "upgrade");
    el.setAttribute("id", item.id);
    const section = document.getElementById("upgrades");
    section.appendChild(el);

    const pName = document.createElement("p");
    const pCost = document.createElement("p");

    pName.textContent = item.name;
    pCost.textContent = item.cost;

    const div = document.getElementsByClassName("upgrade")[index];

    div.appendChild(pName);
    div.appendChild(pCost);
  });
}

function upgradesClick() {
  // for each of the upgrade div elements we created we want a separate click event, so lets get them all and go through them
  const upgradeDivs = document.getElementById("upgrades").children;
  for (let div of upgradeDivs) {
    div.addEventListener("click", () => {
      let id = div.getAttribute("id");

      //we can only purchase an item if we have enough 'cookies' so
      let price = upgradeDataLocal[id - 1].cost;
      if (counter >= price) {
        // did we already buy one of these? if not, add a new key for it otherwise increment number we own
        if (id in upgradePurchases) {
          upgradePurchases[id]++;
        } else {
          upgradePurchases[id] = 1;
        }
        // update our purchases in the local storage
        localStorage.setItem(
          "upgradesStored",
          JSON.stringify(upgradePurchases)
        );
      }
    });
  }
}

function timerHandler() {
  // every second, we check for purchases, add up the total increases contributed by the items, and add the total to the overall 'cookie' count
  n = 0;
  for (i = 1; i <= upgradeDataLocal.length; i++) {
    if (i in upgradePurchases) {
      n = n + upgradeDataLocal[i - 1].increase * upgradePurchases[i];
    }
  }
  counter = counter + n;
  document.getElementById("perSec").textContent = n;
  document.getElementById("counter").textContent = counter;
}

resetButton.addEventListener("click", () => {
  // this resets all progress back to 0
  localStorage.clear();
  upgradePurchases = {};
  counter = 0;
  document.getElementById("perSec").textContent = 0;
  document.getElementById("counter").textContent = 0;
});

document.getElementById("stopTimer").addEventListener("click", () => {
  //this is just to stop it running while I style things or just want it to stop. take it out later.
  clearInterval(timer);
  timer = null;
});
