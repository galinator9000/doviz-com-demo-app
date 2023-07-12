import React, { useState, useEffect } from 'react';
import { Table, Layout, Space, Button, Statistic } from 'antd';
import axios from 'axios';
import ExchangesListElementView from './ExchangesListElementView';

// Consts
const { Header, Content } = Layout;
const ENDPOINT_URL = "http://localhost:8080";

const ExchangesListView = () => {
	const [exchangeListData, setExchangeListData] = useState([]);
	const [exchangeListDataLoading, setExchangeListDataLoading] = useState(false);

	const refreshExchangeListData = () => {
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
	}

	useEffect(
		refreshExchangeListData,
		[]
	);

	const exchangeListColumns = [
		{title: 'Döviz Kodu', dataIndex: 'code', key: 'code'},
		{title: 'Döviz Adı', dataIndex: 'name', key: 'name'},
		{
			title: 'Değer', dataIndex: 'value', key: 'value',
			render: (value) => (
				<Statistic
					value={value}
					precision={2}
					suffix="₺"
				/>
			)
		},
		{
			title: 'Son Güncelleme', dataIndex: 'timestamp', key: 'timestamp',
			render: (value) => (
				(new Date(value)).toLocaleString("tr-TR")
			)
		},
		{
			title: 'İşlemler',
			key: 'action',
			render: (_, record) => (
				<Space size="middle">
					<Button type="primary">Uyarı Ekle</Button>
				</Space>
			),
		},
	];

	return (
		<Layout style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
			<Header style={{ backgroundColor: '#f0f2f5', textAlign: 'center' }}>
				<h1>Döviz.com - Demo Uygulaması</h1>
			</Header>
			<br/>
			<Button type="dashed" onClick={refreshExchangeListData}>Yenile</Button>
			<br/>

			<Content>
				<Table dataSource={exchangeListData} columns={exchangeListColumns} pagination={false} loading={exchangeListDataLoading} />
			</Content>
		</Layout>
	);
};

export default ExchangesListView;