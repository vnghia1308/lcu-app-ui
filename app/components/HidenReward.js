"use client"

import React, { useEffect, useState } from 'react'
import { Button, Avatar, List, message } from 'antd'

import axios from 'axios'
import helper from '@/utils/helper'

export default function HidenReward() {
    const [isLoading, setIsLoading] = useState(false)
    const [rewardList, setRewardList] = useState([])

    useEffect(() => {
        LoadRewardList()
    }, [])

    const LoadRewardList = async () => {
        setIsLoading(true)

        try {
            const res0 = await axios.get(helper.getLeagueAPIUrl(window.LcuInfo.port, "/lol-rewards/v1/grants"),
                {
                    headers: {
                        'Authorization': 'Basic ' + helper.getLeagueAPIPassword(window.LcuInfo.password),
                        'Content-Type': 'application/json'
                    }
                })

            const rewards = res0.data
            setRewardList(rewards.filter(r => r.rewardGroup.rewards.length > 0))
        } catch (e) {
            message.error("Đã xảy ra lỗi trong quá trình tải danh sách phần thưởng của bạn")
        }

        setIsLoading(false)
    }

    const getReward = async (rewardId, requestBody) => {
        try {
            await axios.post(helper.getLeagueAPIUrl(window.LcuInfo.port, `/lol-rewards/v1/grants/${rewardId}/select`),
                requestBody,
                {
                    headers: {
                        'Authorization': 'Basic ' + helper.getLeagueAPIPassword(window.LcuInfo.password),
                        'Content-Type': 'application/json'
                    }
                })

            message.success("Giao dịch kết thúc trong thành công. Vật phẩn sẽ được gửi vào kho đồ của bạn!")

            setTimeout(() => {
                LoadRewardList()
            })
        } catch {
            message.error("Đã xảy ra lỗi trong quá trình tải danh sách phần thưởng của bạn")
        }
    }

    return (
        <div>
            <div style={{ height: "calc(100vh - 250px)", overflow: "auto" }}>
                <List
                    itemLayout="horizontal"
                    dataSource={rewardList}
                    renderItem={(item, index) => {
                        const reward = item.rewardGroup.rewards[0]

                        return <List.Item>
                            <List.Item.Meta
                                title={reward.localizations.title}
                                avatar={<Avatar src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/${reward.media.iconUrl.replace("/lol-game-data/assets/", "").toLowerCase()}`} />}
                                description={reward.description == null ? "Không có giới thiệu" : reward.description}
                            />
                            <div><Button type="primary" htmlType="button" size="middle" disabled={item.info.status == "FULFILLED"} onClick={() => getReward(item.info.id, { rewardGroupId: item.info.rewardGroupId, selections: [reward.id] })}>
                                {item.info.status == "FULFILLED" ? "Đã nhận" : "Nhận"}
                            </Button></div>
                        </List.Item>
                    }}
                />
            </div>
        </div>
    )
}
