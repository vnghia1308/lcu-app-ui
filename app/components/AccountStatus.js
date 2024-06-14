"use client"

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Form, Input, message, Space, Popconfirm, Card, Select } from 'antd'
import helper from '@/utils/helper'

const { TextArea } = Input

export default function AccountStatus() {
    const [form] = Form.useForm()

    const [rank, setRank] = useState('none')

    const [isLoading, setIsLoading] = useState(false)
    const [isChangeOfflineLoading, setChangeOfflineLoading] = useState(false)
    const [statusMessage, setStatusMessage] = useState('')


    async function SaveAccountInfo() {
        setIsLoading(true)

        if ("LcuInfo" in window) {
            try {
                var PutQuery = {}

                if (rank != "none") {
                    PutQuery["lol"] = {
                        "rankedLeagueTier": rank,
                        "rankedLeagueDivision": "I"
                    }
                }

                if (statusMessage != "") {
                    PutQuery["statusMessage"] = statusMessage
                }

                await axios.put(helper.getLeagueAPIUrl(window.LcuInfo.port, "/lol-chat/v1/me"),
                    PutQuery,
                    {
                        headers: {
                            'Authorization': 'Basic ' + helper.getLeagueAPIPassword(window.LcuInfo.password),
                            'Content-Type': 'application/json'
                        }
                    })

                message.success("Trạng thái đã được lưu")
            } catch (error) {
                message.error("Không thể kết nối tới trò chơi. Vui lòng khởi động (lại) Liên Minh Huyền thoại")
            }
        }

        setIsLoading(false)
    }

    const setAccountOffline = async () => {
        if ("LcuInfo" in window) {
            setChangeOfflineLoading(true)

            try {
                await axios.put(helper.getLeagueAPIUrl(window.LcuInfo.port, "/lol-chat/v1/me"),
                    {
                        availability: "offline",
                        lol: {
                            gameStatus: "outOfGame"
                        }
                    },
                    {
                        headers: {
                            'Authorization': 'Basic ' + helper.getLeagueAPIPassword(window.LcuInfo.password),
                            'Content-Type': 'application/json'
                        }
                    }
                )
                
                message.success("Yêu cầu đã được thực hiện")
            } catch {
                message.error("Không thể kết nối tới trò chơi. Vui lòng khởi động (lại) Liên Minh Huyền thoại")
            }

            setChangeOfflineLoading(false)
        }
    }

    return (
        <div>
            <Card size='small'>
                <p><strong>Giới thiệu:</strong> Chức năng dùng để chỉnh trạng thái tài khoản bao gồm nội dung ở phần trực tuyến và khung xếp hạng... cho mục đích sống ảo.</p>
            </Card>

            <Form
                form={form}
                layout="vertical"
                autoComplete="off"
                style={{ marginTop: 10 }}
            >
                <Form.Item
                    label="Xếp hạng"
                >
                    <Select
                        onChange={(value) => setRank(value)}
                        defaultValue="none"
                        options={[
                            {
                                value: 'none',
                                label: 'Không thay đổi',
                            },
                            {
                                value: 'CHALLENGER',
                                label: 'Thách Đấu',
                            },
                            {
                                value: 'GRANDMASTER',
                                label: 'Đại Cao Thủ',
                            },
                            {
                                value: 'MASTER',
                                label: 'Cao Thủ',
                            },
                            {
                                value: 'DIAMOND',
                                label: 'Kim Cương',
                            },
                            {
                                value: 'PLATINUM',
                                label: 'Bạch Kim',
                            },
                            {
                                value: 'GOLD',
                                label: 'Vàng',
                            },
                            {
                                value: 'SILVER',
                                label: 'Bạc',
                            },
                            {
                                value: 'IRON',
                                label: 'Sắt',
                            }
                        ]}
                    />
                </Form.Item>
                <Form.Item
                    label="Nội dung ở phần trực tuyến"
                >
                    <TextArea rows={4} placeholder="VD: Hello I am Vy Nghia" value={statusMessage} onChange={(event) => setStatusMessage(event.target.value)} />
                    <small>Độ dài có thể gần như vô hạn, nội dung phải tuân thủ theo quy tắc ứng xử của <strong>Riot Games</strong>, những nội dung mang hướng không lành mạnh có thể sẽ không được hiển thị.</small>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="button" loading={isLoading} onClick={SaveAccountInfo}>
                        Thực hiện
                    </Button>
                </Form.Item>
            </Form>

            <Card
                title="Chức năng khác"
                style={{ marginTop: 10 }}
            >
                <Space size="small">
                    <Button type="primary" htmlType="button" loading={isChangeOfflineLoading} onClick={setAccountOffline}>
                        Tắt mở/trạng thái ngoại tuyến
                    </Button>
                </Space>
            </Card>
        </div>
    )
}