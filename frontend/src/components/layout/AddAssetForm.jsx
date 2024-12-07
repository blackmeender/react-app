import { useState, useRef } from "react"
import { Select, Space, Typography, Flex, Divider, Form, Button, InputNumber, DatePicker, Result } from 'antd';
import { useCrypto } from "../../context/crypto-context";
import CoinInfo from "./CoinInfo";

const validateMessages = {

    required: '${label} is required',

    types: {
        number: '${label} is not valid number'
    },

    number: {
        range: '${label} must be between ${min} and ${max}'
    }
}

export default function AddAssetForm({ onClose }) {
    const [form] = Form.useForm()
    const { crypto, addAsset } = useCrypto()
    const [coin, setCoin] = useState(null)
    const [submitted, setSubmitted] = useState(false)
    const assetRef = useRef()

    if (submitted) {
        return (
            <Result
                status="success"
                title="New asset added"
                subTitle={`Added ${assetRef.current.amount} of ${coin.name} by price ${assetRef.current.price}`}
                extra={[
                    <Button type="primary" key="console" onClick={onClose}>
                        Close
                    </Button>,

                ]}
            />
        )
    }

    if (!coin) {
        return (
            <Select
                style={{ width: '100%' }}
                placeholder='Select coin'
                onSelect={(v) => setCoin(crypto.find(c => c.id === v))}
                options={crypto.map(coin => ({
                    label: coin.name,
                    value: coin.id,
                    icon: coin.icon

                }))}
                optionRender={(option) => (
                    <Space>
                        <img style={{ width: 20 }} src={option.data.icon} alt={option.data.label} /> {option.data.label}
                    </Space>
                )}
            />
        )

    }

    function onFinish(values) {
        const newAsset = {
            id: coin.id,
            amount: values.amount,
            price: values.price,
            date: values.date?.$d ?? newDate(),
        }
        assetRef.current = newAsset
        addAsset(newAsset)
        setSubmitted(true)

    }

    function handleAmountChange(value) {
        const price = form.getFieldValue('price')
        form.setFieldsValue({
            total: +(value * price).toFixed(2),
        })
    }
    function handlePriceChange(value) {
        const amount = form.getFieldValue('amount')
        form.setFieldsValue({
            total: +(amount * coin.price).toFixed(2),
        })
    }

    return (
        <Form
            form={form}
            name="basic"
            labelCol={{
                span: 4,
            }}
            wrapperCol={{
                span: 10,
            }}
            style={{
                maxWidth: 600,
            }}
            initialValues={{
                price: coin.price.toFixed(2)
            }}
            onFinish={onFinish}
            validateMessages={validateMessages}
        >

            <CoinInfo coin={coin} />

            <Divider />

            <Form.Item
                label="Amount"
                name="amount"
                rules={[
                    {
                        required: true,
                        type: 'number',
                        min: 0,
                    },
                ]}
            >
                <InputNumber placeholder="Enter coin amount" style={{ width: '100%' }} onChange={handleAmountChange} />
            </Form.Item>
            <Form.Item
                label="Price"
                name="price"
            >
                <InputNumber style={{ width: '100%' }} onChange={handlePriceChange} />
            </Form.Item>
            <Form.Item
                label="Total"
                name="total"
            >
                <InputNumber style={{ width: '100%' }} disabled />
            </Form.Item>
            <Form.Item
                label="Date & time"
                name="date"
            >
                <DatePicker style={{ width: '100%' }} showTime />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Add asset
                </Button>
            </Form.Item>
        </Form>

    )

}