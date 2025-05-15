//globals

let counter = 0;
let upgradeDataLocal = [];
let upgradePurchases = {};
let timer;

document.getElementById("clicker").addEventListener("click", () => {
  counter = counter + 1;
  document.getElementById("counter").textContent = counter;
});

theAutomatedBit();

async function theAutomatedBit() {
  const upgradeData = await getUpgrades();
  setUpgradeDataLocal(upgradeData);

  makeUpgradeElements(upgradeData);
  upgradesClick();

  console.log(upgradeDataLocal);

  timer = setInterval(timerHandler, 1000);
}

async function getUpgrades() {
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
  const upgradeDivs = document.getElementById("upgrades").children;
  for (let div of upgradeDivs) {
    div.addEventListener("click", () => {
      let id = div.getAttribute("id");
      if (id in upgradePurchases) {
        upgradePurchases[id]++;
      } else {
        upgradePurchases[id] = 1;
      }
      localStorage.setItem("upgradesStored", JSON.stringify(upgradePurchases));
    });
  }
}

function timerHandler() {
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
  localStorage.clear();
  upgradePurchases = {};
  document.getElementById("perSec").textContent = 0;
  document.getElementById("counter").textContent = 0;
});
