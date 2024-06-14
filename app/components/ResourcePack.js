"use client"

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Space, List, Divider } from 'antd'
import { DownloadOutlined, InfoCircleOutlined } from '@ant-design/icons'

export default function ResourcePack() {
    const [isLoading, setIsLoading] = useState(false)
    const [resourceList, setResourceList] = useState([
        {
            name: "Gói Việt Hóa ngôn ngữ Hán Tự",
            desc: <>Cung cấp phiên bản dịch thuật (phông chữ, ý nghĩa nội dung) cho các ngôn ngữ Nhật, Hàn và Trung Quốc.<br />Vẫn giữ lại lồng tiếng cho ngôn ngữ gốc.</>,
            btn: "Tải xuống"
        },
        {
            name: "Xóa Logo +18 (Vietnam)",
            desc: <>Bạn đã quá già để cần cái logo này? Chúng tôi sẽ xóa giúp bạn!<br />Nhưng đừng quên là chơi game quá 180 phút sẽ ảnh hưởng đến sức khỏe nhé!</>,
            btn: "Tải xuống"
        },
        {
            name: "Spirit Blossom (Map Hoa Linh)",
            desc: <>Source: <a href="https://www.runeforge.io/post/spirit-blossom-rift">https://www.runeforge.io/post/spirit-blossom-rift</a></>,
            btn: "Tìm hiểu"
        }
    ])


    return (
        <div>
            <div style={{ marginTop: 30, marginBottom: 30 }}>
                <List
                    itemLayout="horizontal"
                    dataSource={resourceList}
                    renderItem={(item, index) => (
                        <List.Item>
                            <List.Item.Meta
                                title={item.name}
                                description={item.desc}
                            />
                            <div><Button type="primary" htmlType="button" size="middle">
                                {item.btn}
                            </Button></div>
                        </List.Item>
                    )}
                />
            </div>

            <Divider />

            <Space size="small" style={{ marginBottom: 30 }}>
                <Button type="primary" htmlType="button" icon={<DownloadOutlined />}>
                    Tải xuống CSLOL-Manager
                </Button>

                <Button type="text" htmlType="button">
                    Xem hướng dẫn
                </Button>
            </Space>

            <p><InfoCircleOutlined /> Ứng dụng này được cung cấp bởi bên thứ 3. Hãy sử dụng vì mục đích trải nghiệm nghệ thuật, không ảnh hưởng đến trò chơi và người dùng khác.</p>
        </div>
    )
}
