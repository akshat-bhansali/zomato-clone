import React, { useState } from 'react';
import { Card, Button, InputNumber, Space } from 'antd';


const { Meta } = Card;

const ProductCard = ({ item, onUpdateQuantity, onRemove }) => {
    const name = item.item;
    const image = item?.image?.link;
    const quantity = Number(item?.cnt);
    const price = Number(item?.price);
    return (
        <Card  >
        <div className='flex gap-40'>
          <Meta
            avatar={<img alt={name} src={image} style={{ width: '80px', height: '80px', objectFit: 'cover' }} />}
            title={name}
            description={`₹${price}`}
          />
        <div className='flex flex-row'>
          <Space>
            <Button type="primary" danger onClick={()=>onUpdateQuantity(quantity-1)}>-</Button>
            <span>{quantity}</span>
            <Button type="primary" danger onClick={()=>onUpdateQuantity(quantity+1)}>+</Button>
          </Space>
        </div>
        </div>
        </Card>
      );
  };

export default ProductCard;
  