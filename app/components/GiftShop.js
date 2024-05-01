"use client"

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Flex, Button, Form, Input, message, Space, Popconfirm, Card, Select, Divider, Typography, Avatar } from 'antd'

import helper from '@/utils/helper'

const { TextArea } = Input
const { Text } = Typography

export default function GiftShop() {
    const [form] = Form.useForm()

    const [isLoading, setIsLoading] = useState(false)
    const [friendList, setFriendList] = useState([])
    const [giftList, setGiftList] = useState([])

    const [totalRP, setTotalRP] = useState(0)

    const [curItem, setCurItem] = useState(null)
    const [curSummonerId, setCurSummonerId] = useState(null)

    useEffect(() => {
        LoadGiftItems()
        LoadFriendList()
    }, [])

    const LoadGiftItems = async () => {
        try {
            const res0 = await axios.get("https://vnghia1308.github.io/lcu/giftItems.json")

            const giftItems = [...res0.data]
            setGiftList(giftItems)
        } catch { }
    }

    const LoadFriendList = async () => {
        setIsLoading(true)

        try {
            const res0 = await axios.get(helper.getLeagueAPIUrl(window.LcuInfo.port, "/lol-chat/v1/friends"),
                {
                    headers: {
                        'Authorization': 'Basic ' + helper.getLeagueAPIPassword(window.LcuInfo.password),
                        'Content-Type': 'application/json'
                    }
                })

            const friends = res0.data
            setFriendList(friends)

            console.log(friends)
        } catch {
            message.error("Đã xảy ra lỗi trong quá trình tải danh sách bạn bè của bạn")
        }

        setIsLoading(false)
    }

    const giftLabelRender = (props) => {
        const { label, value } = props
        const item = giftList.find(f => f.itemId == value)

        if (!item) {
            return <>{label}</>
        }

        return <Flex align="center">
            <span style={{ marginLeft: 5 }}>{label} - {item.rp.toLocaleString()}</span>
            <img style={{ marginLeft: 5 }} width={14} src={`https://static.wikia.nocookie.net/leagueoflegends/images/0/00/RP_icon.png`} />
        </Flex>
    }

    const friendListRender = (props) => {
        const { label, value } = props
        const summoner = friendList.find(f => f.summonerId == value)

        return <Flex align="center">
            <Avatar size={20} src={`https://ddragon-webp.lolmath.net/latest/img/profileicon/${summoner.icon}.webp`} />
            <span style={{ marginLeft: 5 }}>{label}</span>
        </Flex>
    }

    const onFriendChange = summonerId => {
        setCurSummonerId(summonerId)
    }

    const onGiftChange = itemId => {
        const item = giftList.find(f => f.itemId == itemId)
        setTotalRP(item.rp)
        setCurItem(item)
    }

    const getCurrentSummoner = async () => {
        if ("LcuInfo" in window) {
            try {
                const res0 = await axios.get(helper.getLeagueAPIUrl(window.LcuInfo.port, "/lol-summoner/v1/current-summoner "),
                    {
                        headers: {
                            'Authorization': 'Basic ' + helper.getLeagueAPIPassword(window.LcuInfo.password),
                            'Content-Type': 'application/json'
                        }
                    }
                )

                return res0.data
            } catch { }
        }

        return null
    }

    const GetRiotStoreAccesstoken = async () => {
        if ("LcuInfo" in window) {
            try {
                const res0 = await axios.get(helper.getLeagueAPIUrl(window.LcuInfo.port, "/lol-rso-auth/v1/authorization/access-token"),
                    {
                        headers: {
                            'Authorization': 'Basic ' + helper.getLeagueAPIPassword(window.LcuInfo.password),
                            'Content-Type': 'application/json'
                        }
                    }
                )

                return res0.data.token
            } catch { }
        }

        return null
    }

    const onSendGift = async () => {
        setIsLoading(true)
        const summoner = await getCurrentSummoner()
        const storeToken = await GetRiotStoreAccesstoken()

        if (summoner == null || storeToken == null) {
            setIsLoading(false)
            return message.error("Xác thực với máy chủ LMHT thất bại")
        }

        if (curItem == null || curSummonerId == null) {
            setIsLoading(false)
            return message.error("Bạn phải chọn ít nhất một người bạn hoặc một món quà")
        }

        try {
            await axios.post("https://vn2-red.lol.sgp.pvp.net/storefront/v3/gift?language=vi_VN",
                {
                    "customMessage": "",
                    "receiverSummonerId": curSummonerId,
                    "giftItemId": 1010,
                    "accountId": summoner.accountId,
                    "items": [
                        {
                            "inventoryType": curItem.inventoryType,
                            "itemId": curItem.itemId,
                            "ipCost": null,
                            "rpCost": curItem.rp,
                            "quantity": 1
                        }
                    ]
                },
                {
                    headers: {
                        'Authorization': 'Bearer ' + storeToken,
                        'Content-Type': 'application/json'
                    }
                }
            )

            message.success("Tặng quà thành công")
        } catch {
            message.error("Đã có lỗi xảy ra trong quá trình tặng quà")
        }

        setIsLoading(false)
    }

    return (
        <div>
            <Card size='small'>
                <p><strong>Giới thiệu:</strong> Chức năng này cho phép tặng bất kì món quà nào trong cửa hàng cho bạn bè kể cả khi chúng không có sẵn trong chức năng tặng.</p>
            </Card>

            <Form
                form={form}
                layout="vertical"
                autoComplete="off"
                style={{ marginTop: 10 }}
            >
                <Form.Item
                    label="Chọn bạn bè"
                >
                    <Select
                        showSearch
                        fieldNames={{ label: "gameName", value: "summonerId" }}
                        placeholder="Chọn một người bạn"
                        optionFilterProp="gameName"
                        options={friendList}
                        labelRender={friendListRender}
                        onChange={onFriendChange}
                    />
                </Form.Item>

                <Form.Item
                    label="Vật phẩm gửi tặng"
                >
                    <Select
                        showSearch
                        optionFilterProp="itemName"
                        placeholder="Chọn một món quà"
                        options={giftList}
                        labelRender={giftLabelRender}
                        optionRender={giftLabelRender}
                        onChange={onGiftChange}
                        fieldNames={{ label: "itemName", value: "itemId" }}
                    />
                </Form.Item>

                <Divider />



                <Flex align="center">
                    <Text><strong>Tổng thanh toán: </strong></Text>
                    <img style={{ marginLeft: 5 }} width={15} src={`https://static.wikia.nocookie.net/leagueoflegends/images/0/00/RP_icon.png`} />
                    <span style={{ marginLeft: 5 }}>{totalRP.toLocaleString()} RP</span>

                </Flex>


                <Form.Item>
                    <Space>
                        <Popconfirm
                            title="Cảnh báo"
                            description="Bạn chắc chắn muốn thực hiện điều này? Quà tặng không thể thu hồi!"
                            okText="Tiếp tục"
                            cancelText="Hủy"
                            onConfirm={onSendGift}
                        >
                            <Button style={{ marginTop: 20 }} name="excute" type="primary" htmlType="button" loading={isLoading}>
                                Thực hiện
                            </Button>
                        </Popconfirm>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    )
}
