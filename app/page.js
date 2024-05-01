"use client"

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Breadcrumb, Layout, Menu, Alert, ConfigProvider, theme } from 'antd'
import { SkinOutlined, UserOutlined, UsergroupDeleteOutlined, ToolOutlined, InfoCircleOutlined } from '@ant-design/icons'

const { Header, Content, Footer, Sider } = Layout

import About from "./components/About"
import UnAllFriends from "./components/UnAllFriends"
import ProfileTools from "./components/ProfileTools"
import AccountStatus from "./components/AccountStatus"
import ChanegSkinBackground from "./components/ChangeSkinBackground"

export default function Home() {
  const [currentComponent, setNewComponent] = useState(<ChanegSkinBackground />)
  const [currentComponentName, setNewComponentName] = useState("Đổi nền trang phục")

  const [summonerInfo, setSummonerInfo] = useState({
    type: "warning",
    message: 'Vui lòng khởi động Liên Minh Huyền Thoại để sử dụng chức năng này!'
  })

  const menuItems = [
    {
      key: "1",
      icon: React.createElement(SkinOutlined),
      label: "Đổi nền trang phục",
      onClick: () => {
        setNewComponent(<ChanegSkinBackground />)
        setNewComponentName("Đổi nền trang phục")
      }
    },
    {
      key: "2",
      icon: React.createElement(UsergroupDeleteOutlined),
      label: "Hủy kết bạn",
      onClick: () => {
        setNewComponent(<UnAllFriends />)
        setNewComponentName("Hủy kết bạn")
      }
    },
    {
      key: "3",
      icon: React.createElement(ToolOutlined),
      label: "Công cụ hồ sơ",
      onClick: () => {
        setNewComponent(<ProfileTools />)
        setNewComponentName("Công cụ hồ sơ")
      }
    },
    {
      key: "4",
      icon: React.createElement(UserOutlined),
      label: "Trạng thái tài khoản",
      onClick: () => {
        setNewComponent(<AccountStatus />)
        setNewComponentName("Trạng thái tài khoản")
      }
    },
    {
      key: "5",
      icon: React.createElement(InfoCircleOutlined),
      label: "Giới thiệu",
      onClick: () => {
        setNewComponent(<About />)
        setNewComponentName("Giới thiệu")
      }
    }
  ]

  var firstLoad = false
  useEffect(() => {
    localStorage.setItem("summonerConnected", "false")
    const { ipcRenderer } = window.require('electron')

    ipcRenderer.on('mainprocess-response-summoner', (event, arg) => {
      setSummonerInfo({
        type: "success",
        message: <span>Đã nhận diện được <strong>Liên Minh Huyền Thoại</strong>, người chơi hiện tại là <strong>{arg}</strong></span>
      })

      localStorage.setItem("summonerConnected", "true")
    })

    ipcRenderer.on('mainprocess-response-lcu', async (event, arg) => {
      window.LcuInfo = arg
    })

    ipcRenderer.send('request-mainprocess-action', {
      type: "request_summoner"
    })
  }, [])

  return (
    <ConfigProvider
      theme={{
        // 1. Use dark algorithm
        algorithm: theme.darkAlgorithm,

        // 2. Combine dark algorithm and compact algorithm
        // algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
      }}
    >
      <Layout style={{ height: "100vh" }}>
        <Content
          style={{
            padding: '10px 30px',
          }}
        >
          <Breadcrumb
            style={{
              margin: '16px 0',
            }}
          >
            <Breadcrumb.Item>League Extensions</Breadcrumb.Item>
            <Breadcrumb.Item>{currentComponentName}</Breadcrumb.Item>
          </Breadcrumb>
          <Layout
            style={{
              padding: '24px 0',
              background: "#141414",
            }}
          >
            <Sider
              width={200}
            >
              <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                style={{
                  height: '100%',
                }}
                items={menuItems}
              />
            </Sider>
            <Content
              style={{
                padding: '0 24px',
                minHeight: 700,
              }}
            >
              <Alert message={summonerInfo.message} type={summonerInfo.type} showIcon />
              <div className="features-container">
                {currentComponent}
              </div>
            </Content>
          </Layout>
        </Content>
      </Layout>
    </ConfigProvider>

  )
}
