import { observable, autorun, action, computed } from 'mobx';
import { IOrangeItem, OrangeArtboard } from '../classes';
import paper, {
  Group,
  Path,
  Point,
  Rectangle,
  Size,
  Tool,
} from 'paper';

export default class SelectorStore {
  @observable public selecteds: IOrangeItem[] = [];
  @observable public resizing: boolean = false;
  private _selectionRect: Path.Rectangle;
  private _selectionCorners: Path.Circle[] = [];

  constructor() {
    autorun(() => {
      this.update();
    });
  }

  public create() {
    const cornerStyle = {
      center: [0, 0],
      fillColor: 'white',
      radius: 5,
      strokeColor: 'gray',
    };
    this._selectionRect = new Path.Rectangle({
      fillColor: 'rgba(0, 0, 0, .0)',
      point: [0, 0],
      size: [100, 100],
      strokeColor: 'gray',
    });
    this._selectionCorners = [
      new Path.Circle(cornerStyle),
      new Path.Circle(cornerStyle),
      new Path.Circle(cornerStyle),
      new Path.Circle(cornerStyle),
    ];
    this._selectionCorners.forEach((corner, index) => {
      corner.visible = false;
      corner.data.resizer = true;
      corner.on('mousedrag', (ev: paper.ToolEvent) => this.resizeItens(index, ev.delta));
      corner.on('mousedown', (ev: paper.ToolEvent) => this.setResizing(true));
      corner.on('mouseup', (ev: paper.ToolEvent) => this.setResizing(false));
    });
    this._selectionRect.data.resizer = true;
    this._selectionRect.visible = false;
  }

  @action
  private setResizing(resizing: boolean) {
    this.resizing = resizing;
  }

  @action
  private resizeItens(corner: number, point: Point) {
    switch (corner) {
      case 0:
        this.selecteds.forEach((item) => {
          item.setPosition(item.position.x + point.x, item.position.y + point.y);
          item.setSize(item.size.width - point.x, item.size.height - point.y);
        });
        break;
      case 1:
        this.selecteds.forEach((item) => {
          item.setPosition(item.position.x, item.position.y + point.y);
          item.setSize(item.size.width + point.x, item.size.height - point.y);
        });
        break;
      case 2:
        this.selecteds.forEach((item) => {
          item.setSize(item.size.width + point.x, item.size.height + point.y);
        });
        break;
      case 3:
        this.selecteds.forEach((item) => {
          item.setPosition(item.position.x + point.x, item.position.y);
          item.setSize(item.size.width - point.x, item.size.height + point.y);
        });
        break;
    }
  }

  @computed get selectedArtboards() {
    return this.selecteds.filter((item) => item instanceof OrangeArtboard);
  }

  @action
  public select(value: IOrangeItem, keep: boolean = false) {
    if (value &&  this.selecteds.indexOf(value) === -1) {
      if (!keep) {
        this.selecteds.length = 0;
      }
      this.selecteds.push(value);
    }
  }

  @action
  public remove(value: IOrangeItem) {
    if (value) {
      this.selecteds = this.selecteds.filter((selected) => selected !== value);
    }
  }

  @action
  public clear() {
    this.selecteds.length = 0;
  }

  private update() {
    if (this.selecteds.length) {
      const x1 = Math.min(...this.selecteds.map((value) => value.absolutePosition.x));
      const y1 = Math.min(...this.selecteds.map((value) => value.absolutePosition.y));
      const x2 = Math.max(...this.selecteds.map((value) =>
        value.absolutePosition.x + value.size.width,
      ));
      const y2 = Math.max(...this.selecteds.map((value) =>
        value.absolutePosition.y + value.size.height,
      ));
      this._selectionRect.bounds = new Rectangle(
        new Point(x1 - 1, y1 - 1),
        new Point(x2 + 1, y2 + 1),
      );
      this._selectionCorners.forEach((corner, index) => {
        corner.bounds.center = new Point(
          [0, 3].indexOf(index) >= 0 ? x1 : x2,
          [0, 1].indexOf(index) >= 0 ? y1 : y2,
        );
        corner.visible = true;
      });
      this._selectionRect.visible = true;
    } else {
      this._selectionCorners.forEach((corner) => {
        corner.visible = false;
      });
      if (this._selectionRect) {
        this._selectionRect.visible = false;
      }
    }
  }

}
