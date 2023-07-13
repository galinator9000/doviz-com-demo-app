import React, { useState, useEffect } from 'react';
import { Table, Layout, Button, Statistic } from 'antd';
import axios from 'axios';
import useWebSocket from 'react-use-websocket';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ExchangesUserTriggerColumnView from './ExchangesUserTriggerColumnView';

// Consts
import { 
    ENDPOINT_URL,
    ENDPOINT_WS_URL
} from './consts';
const { Header, Content } = Layout;

// Component that contains the main exchange list's structure
const ExchangesListView = () => {
	// Set the states that holds the table data
	const [exchangeListData, setExchangeListData] = useState([]);
	const [exchangeListDataLoading, setExchangeListDataLoading] = useState(false);

	const [userCurrencyAlertData, setUserCurrencyAlertData] = useState([]);
	const [userCurrencyAlertDataLoading, setUserCurrencyAlertDataLoading] = useState(false);

	// Use the imported module in order to connect to the server-side websocket service
	const {sendMessage: ws_sendMessage} = useWebSocket(
		ENDPOINT_WS_URL,
		{
			onOpen: () => {
				console.log("[*] WebSocket connection established with the server");
			},
			onMessage: (event) => {
				// Process the triggered alerts
				let triggeredAlerts = JSON.parse(event.data);

				triggeredAlerts.forEach(alert => (
					alert.messages.forEach(
						msg => toast(msg)
					)
				));
			},
			shouldReconnect: (closeEvent) => true,
		}
	);

	// Set the function that periodically asks the server whether any user alert is triggered
	useEffect(
		() => {
			const userTriggerAlertInterval = setInterval(
				() => {
					ws_sendMessage("CHECK_USER_TRIGGERS");
				},
				5000
			);
			const refreshDataInterval = setInterval(
				() => {
					refreshExchangeListData();
					refreshUserCurrencyAlertData();
				},
				30000
			);
			return () => {
				clearInterval(userTriggerAlertInterval);
				clearInterval(refreshDataInterval);
			}
		},
		[]
	);

	// Function that loads the exchange table data
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
				toast("Sunucuyla bağlantı kurulamadı!", {autoClose: 5000});
				setExchangeListDataLoading(false);
			}
		};
		fetchData();
	};

	// Function that loads the user exchange alert data
	const refreshUserCurrencyAlertData = () => {
		// Fetch data from the API endpoint
		const fetchData = async () => {
			setUserCurrencyAlertDataLoading(true);
			try {
				const response = await axios.get(`${ENDPOINT_URL}/getUserCurrencyAlerts`);
				setUserCurrencyAlertData(response.data);
				setUserCurrencyAlertDataLoading(false);
			} catch (error) {
				console.error('Error fetching data:', error);
				toast("Sunucuyla bağlantı kurulamadı!", {autoClose: 5000});
				setUserCurrencyAlertDataLoading(false);
			}
		};
		fetchData();
	};

	// Load initial data
	useEffect(
		() => {
			refreshExchangeListData();
			refreshUserCurrencyAlertData();
		},
		[]
	);

	// Table column customization
	const exchangeListColumns = [
		{title: 'Döviz Kodu', dataIndex: 'code', key: 'code'},
		{title: 'Döviz Adı', dataIndex: 'name', key: 'name'},
		{
			title: 'Güncel Değer', dataIndex: 'value', key: 'value',
			render: (value) => (
				value ?
				<Statistic
					value={value}
					precision={2}
					suffix="₺"
				/> : "Güncel kayıt yok"
			)
		},
		{
			title: 'Son Güncelleme', dataIndex: 'timestamp', key: 'timestamp',
			render: (value) => (
				value ? ((new Date(value)).toLocaleString("tr-TR")) : "Güncel kayıt yok"
			)
		},
		{
			title: 'Uyarı için limit değer',
			key: 'action',
			render: (_, record) => {
				let currencyAlert = userCurrencyAlertData.filter(alert => alert.currencyCode === record.code)[0];
				return <ExchangesUserTriggerColumnView
					record={record}
					currencyAlert={currencyAlert}
					userCurrencyAlertDataLoading={userCurrencyAlertDataLoading}
					toast={toast}
				/>
			},
		},
	];

	// ListView's final render structure
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

			<ToastContainer
				position="top-left"
				autoClose={120000}
				hideProgressBar={true}
				newestOnTop={true}
				draggable={false}
				theme="dark"
			></ToastContainer>
		</Layout>
	);
};

export default ExchangesListView;