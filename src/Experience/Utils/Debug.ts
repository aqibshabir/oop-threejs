import GUI from 'lil-gui';

export default class Debug {
  ui;
  constructor() {
    this.ui = new GUI();
    const titleElement = this.ui.domElement.parentElement?.querySelector('.title');
    if (titleElement) {
      titleElement.textContent = 'Debug';
    }
  }
}
