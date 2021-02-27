'use babel';

import ThemedContextMenuView from './themed-context-menu-view';
import { CompositeDisposable } from 'atom';

export default {

  themedContextMenuView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.themedContextMenuView = new ThemedContextMenuView(state.themedContextMenuViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.themedContextMenuView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'themed-context-menu:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.themedContextMenuView.destroy();
  },

  serialize() {
    return {
      themedContextMenuViewState: this.themedContextMenuView.serialize()
    };
  },

  toggle() {
    console.log('ThemedContextMenu was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
