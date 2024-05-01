"use client"

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Form, Input, message, Space, List, Avatar } from 'antd'

import helper from '@/utils/helper'

export default function Home() {
    const [form] = Form.useForm()
    const [isLoading, setIsLoading] = useState(false)

    const [champion, setChampion] = useState("")
    const [skinList, setSkinList] = useState([])
    const [championId, setChampionId] = useState(0)
    const [championList, setChampionList] = useState([])


    const onFinish = () => {
        setIsLoading(true)
        let _champion = championList.find(x => x.name.toLowerCase().replace(/\'/g, "") == champion.toLowerCase().replace(/\'/g, ""))

        if (!_champion) {
            message.error('Tướng không tồn tại')

            return setIsLoading(false)
        }

        setChampionId(_champion.id)

        fetch(`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/vi_vn/v1/champions/${_champion.id}.json`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data.skins)) {
                    setSkinList(data.skins)
                }

                setIsLoading(false)
            })

        message.success('Danh sách trang phục đã được tải')
    }

    const validateMessages = {
        required: '${label} không được trống'
    }

    useEffect(() => {
        const loadChampionList = async () => {
            try {
                const response = await fetch('https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json')

                let _championList = await response.json()

                _championList.splice(0, 1)
                setChampionList(_championList.map(x => {
                    return {
                        id: x.id,
                        name: x.name
                    }
                }))
            } catch {
                message.error("Đã xảy ra lỗi trong quá trình lấy danh sách tướng")
            }
        }

        loadChampionList()
    }, [])

    const handleSkinTier = (name, tier) => {
        const tierList = {
            kNoRarity: null,
            kEpic: <img width={11} src={`https://static.wikia.nocookie.net/leagueoflegends/images/4/40/Epic_Skin.png`} />,
            kLegendary: <img width={11} src={`https://static.wikia.nocookie.net/leagueoflegends/images/f/f1/Legendary_Skin.png`} />,
            kMythic: <img width={11} src={`https://static.wikia.nocookie.net/leagueoflegends/images/4/4d/Hextech_Skin.png`} />,
            kUltimate: <img width={11} src={`https://static.wikia.nocookie.net/leagueoflegends/images/2/25/Ultimate_Skin.png`} />
        }

        return (
            <span>{tierList[tier]} {name}</span>
        )
    }

    const setSkin = async skinId => {
        console.log(skinId)
        if ("LcuInfo" in window) {
            try {
                await axios.post(helper.getLeagueAPIUrl(window.LcuInfo.port, "/lol-summoner/v1/current-summoner/summoner-profile"),
                    {
                        "key": "backgroundSkinId",
                        "value": parseInt(skinId)
                    },
                    {
                        headers: {
                            'Authorization': 'Basic ' + helper.getLeagueAPIPassword(window.LcuInfo.password),
                            'Content-Type': 'application/json'
                        }
                    })

                message.success("Yêu cầu đã được thực hiện")
            } catch {
                message.error("Đã có lỗi xảy ra")
            }
        }
    }

    return (
        <div>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
                validateMessages={validateMessages}
            >
                <Form.Item
                    name="champion_name"
                    label="Tên tướng"
                    rules={[{ required: true }, { type: 'text', warningOnly: true }]}
                >
                    <Input placeholder="VD: Miss Fortune" value={champion} onChange={(event) => setChampion(event.target.value)} />
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit" loading={isLoading}>
                            Tìm kiếm
                        </Button>
                    </Space>
                </Form.Item>
            </Form>

            <div style={{ height: "calc(100vh - 350px)", overflow: "auto" }}>
                <List
                    itemLayout="horizontal"
                    dataSource={skinList}
                    renderItem={(item, index) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-tiles/${championId}/${item.id}.jpg`} />}
                                title={handleSkinTier(item.name, item.rarity)}
                                description={item.description == null ? "Không có giới thiệu" : item.description}
                            />
                            <div><Button type="primary" htmlType="button" size="middle" onClick={() => setSkin(item.id)}>
                                Chọn
                            </Button></div>
                        </List.Item>
                    )}
                />
            </div>
        </div>
    )
}
