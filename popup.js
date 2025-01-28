const exclusionsList = document.getElementById("exclusions-list");
const newPatternInput = document.getElementById("new-pattern");
const addPatternButton = document.getElementById("add-pattern");

async function loadExclusions() {
  const { exclusions } = await browser.storage.local.get({ exclusions: [] });
  exclusionsList.innerHTML = "";

  exclusions.forEach((pattern, index) => {
    const li = document.createElement("li");
    li.textContent = pattern;

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.style.marginLeft = "10px";
    removeButton.onclick = async () => {
      exclusions.splice(index, 1);
      await browser.storage.local.set({ exclusions });
      loadExclusions();
    };

    li.appendChild(removeButton);
    exclusionsList.appendChild(li);
  });
}

addPatternButton.addEventListener("click", async () => {
  const newPattern = newPatternInput.value.trim();
  if (!newPattern) return;

  const { exclusions } = await browser.storage.local.get({ exclusions: [] });
  exclusions.push(newPattern);
  await browser.storage.local.set({ exclusions });

  newPatternInput.value = "";
  loadExclusions();
});

loadExclusions();

