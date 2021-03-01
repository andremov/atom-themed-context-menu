var m=Object.defineProperty;var u=s=>m(s,"__esModule",{value:!0});var h=(s,e)=>{for(var t in e)m(s,t,{get:e[t],enumerable:!0})};u(exports);h(exports,{activate:()=>v,deactivate:()=>p});var i=class{constructor(e,t,n){this.selected=!1;this.element=e,this.parent=t,this.height=n,this.element.addEventListener("click",o=>this.onMouseClick(o))}static createMenuItem(e,t){if(e.type==="separator")return new i(document.createElement("hr"),t,7);let n=document.createElement("div");n.classList.add("menu-item");let o=new i(n,t,23),a=document.createElement("span");a.classList.add("menu-item-name"),a.innerHTML=e.label?e.label:"";let l=document.createElement("span");if(l.classList.add("menu-item-key"),n.appendChild(a),n.appendChild(l),e.command!==void 0){o.command=e.command,o.commandDetail=e.commandDetail;let r=atom.keymaps.findKeyBindings({command:e.command});r.length>0&&(l.innerHTML=r[r.length-1].keystrokes)}return o}onMouseClick(e){e.stopPropagation(),this.execCommand(),this.parent.deleteContextMenu()}async execCommand(){var t;if(this.command===void 0)return;let e=((t=atom.workspace.getActiveTextEditor())==null?void 0:t.getElement())||atom.workspace.getActivePane().getElement();await atom.commands.dispatch(e,this.command,this.commandDetail)}getElement(){return this.element}getHeight(){return this.height}};var c=class{constructor(){this.visible=!1;this.children=[];document.addEventListener("click",n=>this.onMouseClick(n));let e=document.querySelector("body");this.windowBlurObserver=new MutationObserver(n=>this.windowBlurCallback(n,this)),e&&this.windowBlurObserver.observe(e,{attributeFilter:["class"]}),this.activeContextMenu=document.createElement("div"),this.activeContextMenu.classList.add("themed-context-menu"),this.activeContextMenu.classList.add("invisible");let t=document.querySelector("atom-workspace");t==null||t.appendChild(this.activeContextMenu)}hijackFunction(){let e=atom.contextMenu;this.hijackedFunction=e.showForEvent,e.showForEvent=t=>{let n=e.templateForEvent(t);this.displayContext(t,n)}}releaseFunction(){let e=atom.contextMenu;e.showForEvent=this.hijackedFunction}displayContext(e,t){this.deleteContextMenu(),this.visible=!0,this.activeContextMenu.classList.remove("invisible"),t.forEach(n=>{this.addChild(n)}),this.activeContextMenu.setAttribute("style",this.getPositionStyleString(e))}displayContextMenu(e,t){this.lastClick!==void 0&&this.lastClick!==e&&this.deleteContextMenu(),this.visible=!0,this.lastClick=e,this.activeContextMenu.classList.remove("invisible"),t.forEach(n=>{this.addChild(n)}),this.activeContextMenu.setAttribute("style",this.getPositionStyleString(e))}windowBlurCallback(e,t){}addChild(e){var n;let t=i.createMenuItem(e,this);this.children.push(t),(n=this.activeContextMenu)==null||n.appendChild(t.getElement())}onMouseClick(e){this.deleteContextMenu()}getPositionStyleString(e){let t=e.clientX+10+5,n=e.clientY+5;return t=Math.min(t,window.innerWidth-310),n=Math.min(n,window.innerHeight-this.getHeight()-10),"top:"+n+"px; left:"+t+"px"}getHeight(){return this.children.map(e=>e.getHeight()).reduce(function(e,t){return e+t})}deleteContextMenu(){this.visible&&(this.visible=!1,this.children=[],this.activeContextMenu.classList.add("invisible"),this.lastClick=void 0,this.removeAllChildNodes())}removeAllChildNodes(){for(;this.activeContextMenu.firstChild;)this.activeContextMenu.removeChild(this.activeContextMenu.firstChild)}};var d=new c;function v(){console.log("hello!"),d.hijackFunction()}function p(){console.log("goodbye!"),d.releaseFunction()}
//# sourceMappingURL=themed-context-menu.js.map
