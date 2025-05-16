// globals

let counter = 0;
let upgradeDataLocal = [];
let upgradePurchases = {};
let timer;

let counterHolder = document.getElementById("counter");
let perSecHolder = document.getElementById("perSec");

// synchronous listeners

document.getElementById("clicker").addEventListener("click", () => {
  counter = counter + 1;
  counterHolder.textContent = counter;
  localStorage.setItem("counterStored", counter);
});

document.getElementById("resetButton").addEventListener("click", () => {
  // this resets all progress back to 0
  localStorage.clear();
  location.reload();
});

// actions

theAutomatedBit();

// functions

async function theAutomatedBit() {
  const upgradeData = await getUpgrades();
  setUpgradeDataLocal(upgradeData);

  makeUpgradeElements(upgradeData);
  upgradesClick();

  highlightPurchaseables();
  showUpgradesCount();

  // runs all the per second stuff
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
    const newDiv = document.createElement("div");
    newDiv.setAttribute("class", "upgrade");
    newDiv.setAttribute("id", item.id);
    const section = document.getElementById("upgrades");
    section.appendChild(newDiv);

    const pName = document.createElement("p");
    const pCost = document.createElement("p");

    pName.textContent = item.name;
    pCost.textContent = item.cost;

    // get the div we just added back from the DOM to add its content elements
    const div = document.getElementsByClassName("upgrade")[index];
    const span = document.createElement("span");

    div.appendChild(span);

    // ditto the span
    const getSpanFromDom = div.querySelector("span");

    getSpanFromDom.appendChild(pName);
    getSpanFromDom.appendChild(pCost);
  });
}

function upgradesClick() {
  // for each of the upgrade div elements we created we want a separate click event, so lets get them all and go through them
  const upgradeDivs = document.getElementById("upgrades").children;
  for (let div of upgradeDivs) {
    div.addEventListener("click", () => {
      let id = div.getAttribute("id");

      // we can only purchase an item if we have enough 'cookies' so
      let price = upgradeDataLocal[id - 1].cost;
      if (counter >= price) {
        // did we already buy one of these? if not, add a new key for it otherwise increment number we own
        if (id in upgradePurchases) {
          upgradePurchases[id]++;
        } else {
          upgradePurchases[id] = 1;
        }

        // take the cost of our purchase off the count total
        counter = counter - price;
        counterHolder.textContent = counter;

        // update our purchases in the local storage
        localStorage.setItem(
          "upgradesStored",
          JSON.stringify(upgradePurchases)
        );
        localStorage.setItem("counterStored", counter);
      }
      highlightPurchaseables();
      showUpgradesCount();
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
  perSecHolder.textContent = n;
  counterHolder.textContent = counter;
  localStorage.setItem("counterStored", counter);

  // we want to show the user which upgrades are available - we're also checking this every second
  // I'll break this out into a separate function because we want to use it immediately when a purchase is made too. And when the page loads.
  highlightPurchaseables();
}

function highlightPurchaseables() {
  // change the class on the upgrade divs to show if you can buy them or not
  upgradeDataLocal.forEach((item) => {
    let el = document.getElementById(item.id);
    if (item.cost <= counter) {
      el.removeAttribute("class");
      el.setAttribute("class", "upgrade_available");
    } else {
      if ((el.className = "upgrade_available")) {
        el.removeAttribute("class");
        el.setAttribute("class", "upgrade");
      }
    }
  });
}

function showUpgradesCount() {
  // display how many of each upgrade have been purchased next to the upgrade
  for (const [key, value] of Object.entries(upgradePurchases)) {
    const div = document.createElement("div");
    div.textContent = `${value}`;
    const parent = document.getElementById(key);
    if (parent.querySelector("div")) {
      parent.querySelector("div").textContent = `${value}`;
    } else {
      parent.appendChild(div);
    }
  }
}

function loadStorage() {
  // I want to load the local storage back in if it exists
  if (localStorage.getItem("counterStored")) {
    counter = Number(localStorage.getItem("counterStored"));
    counterHolder.textContent = counter;
  }
  if (localStorage.getItem("upgradesStored")) {
    upgradePurchases = JSON.parse(localStorage.getItem("upgradesStored"));
  }
}
