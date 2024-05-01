"use client"

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Form, Input, message, Space, Popconfirm, Card } from 'antd'

import helper from '@/utils/helper'

const { TextArea } = Input

export default function UnAllFriends() {
    const [form] = Form.useForm()

    const [isLoading, setIsLoading] = useState(false)
    const [exceptList, setExceptList] = useState('')

    const confirm = async () => {
        setIsLoading(true)

        const ExceptList = exceptList.split('\n').map(x => x.trim()).filter(x => x != "")

        try {
            const res0 = await axios.get(helper.getLeagueAPIUrl(window.LcuInfo.port, "/lol-chat/v1/friends"),
                {
                    headers: {
                        'Authorization': 'Basic ' + helper.getLeagueAPIPassword(window.LcuInfo.password),
                        'Content-Type': 'application/json'
                    }
                })

            const friends = res0.data

            for (const friend of friends) {
                if (ExceptList.includes(friend.gameName))
                    continue

                await axios.delete(helper.getLeagueAPIUrl(window.LcuInfo.port, '/lol-chat/v1/friends/' + friend.puuid),
                    {
                        headers: {
                            'Authorization': 'Basic ' + helper.getLeagueAPIPassword(window.LcuInfo.password),
                            'Content-Type': 'application/json'
                        }
                    }
                )

                await sleep(1000)
            }
        } catch {
            message.error("Đã xảy ra lỗi trong quá trình xử lý yêu cầu")
        }

        setIsLoading(false)
    }

    return (
        <div>
            <Card size='small'>
                <p><strong>Giới thiệu:</strong> Chức năng này sẽ hủy kết bạn với tất cả người trong danh sách bạn bè, phù hợp để dọn dẹp danh sách bạn bè. Đương nhiên là bạn có thể loại trừ những người bạn không muốn hủy kết bạn.</p>
            </Card>

            <Form
                form={form}
                layout="vertical"
                autoComplete="off"
                style={{ marginTop: 10 }}
            >
                <Form.Item
                    label="Danh sách loại trừ"
                >
                    <TextArea rows={4} placeholder="VD: Bonsx" value={exceptList} onChange={(event) => setExceptList(event.target.value)} />
                    <small>Những người chơi trong danh sách này sẽ không bị hủy kết bạn. Mỗi dòng thể hiện cho một người chơi.</small>
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Popconfirm
                            title="Cảnh báo"
                            description="Bạn chắc chắn muốn thực hiện điều này? Các tác vụ đã thực hiện sẽ không thể hoàn tác!"
                            onConfirm={confirm}
                            okText="Tiếp tục"
                            cancelText="Hủy"
                        >
                            <Button name="excute" type="primary" htmlType="button" loading={isLoading}>
                                Thực hiện
                            </Button>
                        </Popconfirm>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    )
}
