import React, { useState, useEffect } from 'react';
import { List, Table, Layout } from 'antd';

const ExchangesListElementView = (props) => {
	return (
        <List.Item>
            {props.item.name}
        </List.Item>
	);
};

export default ExchangesListElementView;