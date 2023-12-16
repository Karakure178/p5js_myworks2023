class LoadImg {
  constructor() {
    this.img = new Image();
    this.img.onload = this.onLoad.bind(this);
  }
  onLoad() {
    console.log('onLoad');
  }
  load(url) {
    this.img.src = url;
  }
}
