const stack = [];
let nextId = 1;
let removedTotal = 0;

const itemType = document.getElementById("itemType");
const itemLabel = document.getElementById("itemLabel");
const stackItems = document.getElementById("stackItems");
const countBadge = document.getElementById("countBadge");
const plateCount = document.getElementById("plateCount");
const trayCount = document.getElementById("trayCount");
const removedCount = document.getElementById("removedCount");
const message = document.getElementById("message");
const historyList = document.getElementById("historyList");

function showMessage(text, kind = "") {
  message.textContent = text;
  message.className = `message ${kind}`.trim();
}

function addLog(action, item, detail = "") {
  const empty = historyList.querySelector(".history-empty");
  if (empty) empty.remove();

  const li = document.createElement("li");
  const mark = document.createElement("span");
  mark.className = `log-mark ${action === "POP" ? "pop" : ""}`;
  mark.textContent = action === "PUSH" ? "+" : action === "POP" ? "−" : action === "PEEK" ? "◎" : "↻";

  const description = document.createElement("span");
  description.textContent = detail || `${action}: ${item ? item.name : "stack"}`;

  const time = document.createElement("time");
  time.className = "log-time";
  time.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  li.append(mark, description, time);
  historyList.prepend(li);

  while (historyList.children.length > 8) historyList.lastElementChild.remove();
}

function render() {
  stackItems.replaceChildren();

  if (stack.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    const icon = document.createElement("div");
    icon.className = "empty-icon";
    icon.textContent = "▤";
    const strong = document.createElement("strong");
    strong.textContent = "Your stack is empty";
    const span = document.createElement("span");
    span.textContent = "Add a plate or tray to get started.";
    empty.append(icon, strong, span);
    stackItems.append(empty);
  } else {
    // Render from the stack's bottom to top so the newest item appears at the top visually.
    [...stack].forEach((item, index) => {
      const isTop = index === stack.length - 1;
      const card = document.createElement("div");
      card.className = `stack-item ${item.type === "Tray" ? "tray" : ""} ${isTop ? "top-item" : ""}`.trim();

      const symbol = document.createElement("span");
      symbol.className = "item-symbol";
      symbol.textContent = item.type === "Tray" ? "▱" : "◉";

      const name = document.createElement("span");
      name.className = "item-name";
      name.textContent = item.name;

      const id = document.createElement("span");
      id.className = "item-id";
      id.textContent = `#${item.id}`;

      card.append(symbol, name);
      if (isTop) {
        const topTag = document.createElement("span");
        topTag.className = "top-tag";
        topTag.textContent = "TOP";
        card.append(topTag);
      }
      card.append(id);
      stackItems.append(card);
    });
  }

  countBadge.textContent = `${stack.length} ${stack.length === 1 ? "item" : "items"}`;
  plateCount.textContent = stack.filter(item => item.type === "Plate").length;
  trayCount.textContent = stack.filter(item => item.type === "Tray").length;
  removedCount.textContent = removedTotal;
}

document.getElementById("pushBtn").addEventListener("click", () => {
  const type = itemType.value;
  const label = itemLabel.value.trim();
  const item = {
    id: nextId++,
    type,
    name: label || `${type} ${nextId - 1}`
  };
  stack.push(item); // PUSH: add the new item to the top.
  itemLabel.value = "";
  render();
  showMessage(`${item.name} was added to the top of the stack.`, "success");
  addLog("PUSH", item, `Added ${item.name} to the top.`);
});

document.getElementById("popBtn").addEventListener("click", () => {
  if (stack.length === 0) {
    showMessage("The stack is empty. Add a plate or tray before removing an item.", "error");
    return;
  }
  const item = stack.pop(); // POP: remove the most recently added item.
  removedTotal++;
  render();
  showMessage(`${item.name} was removed from the top of the stack.`, "success");
  addLog("POP", item, `Removed ${item.name} from the top.`);
});

document.getElementById("peekBtn").addEventListener("click", () => {
  if (stack.length === 0) {
    showMessage("The stack is empty. There is no top item to view.", "error");
    return;
  }
  const item = stack[stack.length - 1]; // PEEK: read the top without removing it.
  showMessage(`Top item: ${item.name}. It remains in the stack.`, "success");
  addLog("PEEK", item, `Viewed top item: ${item.name}.`);
});

document.getElementById("resetBtn").addEventListener("click", () => {
  if (stack.length === 0) {
    showMessage("The stack is already empty.");
    return;
  }
  const amount = stack.length;
  stack.length = 0;
  render();
  showMessage(`Stack reset. ${amount} ${amount === 1 ? "item was" : "items were"} cleared.`, "success");
  addLog("RESET", null, `Cleared all ${amount} item(s) from the stack.`);
});

document.getElementById("clearLogBtn").addEventListener("click", () => {
  historyList.replaceChildren();
  const li = document.createElement("li");
  li.className = "history-empty";
  li.textContent = "No operations yet.";
  historyList.append(li);
  showMessage("Activity log cleared. Your current stack is unchanged.");
});

render();
