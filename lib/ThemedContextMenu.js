
class ThemedContextMenu {
	constructor() {}

	activate() {
		console.log("hello!");
		let contextMenuItems = atom.contextMenu.itemSets.filter(
			(item) => item.items.length > 1
		);
		let triggeringItem = contextMenuItems[0];

		let domElems = document.querySelectorAll(triggeringItem.selector);
		domElems.forEach(item => this.hijackContextMenu(item, triggeringItem.items))
	}

	deactivate() {

	}

	hijackContextMenu(domElement, items){
	  domElement.addEventListener("contextmenu", (e) => {
	    e.preventDefault();
	    e.stopPropagation();
	    console.log(items);

	    this.createContextMenu(e, items);
	  });
	}

	createContextMenu(e, items) {
	  const context = document.createElement("div");
	  context.classList.add("themed-context-menu");

	  for (let i = 0; i < items.length; i++) {
	    const itemSpan = document.createElement("span");
	    itemSpan.classList.add("menu-item");
		itemSpan.innerHTML = items[i].label;
	    context.appendChild(itemSpan);
	  }
	  
	  context.setAttribute("style", "top:"+e.clientY+"px; left:"+e.clientX+"px")
	  document.querySelector("atom-workspace").appendChild(context);
	}
}

module.exports = {ThemedContextMenu}
