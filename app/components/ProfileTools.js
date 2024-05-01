"use client"

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Input, message, Space, Popconfirm, Card } from 'antd'

import helper from '@/utils/helper'

export default function ProfileTools() {
    const [isLoading, setIsLoading] = useState([false, false, false])

    const SetLoadingAt = (index, value) => {
        setIsLoading((prevLoadings) => {
            const newLoadings = [...prevLoadings]
            newLoadings[index] = value
            return newLoadings
        })
    }

    const RemoveBannerAccent = async () => {
        SetLoadingAt(1, true)

        try {
            await axios.post(helper.getLeagueAPIUrl(window.LcuInfo.port, "/lol-challenges/v1/update-player-preferences"),
                {
                    bannerAccent: "2"
                },
                {
                    headers: {
                        'Authorization': 'Basic ' + helper.getLeagueAPIPassword(window.LcuInfo.password),
                        'Content-Type': 'application/json'
                    }
                }
            )

            message.success("Yêu cầu được thực hiện")
        } catch {
            message.error("Đã có lỗi xảy ra")
        }

        SetLoadingAt(1, false)
    }

    const RemoveChallengeTokens = async () => {
        SetLoadingAt(0, true)

        try {
            await axios.post(helper.getLeagueAPIUrl(window.LcuInfo.port, "/lol-challenges/v1/update-player-preferences"),
                {
                    challengeIds: []
                },
                {
                    headers: {
                        'Authorization': 'Basic ' + helper.getLeagueAPIPassword(window.LcuInfo.password),
                        'Content-Type': 'application/json'
                    }
                }
            )

            message.success("Yêu cầu được thực hiện")
        } catch {
            message.error("Đã có lỗi xảy ra")
        }

        SetLoadingAt(0, false)
    }

    const RemoveCrestLevel = async () => {
        SetLoadingAt(2, true)

        try {
            await axios.post(helper.getLeagueAPIUrl(window.LcuInfo.port, "/lol-regalia/v2/current-summoner/regalia"),
                {
                    preferredCrestType: "prestige",
                    preferredBannerType: "lastSeasonHighestRank",
                    selectedPrestigeCrest: 33
                },
                {
                    headers: {
                        'Authorization': 'Basic ' + helper.getLeagueAPIPassword(window.LcuInfo.password),
                        'Content-Type': 'application/json'
                    }
                }
            )

            message.success("Yêu cầu được thực hiện")
        } catch {
            message.error("Đã có lỗi xảy ra")
        }

        SetLoadingAt(2, false)
    }

    return (
        <div>
            <Card size='small'>
                <p><strong>Giới thiệu:</strong> Nơi bao gồm các chức năng bạn có thể tùy chỉnh ở phần hồ sơ của bạn.</p>
            </Card>

            <Card
                title="Chức năng"
                style={{ marginTop: 10 }}
            >
                <Space size="small">
                    <Button type="primary" htmlType="button" loading={isLoading[0]} onClick={RemoveChallengeTokens}>
                        Xóa kỷ vật thử thách
                    </Button>

                    <Popconfirm
                        title="Lưu ý"
                        description="Chức năng này chỉ dành cho người chơi không có khung xếp hạng mùa cũ"
                        onConfirm={RemoveBannerAccent}
                        okText="Tiếp tục"
                        cancelText="Hủy"
                    >
                        <Button type="primary" htmlType="button" loading={isLoading[1]}>
                            Xóa cờ nền hồ sơ
                        </Button>
                    </Popconfirm>

                    <Popconfirm
                        title="Lưu ý"
                        description="Chức năng này chỉ dành cho người chơi cấp độ 500 trở lên"
                        onConfirm={RemoveCrestLevel}
                        okText="Tiếp tục"
                        cancelText="Hủy"
                    >
                        <Button type="primary" htmlType="button" loading={isLoading[2]}>
                            Xóa khung cấp độ
                        </Button>
                    </Popconfirm>
                </Space>
            </Card>
        </div>
    )
}
