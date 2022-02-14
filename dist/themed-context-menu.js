var b=Object.defineProperty;var v=o=>b(o,"__esModule",{value:!0});var x=(o,e)=>{for(var t in e)b(o,t,{get:e[t],enumerable:!0})};v(exports);x(exports,{TCMHandler:()=>c,activate:()=>E,deactivate:()=>g});var p=class{constructor(e,t,n){this.selected=!1;this.navSubmenu=!1;this.hidden=!1;var u,s,i,M;this.itemData=t,this.height=23,this.parent=e,this.target=n;let a;if(t.type){a=document.createElement("div"),a.classList.add("menu-item");let m=document.createElement("div");m.classList.add("separator"),a.appendChild(m),this.height=7}if(!t.type){a=document.createElement("div"),a.classList.add("menu-item");let m=document.createElement("span");m.classList.add("menu-item-name"),m.innerHTML=(s=(u=t.id)!=null?u:t.label)!=null?s:"";let h=document.createElement("span");if(h.classList.add("menu-item-key"),t.command){let f=atom.keymaps.findKeyBindings({command:t.command});h.innerHTML=(M=(i=f[0])==null?void 0:i.keystrokes.toLocaleLowerCase())!=null?M:""}t.submenu!==void 0&&a.classList.add("has-submenu"),a.appendChild(m),a.appendChild(h)}this.domElement=a,this.domElement.addEventListener("click",m=>this.onMouseClick(m)),this.domElement.addEventListener("mouseenter",m=>this.onMouseEnter(m))}onMouseClick(e){e.stopPropagation(),this.callExecCommand()}callExecCommand(){var e;this.hasCommand()?(this.execCommand(),this.parent.deleteContextMenu()):this.itemData.submenu&&((e=this.submenu)==null||e.fireCommand())}hasCommand(){return this.itemData.command!==void 0}isSubmenu(){return!!this.itemData.submenu}onMouseEnter(e){this.isSeparator()||(e.stopPropagation(),this.select(),this.displaySubmenu())}createSubmenu(){let e=this.itemData.submenu;if(e&&!this.submenu){let t=this.domElement.getBoundingClientRect(),n={target:this.target,clientX:t.left+300,clientY:t.top,isSubmenu:!0};this.submenu=new d(n,e,!1)}}displaySubmenu(){var e;this.createSubmenu(),(e=this.submenu)==null||e.setVisible(!0)}select(){this.parent.unselectAll(),this.selected=!0,this.domElement.classList.add("selected")}unselect(){var e;this.selected=!1,this.domElement.classList.remove("selected"),(e=this.submenu)==null||e.setVisible(!1)}isSelected(){return this.selected}isNavigating(){return this.navSubmenu}isSeparator(){return this.itemData.type}setNavigating(e){this.navSubmenu=e,e?this.submenuNavigate("Down"):(this.unselect(),this.select(),this.displaySubmenu())}hideElement(){this.hidden=!0,this.domElement.classList.add("not-search-result")}showElement(){this.hidden=!1,this.domElement.classList.remove("not-search-result")}submenuNavigate(e){var t;this.isSubmenu()&&((t=this.submenu)==null||t.navigate(e))}searchResult(e){var a;if(this.isSeparator())return!1;let t=this.itemData;if(t.submenu){if(t.id.toLocaleLowerCase().includes(e.toLocaleLowerCase()))return!0;let u=t.submenu.filter(s=>s.id.toLocaleLowerCase().includes(e.toLocaleLowerCase()));return(a=this.submenu)==null||a.searchItem({target:{value:e}}),u.length>0}let n=this.itemData;return n.id?n.id.toLocaleLowerCase().includes(e.toLocaleLowerCase()):!1}async execCommand(){var n;let e=this.target||((n=atom.workspace.getActiveTextEditor())==null?void 0:n.getElement())||atom.workspace.getActivePane().getElement(),t=this.itemData;await atom.commands.dispatch(e,t.command,t.commandDetail)}getElement(){return this.domElement}getHeight(){return this.height}};var r;(function(o){o[o.Submenu=0]="Submenu",o[o.Separator=1]="Separator",o[o.Command=2]="Command"})(r||(r={}));function l(o,e){switch(e){case 0:return!!o.submenu;case 1:return!!o.type;case 2:return!!o.command;default:return!1}}var d=class{constructor(e,t,n){this.itemData=[];this.items=[];this.visible=!0;var a;if(this.itemData=t,this.hasSearchBox=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("submenu"),!e.isSubmenu){let u=document.createElement("div");u.classList.add("context-menu-search-container");let s=document.createElement("input");s.type="search",s.id="context-menu-search-input",s.placeholder="Search",s.addEventListener("input",i=>this.searchItem(i)),s.addEventListener("keydown",i=>this.specialKeyHandle(i)),u.appendChild(s),this.domElement.appendChild(u),this.hasSearchBox=!0}if(n||(this.visible=!1,this.domElement.classList.add("invisible")),l(t[0],r.Separator)&&t.splice(0,1),l(t[t.length-1],r.Separator)&&t.splice(t.length-1,1),!e.isSubmenu){let u=t.filter(s=>l(s,r.Command)&&s.id.includes("Split"));t=t.filter(s=>!l(s,r.Command)||l(s,r.Command)&&!s.id.includes("Split")),t.splice(9,0,{id:"Split Pane",submenu:u})}t.forEach(u=>{this.addItem(u)}),this.position=this.getPositionStyleString(e),this.domElement.setAttribute("style",`top: ${this.position.y}px; left: ${this.position.x}px;`),c.addContextMenu(this.domElement),e.isSubmenu||(a=document.getElementById("context-menu-search-input"))==null||a.focus()}unselectAll(){this.items.forEach(e=>e.unselect())}deleteContextMenu(){c.deleteContextMenu()}setVisible(e){this.visible=e,e?this.domElement.classList.remove("invisible"):(this.domElement.classList.add("invisible"),this.unselectAll())}getPositionStyleString(e){let t=Math.min(e.clientX+(e.isSubmenu?0:10),window.innerWidth-310),n=Math.min(e.clientY+(e.isSubmenu?0:5),window.innerHeight-this.getHeight()-10);return e.isSubmenu&&t===window.innerWidth-310&&e.clientX-600>=0&&(t=e.clientX-600),t=Math.max(0,t),n=Math.max(10,n),{x:t,y:n}}addItem(e){let t=new p(this,e);this.items.push(t),this.domElement.appendChild(t.getElement())}getHeight(){return this.items.length===0?0:this.items.map(e=>e.getHeight()).reduce(function(e,t){return e+t})+(this.hasSearchBox?40:0)}specialKeyHandle(e){switch(e.key){case"Escape":let t=document.getElementById("context-menu-search-input");t.value.length===0?this.deleteContextMenu():(t.value="",this.clearSearch());return;case"Enter":this.fireCommand();return;case"ArrowUp":this.navigate("Up");return;case"ArrowDown":this.navigate("Down");return;case"ArrowLeft":this.navigate("Left");return;case"ArrowRight":this.navigate("Right");return}}fireCommand(){var e;(e=this.items.find(t=>t.isSelected()))==null||e.callExecCommand()}navigate(e){var s;let t=this.items.findIndex(i=>i.isSelected()),n=this.items.length,a=window.innerWidth-this.position.x>610?"Right":"Left",u=["Left","Right"].filter(i=>i!==a)[0];if(t&&((s=this.items[t])==null?void 0:s.isSubmenu())){if(this.items[t].isNavigating())if(e===u){this.items[t].setNavigating(!1);return}else{this.items[t].submenuNavigate(e);return}else if(e===a){this.items[t].setNavigating(!0);return}}if(e==="Up"){let i=(n+(t!=null?t:n)-1)%n;for(;this.items[i].isSeparator();)i=(n+i-1)%n;this.items[i].select(),this.items[i].displaySubmenu();return}else if(e==="Down"){let i=(n+(t!=null?t:-1)+1)%n;for(;this.items[i].isSeparator();)i=(n+i+1)%n;this.items[i].select(),this.items[i].displaySubmenu();return}}clearSearch(){this.items.forEach(e=>e.showElement())}searchItem(e){let t=e.target.value;this.clearSearch(),this.items.filter(n=>!n.searchResult(t)).forEach(n=>n.hideElement())}};var C=class{constructor(){this.parentContainer=document.createElement("div"),this.parentContainer.classList.add("themed-context-menu");let e=document.querySelector("atom-workspace");e==null||e.appendChild(this.parentContainer)}hijackFunction(){let e=atom.contextMenu;this.hijackedFunction=e.showForEvent,e.showForEvent=t=>{let n=e.templateForEvent(t);this.displayContextMenu(t,n)}}releaseFunction(){let e=atom.contextMenu;e.showForEvent=this.hijackedFunction}displayContextMenu(e,t){var n;this.deleteContextMenu(),(n=document.activeElement)==null||n.blur(),t.length>0&&setTimeout(()=>this.activeMenu=new d(e,t,!0),110)}addContextMenu(e){this.parentContainer.appendChild(e)}deleteContextMenu(){for(;this.parentContainer.firstChild;)this.parentContainer.removeChild(this.parentContainer.firstChild)}};var c=new C;function E(){c.hijackFunction()}function g(){c.releaseFunction()}
//# sourceMappingURL=themed-context-menu.js.map
