"use client"

import React, { useEffect, useState } from 'react'
import { Space } from 'antd'

export default function About() {
    const [shell, setShell] = useState(null)

    useEffect(() => {
        const shell = window.require('electron').shell
        setShell(shell)
    }, [])

    const OpenLink = url => {
        return shell && shell.openExternal(url)
    }

    return (
        <div>
            <Space wrap>
                <p>
                    Phần mềm được viết & phát triển bởi <a onClick={() => OpenLink(`https:\/\/www.facebook.com\/nghiadev`)}><strong>Vy Nghĩa</strong></a> dựa trên <strong>ElectronJS</strong> (kết hợp từ <strong>NodeJS</strong> và <strong>VanillaJS</strong>). Nguồn cảm hứng và tài liệu tham khảo đến từ dự án <a onClick={() => OpenLink(`https:\/\/github.com\/Pupix\/rift-explorer`)}><strong>Rift Explorer</strong></a> của <strong>Pupix</strong>.
                </p>

                <p style={{ marginTop: 10 }}>
                    Tất cả chức năng của phần mềm đã được tham khảo từ chính sách của <strong>Riot Games</strong>. <strong>KHÔNG</strong> ảnh hưởng, <strong>KHÔNG</strong> can thiệp đến dữ liệu nhạy cảm của trò chơi. Phần mềm này sẽ luôn luôn là <strong>mã nguồn mở</strong> để chứng minh sự minh bạch.
                </p>

                <p style={{ marginTop: 20 }}>
                    <hr style={{ marginBottom: 10 }} />
                    <span>&copy; 2022 - 2024 Vy Nghia.<br /><strong>League Extensions</strong>&apos;s not bannable by <strong>Riot Vanguard</strong>.</span>
                </p>
            </Space>
        </div>
    )
}
