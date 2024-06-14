"use client"

import React, { useEffect, useState } from 'react'
import { Col, Row } from 'antd'

export default function About() {
    const [shell, setShell] = useState(null)
    const [ipcRenderer, setIpcRenderer] = useState(null)

    useEffect(() => {
        const shell = window.require('electron').shell
        setShell(shell)

        const { ipcRenderer } = window.require('electron')
        setIpcRenderer(ipcRenderer)
    }, [])

    const OpenLink = url => {
        return shell && shell.openExternal(url)
    }

    const openDevTools = _ => {
        return ipcRenderer && ipcRenderer.send('request-mainprocess-action', {
            type: "open_devtools"
        })
    }

    return (
        <div>
            <Row>
                <Col span={24} style={{ marginBottom: 15 }}>
                    Phần mềm được viết & phát triển bởi <a onClick={() => OpenLink(`https:\/\/www.facebook.com\/nghiadev`)}><strong>Vy Nghĩa</strong></a> dựa trên <strong>ElectronJS</strong> (kết hợp từ <strong>NodeJS</strong> và <strong>VanillaJS</strong>). Nguồn cảm hứng và tài liệu tham khảo đến từ dự án <a onClick={() => OpenLink(`https:\/\/github.com\/Pupix\/rift-explorer`)}><strong>Rift Explorer</strong></a> của <strong>Pupix</strong>.
                </Col>

                <Col span={24} style={{ marginBottom: 50 }}>
                    Tất cả chức năng của phần mềm đã được tham khảo từ chính sách của <strong>Riot Games</strong>. <strong>KHÔNG</strong> ảnh hưởng, <strong>KHÔNG</strong> can thiệp đến dữ liệu nhạy cảm của trò chơi. Phần mềm này sẽ luôn luôn là <strong>mã nguồn mở</strong> để chứng minh sự minh bạch.
                </Col>

                <Col span={24} style={{ marginBottom: 50, lineHeight: 1.5 }}>
                    <span>For <strong>Developers</strong>. You can debug app features by <a onClick={openDevTools} style={{ fontWeight: 700, cursor: "pointer" }}>Open Devtools</a>. <br /> <i>All features are always available for reference purposes. Please do not use them for purposes that go against <strong>Riot Games</strong>&apos; policies. Author disclaims all liability for any actions you do.</i></span>
                </Col>

                <Col span={24}>
                    <span>&copy; 2022 - 2024 Vy Nghia<br /><strong>League Extensions</strong>&apos;s not bannable by <strong>Riot Vanguard</strong>.</span>
                </Col>
            </Row>
        </div>
    )
}
