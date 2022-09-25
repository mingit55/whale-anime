export class PixelViewer {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.sceans = [];
    this.width = 0;
    this.height = 0;
    this.index = 0;

    document.body.append(this.canvas);

    window.addEventListener('resize', this.resize.bind(this));
    this.resize();

    this.render();
  }

  resize() {
    this.canvas.width = document.body.clientWidth;
    this.canvas.height = document.body.clientHeight;
  }

  setData(data) {
    const { width, height, sceans } = data || {};
    if (!data) return;

    this.width = width;
    this.height = height;
    this.sceans = sceans.filter(scean => scean.length > 0);
  }

  render() {
    if (this.sceans.length === 0) return requestAnimationFrame(this.render.bind(this));;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.strokeStyle = this.ctx.fillStyle = '#54caf1';

    const vx = this.canvas.width / 2 - this.width / 2;
    const vy = this.canvas.height / 2 - this.height / 2;
    const scean = this.sceans[this.index];
    scean.forEach(([x, y]) => {
      this.ctx.fillRect(vx + x, vy + y, 1, 1);
    });

    this.index = this.index + 3 >= this.sceans.length ? 0 : this.index + 3;
    requestAnimationFrame(this.render.bind(this));
  }
}
