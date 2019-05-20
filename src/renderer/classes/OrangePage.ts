import { IOrangeItem, OrangeSize } from './index'
import OrangePosition from './OrangePosition'

import { observable } from 'mobx'
import { OrangeItemType } from './IOrangeItem'
import OrangeLayer from './OrangeLayer'

class OrangePage extends OrangeLayer {
  @observable public type = OrangeItemType.OrangePage

  private _items: IOrangeItem[] = []

  constructor(name: string) {
    super(name, new OrangePosition(0, 0), new OrangeSize(0, 0))
  }

  public add(item: IOrangeItem, parent?: OrangeLayer) {
    super.add(item)
    if (parent) {
      item.changeParent(parent)
    }
    this._items.push(item)
  }

  get items() {
    return this._items
  }
}

export default OrangePage
