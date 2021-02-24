'use babel';

import ThemedTitleBarView from './themed-title-bar-view';
import { CompositeDisposable } from 'atom';

export default {

  themedTitleBarView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.themedTitleBarView = new ThemedTitleBarView(state.themedTitleBarViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.themedTitleBarView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'themed-title-bar:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.themedTitleBarView.destroy();
  },

  serialize() {
    return {
      themedTitleBarViewState: this.themedTitleBarView.serialize()
    };
  },

  toggle() {
    console.log('ThemedTitleBar was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
