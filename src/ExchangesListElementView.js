import React, {  } from 'react';
import { List } from 'antd';

const ExchangesListElementView = (props) => {
	return (
        <List.Item>
            {props.item.name}
        </List.Item>
	);
};

export default ExchangesListElementView;