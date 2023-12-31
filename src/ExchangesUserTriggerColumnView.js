import React, { useState } from 'react';
import { Space, Button, InputNumber } from 'antd';
import axios from 'axios';

import { ENDPOINT_URL } from './consts';

const ExchangesUserTriggerColumnView = ({record, currencyAlert, userCurrencyAlertDataLoading, toast}) => {
    const initialValue = (!userCurrencyAlertDataLoading && currencyAlert && currencyAlert.alertValue) ? currencyAlert.alertValue : null;
    const [inputValue, setInputValue] = useState(initialValue);

    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const onButtonSubmit = async () => {
        if((!inputValue) || (inputValue <= 0)){
            toast("Hatalı değer!", {autoClose: 5000, hideProgressBar: false});
            return;
        }

        setIsSubmitLoading(true);

        const isSuccessful = await axios.post(
            `${ENDPOINT_URL}/setUserCurrencyAlert`,
            {
                alertType: "exceed",
                currencyCode: record.code,
                alertValue: inputValue,
                isSentToUser: false
            }
        );

        setIsSubmitLoading(false);
        if(isSuccessful){
            toast("Değer güncellendi!", {autoClose: 5000, hideProgressBar: false});
        }else{
            toast("Değer güncelleme başarısız!", {autoClose: 5000, hideProgressBar: false});
        }
    };

    const onRemoveButtonSubmit = async () => {
        setIsSubmitLoading(true);

        const isSuccessful = await axios.post(
            `${ENDPOINT_URL}/removeUserCurrencyAlert`,
            {
                alertType: "exceed",
                currencyCode: record.code
            }
        );

        setIsSubmitLoading(false);
        if(isSuccessful){
            setInputValue(null);
            toast("Uyarı silindi!", {autoClose: 5000, hideProgressBar: false});
        }else{
            toast("Uyarı silme işlemi başarısız!", {autoClose: 5000, hideProgressBar: false});
        }
    };

    return (
        <Space size="middle">
            <InputNumber
                min={0}
                defaultValue={initialValue}
                value={inputValue}
                onChange={setInputValue}
            />
            <Button
                type="primary"
                loading={userCurrencyAlertDataLoading || isSubmitLoading}
                onClick={onButtonSubmit}
            >
                Uyarı Ekle/Güncelle
            </Button>

            <Button
                type="secondary"
                loading={userCurrencyAlertDataLoading || isSubmitLoading}
                onClick={onRemoveButtonSubmit}
            >
                Uyarıyı sil
            </Button>
        </Space>
    );
}

export default ExchangesUserTriggerColumnView;
