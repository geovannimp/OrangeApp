import paper from 'paper';
import { observable, observe, action, computed } from 'mobx';

import { OrangePosition, OrangeSize, OrangeStyle } from './index';
import IOrangeItem from './IOrangeItem';

abstract class IOrangePrimitive extends IOrangeItem {
  @observable public element: paper.Item;
  @observable public angle: number;
  @observable public style: OrangeStyle;

  constructor(name: string, position: OrangePosition, size: OrangeSize) {
    super(name, position, size);
    this.style = { fillColor: 'red' };
    observe(this, 'absolutePosition', (change) => {
      this.updatePosition();
    });
  }

  @action
  private updatePosition() {
    this.element.bounds.topLeft = new paper.Point(
      this.absolutePosition.x,
      this.absolutePosition.y,
    );
  }

  @action
  public setPosition(x: number, y: number) {
    super.setPosition(x, y);
    if (this.element) {
      this.updatePosition();
    }
  }
  @action
  public setSize(width: number, height: number) {
    super.setSize(width, height);
    if (this.element) {
      this.element.bounds.width = this.size.width;
      this.element.bounds.height = this.size.height;
    }
  }
  @action
  public setAngle(angle: number) {
    this.angle = angle;
    if (this.element) {
      this.element.rotation = this.angle;
    }
  }

  @action
  public setStyle(propertie: string, value: any) {
    const style = { [propertie]: value };
    this.style = { ...this.style, ...style };
    if (this.element) {
      this.applyStyle(this.element, style);
    }
  }

  @action
  public applyStyle(element: paper.Item, style?: OrangeStyle) {
    const styleToAplly = style || this.style;
    if (element) {
      for (const property in styleToAplly) {
        switch (property) {
          case 'fillColor':
            element.style.fillColor = styleToAplly.fillColor || '';
            break;
        }
      }
    }
  }

  @action
  public render(canvas: paper.PaperScope) {
    this.applyStyle(this.element);
  }
}

export default IOrangePrimitive;
