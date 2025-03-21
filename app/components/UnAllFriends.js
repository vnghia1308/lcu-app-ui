"use client"

import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Form, Input, message, Space, Popconfirm, Card } from 'antd'

import helper from '@/utils/helper'

const { TextArea } = Input

export default function UnAllFriends() {
    const [form] = Form.useForm()

    const [isLoading, setIsLoading] = useState(false)
    const [exceptList, setExceptList] = useState('')
    const [stateText, setStateText] = useState('Thực hiện')
    const isLoadingRef = useRef(false)

    const confirm = async () => {
        setIsLoading(true)
        isLoadingRef.current = true

        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
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

            // for i
            for (let i = 0; i < friends.length; i++) {
                const friend = friends[i]
                if (isLoadingRef.current == false) {
                    break
                }

                if (ExceptList.includes(friend.gameName))
                    continue

                try {
                    await axios.delete(helper.getLeagueAPIUrl(window.LcuInfo.port, '/lol-chat/v1/friends/' + friend.puuid),
                        {
                            headers: {
                                'Authorization': 'Basic ' + helper.getLeagueAPIPassword(window.LcuInfo.password),
                                'Content-Type': 'application/json'
                            }
                        }
                    )
                } catch (error) {
                    console.log(error)
                }

                setStateText('Đang thực hiện... ' + (i + 1) + '/' + friends.length)

                await sleep(1000)
            }
        } catch {
            message.error("Đã xảy ra lỗi trong quá trình xử lý yêu cầu")
        }

        setIsLoading(false)
        setStateText('Thực hiện')
        isLoadingRef.current = false
    }

    const stop = () => {
        setIsLoading(false)
        isLoadingRef.current = false
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
                                {stateText}
                            </Button>
                        </Popconfirm>

                        {isLoading && (
                            <Button name="stop" type="primary" danger htmlType="button" onClick={stop}>
                                Dừng lại
                            </Button>
                        )}
                    </Space>
                </Form.Item>
            </Form>
        </div>
    )
}
