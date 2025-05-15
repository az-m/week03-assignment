const data = {
  counter: 0,
  cps: 0,
};

createUpgrades();

async function createUpgrades() {
  const upgradeData = await getUpgrades();
  makeUpgradeElements(upgradeData);
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
