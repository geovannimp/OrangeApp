import Konva from 'konva'
import React from 'react'
import { Group } from 'react-konva'
import { IOrangeItem, OrangeLayer } from '../../../../classes'
import RenderUtils from '../RenderUtils'
import Item from './KCItem'

interface LayerProps {
  item: OrangeLayer
  select: (item: IOrangeItem) => (e: Konva.KonvaEventObject<MouseEvent>) => void
}

class KCLayer<P extends LayerProps> extends Item<LayerProps> {
  public renderSubitems(items: IOrangeItem[]): Array<JSX.Element | undefined> {
    return items && items.map((item) => RenderUtils.renderItem(item, this.props.select))
  }

  public render(): JSX.Element {
    if (this.props.item) {
      return(
        <Group
          key={this.props.item.id}
          onClick={this.props.select(this.props.item)}
          {...this.itemToCSS(this.props.item)}
        >
          {this.renderSubitems(this.props.item.children)}
        </Group>
      )
    }
    return (<Group/>)
  }
}

export default KCLayer