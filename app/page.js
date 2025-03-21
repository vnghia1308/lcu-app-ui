"use client"

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { message, Breadcrumb, Layout, Menu, Alert, ConfigProvider, theme } from 'antd'
import { SkinOutlined, UserOutlined, UsergroupDeleteOutlined, ToolOutlined, InfoCircleOutlined, GiftOutlined, BlockOutlined } from '@ant-design/icons'

const { Header, Content, Footer, Sider } = Layout

import About from "./components/About"
import UnAllFriends from "./components/UnAllFriends"
import ProfileTools from "./components/ProfileTools"
import AccountStatus from "./components/AccountStatus"
import ChanegSkinBackground from "./components/ChangeSkinBackground"
import GiftShop from './components/GiftShop'
import MatchTools from "./components/MatchTools"
import HidenReward from './components/HidenReward'

import helper from '@/utils/helper'

export default function Home() {
  const [ValidAppVersion,] = useState(["3.0.2-20230614_1"])
  const [isInvalidAppVersion, setIsInvalidVersion] = useState(false)

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
      icon: React.createElement(ToolOutlined),
      label: "Công cụ trận đấu",
      onClick: () => {
        setNewComponent(<MatchTools />)
        setNewComponentName("Công cụ trận đấu")
      }
    },
    {
      key: "5",
      icon: React.createElement(UserOutlined),
      label: "Trạng thái tài khoản",
      onClick: () => {
        setNewComponent(<AccountStatus />)
        setNewComponentName("Trạng thái tài khoản")
      }
    },
    // {
    //   key: "6",
    //   icon: React.createElement(GiftOutlined),
    //   label: "Cửa hàng quà tặng",
    //   onClick: () => {
    //     setNewComponent(<GiftShop />)
    //     setNewComponentName("Cửa hàng quà tặng")
    //   }
    // },
    {
      key: "7",
      icon: React.createElement(BlockOutlined),
      label: "Phần thưởng ẩn",
      onClick: () => {
        setNewComponent(<HidenReward />)
        setNewComponentName("Phần thưởng ẩn")
      }
    },
    {
      key: "8",
      icon: React.createElement(InfoCircleOutlined),
      label: "Giới thiệu",
      onClick: () => {
        setNewComponent(<About />)
        setNewComponentName("Giới thiệu")
      }
    }
  ]

  useEffect(() => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    })

    const appVersion = params.v

    if (!ValidAppVersion.includes(appVersion)) {
      setSummonerInfo({
        type: "error",
        message: <span>Phiên bản ứng dụng dã hết hạn</span>
      })

      return setIsInvalidVersion(true)
    }

    // setup default
    localStorage.setItem("isAutoAcceptMatch", false)

    const LCUWebSocketSubscriptions = [
      // Gameflow Phase
      {
        url: "/lol-gameflow/v1/gameflow-phase",
        event: async data => {
          const CurrentPhase = data

          if (CurrentPhase == "ReadyCheck") {
            const isAutoAcceptMatch = localStorage.getItem("isAutoAcceptMatch")

            if ("LcuInfo" in window && isAutoAcceptMatch == "true") {
              try {
                await axios.post(helper.getLeagueAPIUrl(window.LcuInfo.port, "/lol-matchmaking/v1/ready-check/accept"), {},
                  {
                    headers: {
                      'Authorization': 'Basic ' + helper.getLeagueAPIPassword(window.LcuInfo.password),
                      'Content-Type': 'application/json'
                    }
                  })
              } catch { }
            }
          }
        }
      }
    ]

    const WebSocket = window.require('ws')

    const interval = setInterval(async () => {
      if ("LcuInfo" in window) {
        try {
          const res0 = await axios.get(helper.getLeagueAPIUrl(window.LcuInfo.port, "/lol-summoner/v1/current-summoner"),
            {
              headers: {
                'Authorization': 'Basic ' + helper.getLeagueAPIPassword(window.LcuInfo.password),
                'Content-Type': 'application/json'
              }
            })

          const summoner = res0.data

          let SummonerId = summoner.summonerId
          let SummonerName = summoner.gameName

          if (summoner.unnamed) {
            SummonerName = "Không xác định"
          }

          if (typeof SummonerName == "undefined" || SummonerName == "undefined" || SummonerName == "") {
            if (!summoner.unnamed) {
              throw Error("undefined SummonerName")
            }

            return
          }

          setSummonerInfo({
            type: "success",
            message: <span>Đã nhận diện được <strong>Liên Minh Huyền Thoại</strong>, người chơi hiện tại là <strong>{SummonerName}</strong></span>
          })

          clearInterval(interval)
        } catch { }
      } else {
        helper.GetLCUInfo().then(async result => {
          if (result) {
            const ws = new WebSocket(`wss://riot:${window.LcuInfo.password}@127.0.0.1:${window.LcuInfo.port}`, {
              rejectUnauthorized: false,
              headers: {
                Authorization: 'Basic ' + helper.getLeagueAPIPassword(window.LcuInfo.password)
              },
            })

            ws.on('error', () => {
              message.error("Đã có lỗi xảy ra khi kết nối tới máy chủ của LMHT")
            })

            ws.on('open', () => {
              ws.send(JSON.stringify([5, 'OnJsonApiEvent']))
            })

            ws.on("message", (content) => {
              try {
                const json = JSON.parse(content)
                const [res] = json.slice(2)

                const sb = LCUWebSocketSubscriptions.find(s => s.url == res.uri)

                if (sb) {
                  sb.event(res.data)
                }
              }
              catch { }
            })
          }
        })
      }
    }, 1e3)

    // const { ipcRenderer } = window.require('electron')

    // ipcRenderer.on('mainprocess-response-lcu', async (event, arg) => {
    //   window.LcuInfo = arg

    //   // Get summoner Info
    //   try {
    //     const res0 = await axios.get(helper.getLeagueAPIUrl(window.LcuInfo.port, "/lol-summoner/v1/current-summoner"),
    //       {
    //         headers: {
    //           'Authorization': 'Basic ' + helper.getLeagueAPIPassword(window.LcuInfo.password),
    //           'Content-Type': 'application/json'
    //         }
    //       })

    //     const summoner = res0.data

    //     let SummonerId = summoner.summonerId
    //     let SummonerName = summoner.gameName

    //     if (summoner.unnamed) {
    //       SummonerName = "Không xác định"
    //     }

    //     if (typeof SummonerName == "undefined" || SummonerName == "undefined" || SummonerName == "") {
    //       if (!summoner.unnamed) {
    //         throw Error("undefined SummonerName")
    //       }

    //       return
    //     }

    //     setSummonerInfo({
    //       type: "success",
    //       message: <span>Đã nhận diện được <strong>Liên Minh Huyền Thoại</strong>, người chơi hiện tại là <strong>{SummonerName}</strong></span>
    //     })

    //     clearInterval(interval)
    //   } catch { }

    //   // Connect LCU Socket
    //   const ws = new WebSocket(`wss://riot:${window.LcuInfo.password}@127.0.0.1:${window.LcuInfo.port}`, {
    //     rejectUnauthorized: false,
    //     headers: {
    //       Authorization: 'Basic ' + helper.getLeagueAPIPassword(window.LcuInfo.password)
    //     },
    //   })

    //   ws.on('error', () => {
    //     message.error("Đã có lỗi xảy ra khi kết nối tới máy chủ của LMHT")
    //   })

    //   ws.on('open', () => {
    //     ws.send(JSON.stringify([5, 'OnJsonApiEvent']))
    //   })

    //   ws.on("message", (content) => {
    //     try {
    //       const json = JSON.parse(content)
    //       const [res] = json.slice(2)

    //       const sb = LCUWebSocketSubscriptions.find(s => s.url == res.uri)

    //       if (sb) {
    //         sb.event(res.data)
    //       }
    //     }
    //     catch { }
    //   })
    // })

    // ipcRenderer.send('request-mainprocess-action', {
    //   type: "request_summoner"
    // })
  }, [])

  const OpenAppGithubRepo = _ => {
    return window.require('electron').shell.openExternal("https://github.com/vnghia1308/lcu/releases")
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <Layout style={{ height: "95vh" }}>
        <Content
          style={{
            padding: '10px 30px',
          }}
        >
          <Breadcrumb
            style={{
              margin: '16px 0',
            }}
            items={[
              {
                title: "League Extensions"
              },
              {
                title: currentComponentName
              }
            ]}
          />
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
              {!isInvalidAppVersion || currentComponentName == "Giới thiệu" ? <div className="features-container">
                {currentComponent}
              </div> : <div style={{ marginTop: 10 }}>Phiên bản đang khởi chạy không phù hợp, khi bạn nhìn thấy nội dung này có nghĩa là có ứng dụng này có một phiên bản khác <strong>cần phải cập nhật</strong>  (vì lý do bảo mật, thay đổi công nghệ, etc.). Bạn có thể tìm một phiên bản mới <a onClick={OpenAppGithubRepo} style={{ fontWeight: 700, cursor: "pointer" }}>tại đây</a>!</div>}
            </Content>
          </Layout>
        </Content>
      </Layout>
    </ConfigProvider>

  )
}
