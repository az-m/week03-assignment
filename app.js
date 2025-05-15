const data = {
  counter: 0,
  cps: 0,
};

const upgradeData = {};

createUpgrades();

async function createUpgrades() {
  const upgradeData = await getUpgrades();
  makeUpgradeElements(upgradeData);
  upgradesClick();
}

async function getUpgrades() {
  const response = await fetch(
    "https://cookie-upgrade-api.vercel.app/api/upgrades"
  );
  const upgradeData = await response.json();
  return upgradeData;
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
      if (id in upgradeData) {
        upgradeData[id]++;
      } else {
        upgradeData[id] = 1;
      }
      localStorage.setItem("upgradesStored", JSON.stringify(upgradeData));
    });
  }
}

resetButton.addEventListener("click", (event) => {
  localStorage.clear();
  location.reload();
});
