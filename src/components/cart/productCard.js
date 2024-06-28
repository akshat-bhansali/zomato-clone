import React from "react";
import { Card, Button, Space } from "antd";

const { Meta } = Card;

const ProductCard = ({ item, onUpdateQuantity, onRemove }) => {
  const name = item.item;
  const image = item?.image?.link;
  const quantity = Number(item?.cnt);
  const price = Number(item?.price);

  return (
    <Card className="m-2 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex flex-col md:flex-row md:gap-4 items-center">
        <Meta
          avatar={
            <img
              alt={name}
              src={image}
              className="w-20 h-20 object-cover rounded"
            />
          }
          title={<span className="font-bold">{name}</span>}
          description={<span className="text-lg text-gray-600">₹{price}</span>}
          className="flex-1"
        />
        <div className="flex flex-row items-center mt-4 md:mt-0">
          <Space>
            <Button
              type="primary"
              danger
              onClick={() => onUpdateQuantity(quantity - 1)}
              className="px-4"
            >
              -
            </Button>
            <span className="text-lg font-medium">{quantity}</span>
            <Button
              type="primary"
              onClick={() => onUpdateQuantity(quantity + 1)}
              className="px-4 bg-blue-600"
            >
              +
            </Button>
            <Button
              type="default"
              onClick={onRemove}
              className="ml-4 text-red-500 border-red-500"
            >
              Remove
            </Button>
          </Space>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
