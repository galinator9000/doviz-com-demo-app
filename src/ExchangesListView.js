import React, { useState, useEffect } from 'react';
import { Table, Layout } from 'antd';
import axios from 'axios';
import ExchangesListElementView from './ExchangesListElementView';

// Consts
const { Header, Content } = Layout;
const ENDPOINT_URL = "http://localhost:8080";

const ExchangesListView = () => {
	const [exchangeListData, setExchangeListData] = useState([]);
	const [exchangeListDataLoading, setExchangeListDataLoading] = useState(false);

	useEffect(
		() => {
			// Fetch data from the API endpoint
			const fetchData = async () => {
				setExchangeListDataLoading(true);
				try {
					const response = await axios.get(`${ENDPOINT_URL}/getAllCurrencyCurrentValues`);
					setExchangeListData(response.data);
					setExchangeListDataLoading(false);
				} catch (error) {
					console.error('Error fetching data:', error);
					setExchangeListDataLoading(false);
				}
			};
			fetchData();
		},
		[]
	);

	const exchangeListColumns = [
		{ title: 'Asset', dataIndex: 'code', key: 'code' },
		{ title: 'Asset Full Name', dataIndex: 'name', key: 'name' },
		{ title: 'Value', dataIndex: 'value', key: 'value' },
		{ title: 'Last Updated At', dataIndex: 'timestamp', key: 'timestamp'},
	];

	return (
		<Layout style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
			<Header style={{ backgroundColor: '#f0f2f5', textAlign: 'center' }}>
				<h1>Döviz.com Demo App</h1>
			</Header>
			<br/><br/>

			<Content>
				<Table dataSource={exchangeListData} columns={exchangeListColumns} pagination={false} loading={exchangeListDataLoading} />
			</Content>
		</Layout>
	);
};

export default ExchangesListView;