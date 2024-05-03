"use client"

import React, { useEffect, useState } from 'react'
import { Space, Card, Checkbox } from 'antd'


export default function MatchTools() {
    const [AutoAcceptMatchChecked, setAutoAcceptMatchChecked] = useState(false)

    const onAutoAcceptMatchChange = (e) => {
        localStorage.setItem("isAutoAcceptMatch", e.target.checked)

        setAutoAcceptMatchChecked(e.target.checked)
    }

    useEffect(() => {
        const isAutoAcceptMatch = localStorage.getItem("isAutoAcceptMatch")
        setAutoAcceptMatchChecked(isAutoAcceptMatch == "true")
    }, [])

    return (
        <div>
            <Card size='small'>
                <p><strong>Giới thiệu:</strong> Các chức năng hỗ trợ trận đấu của bạn.</p>
            </Card>

            <Card
                title="Chức năng"
                style={{ marginTop: 10 }}
            >
                <Space size="small">
                    <Checkbox onChange={onAutoAcceptMatchChange} checked={AutoAcceptMatchChecked}>Tự động chấp nhận trận đấu</Checkbox>
                </Space>
            </Card>
        </div>
    )
}
